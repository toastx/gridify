use anchor_lang::prelude::*;

pub fn register_device(ctx: Context<RegisterDevice>, device_id: String, price_per_request: u64) -> Result<()> {
    let device = &mut ctx.accounts.device_account;
    device.owner = *ctx.accounts.owner.key;
    device.device_id = device_id;
    device.price_per_request = price_per_request;
    device.balance = 0;
    device.subscriptions = Vec::new();
    Ok(())
}

pub fn add_funds_to_account(ctx: Context<AddFunds>, amount: u64) -> Result<()> {
    let device = &mut ctx.accounts.device_account;
    device.balance += amount;
    Ok(())
}

pub fn subscribe_to_data(ctx: Context<RequestData>) -> Result<()> {
    let provider = &mut ctx.accounts.provider_device;
    let consumer = &mut ctx.accounts.consumer_device;

    if consumer.balance < provider.price_per_request {
        return Err(ErrorCode::InsufficientBalance.into());
    }

    consumer.balance -= provider.price_per_request;
    provider.balance += provider.price_per_request;

    let provider_device_id = provider.device_id.clone();
    let consumer_device_id = consumer.device_id.clone();


    consumer.subscriptions.push(Subscription {
        provider_id: provider_device_id.to_string(),
        consumer_id: consumer_device_id.to_string(),
        timestamp: Clock::get()?.unix_timestamp,
        active: true,
    });

    emit!(DataShared {
        provider_id: provider_device_id.to_string(),
        consumer_id: consumer_device_id.to_string(),
        amount: provider.price_per_request,
    });
    Ok(())
}

pub fn show_active_subscription(ctx: Context<ShowActiveSubscription>) -> Result<()> {
    let device = &ctx.accounts.device_account;
    
    for subscription in device.subscriptions.iter() {
        if subscription.active {
            emit!(SubscriptionStatus {
                provider_id: subscription.provider_id.clone(),
                consumer_id: subscription.consumer_id.clone(),
                timestamp: subscription.timestamp,
            });
        }
    }
    Ok(())
}

pub fn cancel_subscription(ctx: Context<CancelSubscription>, provider_id: String) -> Result<()> {
    let consumer = &mut ctx.accounts.consumer_device;
    
    for sub in consumer.subscriptions.iter_mut() {
        if sub.provider_id == provider_id && sub.active {
            sub.active = false;
            emit!(SubscriptionStatus {
                provider_id: sub.provider_id.clone(),
                consumer_id: sub.consumer_id.clone(),
                timestamp: Clock::get()?.unix_timestamp,
            });
            return Ok(());
        }
    }
    
    Err(ErrorCode::SubscriptionNotFound.into())
}

#[derive(Accounts)]
pub struct CancelSubscription<'info> {
    #[account(mut)]
    pub consumer_device: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ShowActiveSubscription<'info> {
    pub device_account: Account<'info, DeviceAccount>,
}


#[derive(Accounts)]
pub struct RegisterDevice<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 8 + (10 * (32 + 32 + 8 + 1))
    )]
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
    pub subscriptions: Vec<Subscription>,
}

#[event]
pub struct DataShared {
    pub provider_id: String,
    pub consumer_id: String,
    pub amount: u64,
}

#[account]
pub struct Subscription {
    pub provider_id: String,
    pub consumer_id: String,
    pub timestamp: i64,
    pub active: bool,
}

#[event]
pub struct SubscriptionStatus {
    pub provider_id: String,
    pub consumer_id: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance to request data.")]
    InsufficientBalance,
    #[msg("Subscription not found or already inactive.")]
    SubscriptionNotFound,
}