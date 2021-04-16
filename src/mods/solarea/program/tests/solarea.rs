use solana_bpf_loader_program::serialization::serialize_parameters;
use solana_program::{
    bpf_loader, entrypoint::SUCCESS, program_error::ProgramError, pubkey::Pubkey,
};
use solana_sdk::{account::AccountSharedData, keyed_account::KeyedAccount};
use spl_shared_memory::entrypoint;

#[test]
fn test_share_data() {
}
