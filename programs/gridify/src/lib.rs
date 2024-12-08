use anchor_lang::prelude::*;
pub mod grid;
pub mod token;
use grid::*;
use token::*;

declare_id!("3ZeNA6X2Nf14Yx2AGq9WHU9fYqjVnoMrruxmBE9ZnXka");

#[program]
pub mod gridify {
    use super::*;

    pub fn register(ctx: Context<RegisterDevice>, device_id: String, price_per_request: u64) -> Result<()> {
        register_device(ctx, device_id, price_per_request)
    }
    pub fn add_funds(ctx: Context<AddFunds>, amount: u64) -> Result<()> {
        add_funds_to_account(ctx, amount)
    }
    pub fn subscribe(ctx: Context<RequestData>) -> Result<()> {
        subscribe_to_data(ctx)
    }
    pub fn transfer(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        transfer_tokens(ctx, amount)
    }
    pub fn mint(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        mint_token(ctx, amount)
    }
    pub fn active_subscription(ctx: Context<ShowActiveSubscription>) -> Result<()> {
        show_active_subscription(ctx)
    }

}


