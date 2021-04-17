use arrayref::{array_refs, mut_array_refs};
use solana_program::pubkey::Pubkey;
use solana_program::program_error::ProgramError;

/// A more efficient `copy_from_slice` implementation.
pub fn fast_copy(mut src: &[u8], mut dst: &mut [u8]) {
    while src.len() >= 8 {
        #[allow(clippy::ptr_offset_with_cast)]
            let (src_word, src_rem) = array_refs![src, 8; ..;];
        #[allow(clippy::ptr_offset_with_cast)]
            let (dst_word, dst_rem) = mut_array_refs![dst, 8; ..;];
        *dst_word = *src_word;
        src = src_rem;
        dst = dst_rem;
    }
    unsafe {
        std::ptr::copy_nonoverlapping(src.as_ptr(), dst.as_mut_ptr(), src.len());
    }
}

pub fn unpack_pubkey(input: &[u8]) -> Result<(Pubkey, &[u8]), ProgramError> {
    if input.len() >= 32 {
        let (key, rest) = input.split_at(32);
        let pk = Pubkey::new(key);
        Ok((pk, rest))
    } else {
        Err(ProgramError::InvalidInstructionData.into())
    }
}
