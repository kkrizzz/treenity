#[cfg(test)]
mod test {
    use solana_program::{
        system_program,
        system_instruction::{create_account},
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
    };

    use crate::{
        entrypoint::process_instruction,
    };
    use solana_program_test::{processor, ProgramTest};
    use solana_sdk::transaction::Transaction;
    use solana_sdk::signature::{Signer, Keypair};
    use solana_sdk::account::Account;
    use std::str::FromStr;
    use crate::utils::from_le3_bytes;

    #[tokio::test]
    async fn unpack_3le_bytes() {
        let offset = from_le3_bytes(&[96 as u8, 3, 0]);
        assert_eq!(offset, 864);
    }

    #[tokio::test]
    async fn save() {
        let program_id = Pubkey::new_unique();
        let mut test = ProgramTest::new(
            "solarea_storage",
            program_id,
            processor!(process_instruction),
        );

        // create wallet
        let wallet = Keypair::new();
        test.add_account(wallet.pubkey(), Account::new(
            1_000_000_000,
            0,
            &system_program::id(),
        ));


        let (mut banks_client, _payer, recent_blockhash) = test.start().await;


        let rent = banks_client.get_rent().await.unwrap();
        let rent_address = Pubkey::from_str("SysvarRent111111111111111111111111111111111").unwrap();


        // create instruction data
        let address: &[u8] = b"short_name";
        let context = b"react";
        let name = b"default";

        let seed: &[&[u8]] = &[
            address, b"|",
            context, b"|",
            name,
        ];

        let (storage_address, derived_byte) = Pubkey::find_program_address(seed, &program_id);


        let data: &[u8] = b"add(() => <div>Hello Solarea!</div>)";
        let area_size = 32 + 2 + data.len();

        // create instruction

        {
            let create_data: Vec<u8> =
                [
                    &[1], // intsruction create
                    &[address.len() as u8], address,
                    &[context.len() as u8], context,
                    &[name.len() as u8], name,
                    &[derived_byte],
                    &(area_size as u32).to_le_bytes(), // data length
                ].concat();

            let create_accounts = vec![
                AccountMeta::new(wallet.pubkey(), true),
                AccountMeta::new(rent_address, false),
                AccountMeta::new(storage_address, false),
                AccountMeta::new_readonly(system_program::id(), false),
            ];
            let create_instruction = Instruction { program_id, data: create_data, accounts: create_accounts };

            let store_data: Vec<u8> =
                [
                    &[2], // intsruction create
                    &[address.len() as u8], address,
                    &[context.len() as u8], context,
                    &[name.len() as u8], name,
                    &[derived_byte],
                    &[0, 0], data
                ].concat();

            let store_accounts = vec![
                AccountMeta::new(wallet.pubkey(), true),
                AccountMeta::new(storage_address, false),
            ];
            let store_instruction = Instruction { program_id, data: store_data, accounts: store_accounts };


            // let create_account_system = create_account(
            //     &wallet.pubkey(),
            //     &storage_address,
            //     rent_storage,
            //     area_size as u64,
            //     &program_id,
            // );

            // let rent_storage = rent.minimum_balance(area_size);

            let mut transaction = Transaction::new_with_payer(
                &[
                    // create_account_system,
                    create_instruction,
                    store_instruction,
                ],
                Some(&wallet.pubkey()),
            );
            transaction.sign(&[&wallet], recent_blockhash);
            banks_client.process_transactions(vec![transaction.clone(), transaction]).await.unwrap();

            let wallet_result = banks_client.get_account(wallet.pubkey()).await.unwrap().unwrap();
            let storage_acc = banks_client.get_account(storage_address).await.unwrap().unwrap();
            // Processor::process(&program_id, &accounts, &instruction_data).unwrap();
            assert_eq!(wallet_result.lamports, 55000);
        }
    }

    // async fn deposit() {
    //     let program_id = Pubkey::new_unique();
    //     let mut test = ProgramTest::new(
    //         "solana_gridex1",
    //         program_id,
    //         processor!(process_instruction),
    //     );


    //     // create wallet
    //     let wallet = Keypair::new();
    //     test.add_account(wallet.pubkey(), Account::new(
    //         100000,
    //         0,
    //         &system_program::id(),
    //     ));

    //     let (mut banks_client, _payer, recent_blockhash) = test.start().await;

    //     let (acc_key, _) = create_address_with_seed(&wallet.pubkey(), &SEED, &program_id);


    //     let lamports = 20000;
    //     {
    //         let mut instruction_data = vec![0; mem::size_of::<u64>()];
    //         LittleEndian::write_u64(&mut instruction_data, lamports);
    //         instruction_data.push(1); // instruction Deposit

    //         let accounts = vec![
    //             AccountMeta::new(wallet.pubkey(), true),
    //             AccountMeta::new(acc_key, false),
    //             AccountMeta::new_readonly(system_program::id(), false),
    //         ];

    //         let instruction = Instruction { program_id, data: instruction_data, accounts };
    //         let mut transaction = Transaction::new_with_payer(
    //             &[instruction.clone(), instruction],
    //             Some(&wallet.pubkey()),
    //         );
    //         transaction.sign(&[&wallet], recent_blockhash);
    //         banks_client.process_transactions(vec![transaction.clone(), transaction]).await.unwrap();

    //         let wallet_result = banks_client.get_account(wallet.pubkey()).await.unwrap().unwrap();
    //         let inner_acc = banks_client.get_account(acc_key).await.unwrap().unwrap();
    //         // Processor::process(&program_id, &accounts, &instruction_data).unwrap();
    //         assert_eq!(wallet_result.lamports, 55000);
    //         assert_eq!(inner_acc.lamports, lamports * 2);
    //     }
    // }

    // #[tokio::test]
    // async fn widthdraw() {
    //     let program_id = Pubkey::new_unique();
    //     let mut test = ProgramTest::new(
    //         "solana_gridex1",
    //         program_id,
    //         processor!(process_instruction),
    //     );

    //     // create wallet
    //     let gridex_account = Keypair::new();
    //     let wallet = Keypair::new();
    //     test.add_account(wallet.pubkey(), Account::new(
    //         100000,
    //         0,
    //         &system_program::id(),
    //     ));
    //     test.add_account(gridex_account.pubkey(), Account::new(
    //         100000,
    //         0,
    //         &system_program::id(),
    //     ));

    //     let (acc_key, _) = create_address_with_seed(&wallet.pubkey(), &SEED, &program_id);
    //     test.add_account(acc_key.clone(), Account::new(
    //         100000,
    //         0,
    //         &program_id,
    //     ));

    //     let (mut banks_client, _payer, recent_blockhash) = test.start().await;


    //     let lamports = 20000;
    //     {
    //         let mut instruction_data = vec![0; mem::size_of::<u64>()];
    //         LittleEndian::write_u64(&mut instruction_data, lamports);
    //         instruction_data.push(2); // instruction Deposit

    //         let accounts = vec![
    //             AccountMeta::new(acc_key, false),
    //             AccountMeta::new(wallet.pubkey(), true),
    //             AccountMeta::new_readonly(system_program::id(), false),
    //         ];

    //         let instruction = Instruction { program_id, data: instruction_data, accounts };
    //         let mut transaction = Transaction::new_with_payer(
    //             &[instruction.clone(), instruction],
    //             Some(&wallet.pubkey()),
    //         );
    //         transaction.sign(&[&wallet], recent_blockhash);
    //         banks_client.process_transactions(vec![transaction.clone(), transaction]).await.unwrap();

    //         let wallet_result = banks_client.get_account(wallet.pubkey()).await.unwrap().unwrap();
    //         let inner_acc = banks_client.get_account(acc_key).await.unwrap().unwrap();
    //         // Processor::process(&program_id, &accounts, &instruction_data).unwrap();
    //         assert_eq!(wallet_result.lamports, 135000);
    //         assert_eq!(inner_acc.lamports, 100000 - lamports * 2);
    //     }
    // }

    // // #[tokio::test]
    // async fn proxy() {
    //     let program_id = Pubkey::new_unique();
    //     let mut test = ProgramTest::new(
    //         "solana_gridex1",
    //         program_id,
    //         processor!(process_instruction),
    //     );

    //     // create wallet
    //     let gridex_account = Keypair::new();
    //     let wallet = Keypair::new();
    //     test.add_account(wallet.pubkey(), Account::new(
    //         100000,
    //         0,
    //         &system_program::id(),
    //     ));
    //     test.add_account(gridex_account.pubkey(), Account::new(
    //         100000,
    //         0,
    //         &system_program::id(),
    //     ));

    //     let (acc_key, _) = create_address_with_seed(&wallet.pubkey(), &SEED, &program_id);
    //     test.add_account(acc_key.clone(), Account::new(
    //         100000,
    //         0,
    //         &program_id,
    //     ));

    //     let (mut banks_client, _payer, recent_blockhash) = test.start().await;


    //     {
    //         // let lamports = 20000;
    //         // let mut instruction_data = vec![0; mem::size_of::<u64>()];
    //         // LittleEndian::write_u64(&mut instruction_data, lamports);
    //         // instruction_data.push(1); // instruction Deposit

    //         // let accounts = vec![
    //         //     AccountMeta::new(wallet.pubkey(), true),
    //         //     AccountMeta::new(acc_key, false),
    //         //     AccountMeta::new_readonly(system_program::id(), false),
    //         // ];

    //         // let deposit_instruction = Instruction {
    //         //     program_id,
    //         //     data: instruction_data,
    //         //     accounts: accounts.clone(),
    //         // };

    //         let mut proxy_transfer_instruction = system_instruction::transfer(
    //             &acc_key,
    //             &wallet.pubkey(),
    //             10000,
    //         );
    //         {
    //             // update instruction to proxy it thru our program.
    //             proxy_transfer_instruction.data.push(0); // instruction 0
    //             proxy_transfer_instruction.program_id = program_id.clone(); // change program_id to proxy
    //             let accs = &mut proxy_transfer_instruction.accounts;
    //             accs[0].is_signer = false; // remove signer-accounts, we will be signer

    //             accs.push(AccountMeta::new_readonly(wallet.pubkey(), false)); // add all the keys,
    //             accs.push(AccountMeta::new(acc_key, false)); // we need to run transasction thru
    //             accs.push(AccountMeta::new_readonly(system_program::id(), false)); // proxy in this order
    //             accs.push(AccountMeta::new_readonly(program_id, false));
    //             accs.push(AccountMeta::new_readonly(gridex_account.pubkey(), true));
    //         }


    //         let mut transaction = Transaction::new_with_payer(
    //             &[proxy_transfer_instruction],
    //             Some(&gridex_account.pubkey()),
    //         );
    //         transaction.sign(&[&gridex_account], recent_blockhash);
    //         banks_client.process_transaction(transaction).await.unwrap();

    //         let wallet_result = banks_client.get_account(wallet.pubkey()).await.unwrap().unwrap();
    //         let gridex_result = banks_client.get_account(gridex_account.pubkey()).await.unwrap().unwrap();
    //         let inner_acc = banks_client.get_account(acc_key).await.unwrap().unwrap();

    //         assert_eq!(inner_acc.owner, program_id);
    //         // Processor::process(&program_id, &accounts, &instruction_data).unwrap();
    //         assert_eq!(wallet_result.lamports, 110000);
    //         assert_eq!(gridex_result.lamports, 95000);
    //         assert_eq!(inner_acc.lamports, 90000);
    //     }
    // }
}
