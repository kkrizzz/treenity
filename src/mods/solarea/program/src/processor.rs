//! Program state processor

use std::slice::{from_raw_parts_mut};

// use byteorder::{ByteOrder, LittleEndian};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use solana_program::system_instruction::{create_account};

use crate::utils::{fast_copy};
use solana_program::rent::Rent;
use std::convert::TryInto;

/// Program state handler.
pub struct Processor {}

impl Processor {
    /// Processes an [Instruction](enum.Instruction.html).
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
        let (instruction, input) = input.split_first().unwrap();

        return match instruction {
            1 => create(program_id, accounts, input),
            2 => store(program_id, accounts, input),
            3 => remove(program_id, accounts),
            _ => Err(ProgramError::Custom(0x222)),
        };
    }
}

pub fn unpack_data<'a>(user_account: &'a AccountInfo, input: &'a [u8]) -> (&'a [u8], &'a [u8], &'a [u8], u8, &'a [u8]) {
    // 3x strings - 1 bytes size + <size> bytes ascii
    //     - short address - 1 byte size or value "255" if address is in account
    //     - context - 1 byte + ascii - up to 32 bytes
    //     - name - 1 byte + ascii - up to 32 bytes
    // 1 byte - seed additional byte for program-derived-address
    // 2 byte - data type (react script, link, mime type)
    // N bytes data - up to 8MB

    // unwrap destination address
    let (&address_size, input) = input.split_first().unwrap();
    let (address, input) = if address_size == 255 {
        (user_account.key.as_ref(), input)
    } else {
        input.split_at(address_size as usize)
    };
    let (&context_size, input) = input.split_first().unwrap();
    let (context, input) = input.split_at(context_size as usize);

    let (&name_size, input) = input.split_first().unwrap();
    let (name, input) = input.split_at(name_size as usize);

    let (&derived_byte, input) = input.split_first().unwrap();

    return (address, context, name, derived_byte, input);
}

/// instruction deposit
pub fn create(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let user_account = next_account_info(account_info_iter)?;
    let rent = Rent::from_account_info(next_account_info(account_info_iter)?)?;
    let storage_account = next_account_info(account_info_iter)?;

    let (address, context, name, derived_byte, input) = unpack_data(user_account, input);
    let (length_bytes, input) = input.split_at(4);
    let (type_bytes, _) = input.split_at(2);

    let area_size = u32::from_le_bytes(length_bytes.try_into().unwrap());
    let lamports = rent.minimum_balance(area_size as usize);

    let seed = &[
        address.as_ref(), b"|",
        context.as_ref(), b"|",
        name.as_ref(),
        &[derived_byte],
    ];
    let storage_address = Pubkey::create_program_address(seed, &program_id).unwrap();

    let instruction = create_account(
        &user_account.key,
        &storage_address,
        lamports,
        area_size as u64,
        &program_id,
    );
    invoke_signed(&instruction, &accounts, &[seed])?;

    // copy input data to account data
    unsafe {
        let owner_data = from_raw_parts_mut(
            storage_account.data.borrow_mut().as_mut_ptr(),
            32,
        );
        fast_copy(&user_account.key.to_bytes(), owner_data);

        let type_data = from_raw_parts_mut(
            storage_account.data.borrow_mut().as_mut_ptr().offset(32),
            2,
        );
        fast_copy(type_bytes, type_data);
    }

    Ok(())
}

pub fn store(_program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature.into());
    }

    let storage_account = next_account_info(account_info_iter)?;

    let owner_pubkey = Pubkey::new_from_array(storage_account.data.borrow()[0..32].try_into().unwrap());
    if user_account.key != &owner_pubkey {
        return Err(ProgramError::InvalidSeeds.into());
    }

    let (offset_bytes, input) = input.split_at(4);
    let offset = u32::from_le_bytes(offset_bytes.try_into().unwrap());
    // let offset =
    //     (offset_bytes[0] as u32) << 16 +
    //     (offset_bytes[1] as u32) << 8 +
    //     offset_bytes[2];
    let data_offset = offset + 32 + 2; // owner address + 2 bytes data type

    let area_size = input.len();

    // copy input data to account data
    unsafe {
        let account_data = from_raw_parts_mut(
            storage_account.data.borrow_mut().as_mut_ptr().offset(data_offset as isize),
            area_size,
        );
        fast_copy(&input.as_ref(), account_data);
    }

    Ok(())
}

/// instruction test withdraw
pub fn remove(_program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature.into());
    }
    let storage_account = next_account_info(account_info_iter)?;

    let owner_pubkey = Pubkey::new_from_array(storage_account.data.borrow()[0..32].try_into().unwrap());
    if user_account.key != &owner_pubkey {
        return Err(ProgramError::InvalidSeeds.into());
    }

    let lamports = storage_account.lamports();

    **storage_account.try_borrow_mut_lamports()? -= lamports;
    **user_account.try_borrow_mut_lamports()? += lamports;

    Ok(())
}
