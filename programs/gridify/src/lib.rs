use anchor_lang::prelude::*;
pub mod grid;
pub mod token;
use grid::*;
use token::*;

declare_id!("3ZeNA6X2Nf14Yx2AGq9WHU9fYqjVnoMrruxmBE9ZnXka");

#[program]
pub mod gridify {
    use super::*;

    pub fn register(ctx: Context<RegisterDevice>, grid_id: Pubkey) -> Result<()> {
        register_device(ctx, grid_id)
    }
    pub fn ping(ctx: Context<PingDevice>) -> Result<()> {
        ping_device(ctx)
    }
    pub fn faulty(ctx: Context<MarkFaulty>) -> Result<()> {
        mark_as_faulty(ctx)
    }
    pub fn remove(ctx: Context<RemoveDevice>) -> Result<()> {
        remove_device(ctx)
    }
    pub fn get_device(ctx: Context<GetDeviceInfo>) -> Result<DeviceInfo> {
        get_device_info(ctx)
    }
    pub fn claim(ctx: Context<ClaimRewards>) -> Result<()> {
        claim_rewards(ctx)
    }
    pub fn new_grid(ctx: Context<CreateGrid>) -> Result<()> {
        create_grid(ctx)
    }
    pub fn transfer(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        transfer_tokens(ctx, amount)
    }

}


