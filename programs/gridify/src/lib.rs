use anchor_lang::prelude::*;
use std::collections::BTreeMap;

declare_id!("3ZeNA6X2Nf14Yx2AGq9WHU9fYqjVnoMrruxmBE9ZnXka");

#[program]
pub mod gridify {
    use super::*;

    pub fn register_device(ctx: Context<RegisterDevice>, device_id: String, price_per_request: u64) -> Result<()> {
        let device = &mut ctx.accounts.device_account;
        device.owner = *ctx.accounts.owner.key;
        device.device_id = device_id;
        device.price_per_request = price_per_request;
        device.balance = 0;
        Ok(())
    }

    pub fn add_funds(ctx: Context<AddFunds>, amount: u64) -> Result<()> {
        let device = &mut ctx.accounts.device_account;
        device.balance += amount;
        Ok(())
    }

    pub fn request_data(ctx: Context<RequestData>, device_id: String) -> Result<()> {
        let provider = &mut ctx.accounts.provider_device;
        let consumer = &mut ctx.accounts.consumer_device;

        
        if consumer.balance < provider.price_per_request {
            return Err(ErrorCode::InsufficientBalance.into());
        }

        consumer.balance -= provider.price_per_request;
        provider.balance += provider.price_per_request;

        emit!(DataShared {
            provider_id: provider.device_id.clone(),
            consumer_id: consumer.device_id.clone(),
            amount: provider.price_per_request,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterDevice<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 8 + 8)]
    pub device_account: Account<'info, DeviceAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddFunds<'info> {
    #[account(mut)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct RequestData<'info> {
    #[account(mut)]
    pub provider_device: Account<'info, DeviceAccount>,
    #[account(mut)]
    pub consumer_device: Account<'info, DeviceAccount>,
}

#[account]
pub struct DeviceAccount {
    pub owner: Pubkey,
    pub device_id: String,
    pub price_per_request: u64,
    pub balance: u64,
}

#[event]
pub struct DataShared {
    pub provider_id: String,
    pub consumer_id: String,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance to request data.")]
    InsufficientBalance,
}

