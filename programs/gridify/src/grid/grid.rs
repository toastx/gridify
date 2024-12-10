use anchor_lang::prelude::*;

pub fn register_device(
    ctx: Context<RegisterDevice>,
    grid_id: Pubkey,
) -> Result<()> {
    let device_account = &mut ctx.accounts.device_account;
    device_account.owner = *ctx.accounts.owner.key;
    device_account.is_active = true;
    device_account.total_uptime = 0;
    device_account.last_ping = Clock::get()?.unix_timestamp;
    let grid_account = &mut ctx.accounts.grid_account;

    require!(grid_account.key() == grid_id, CustomError::InvalidGridId);
    grid_account.devices.push(*device_account.to_account_info().key);
    device_account.grid_id = grid_id;
    device_account.fallback_devices = grid_account.devices.clone();

    Ok(())
}

pub fn ping_device(ctx: Context<PingDevice>) -> Result<()> {
    let device_account = &mut ctx.accounts.device_account;
    let current_time = Clock::get()?.unix_timestamp;
    if device_account.is_active {
        device_account.total_uptime += (current_time - device_account.last_ping) as u64;
    }
    device_account.last_ping = current_time;
    Ok(())
}

pub fn mark_as_faulty(ctx: Context<MarkFaulty>) -> Result<()> {
    let device_account = &mut ctx.accounts.device_account;
    require!(device_account.is_active, CustomError::DeviceAlreadyFaulty);
    device_account.is_active = false;
    Ok(())
}
pub fn remove_device(ctx: Context<RemoveDevice>) -> Result<()> {
    let device_account = &mut ctx.accounts.device_account;
    let grid_account = &mut ctx.accounts.grid_account;

    require!(grid_account.devices.contains(&device_account.owner), CustomError::DeviceNotInGrid);
    grid_account.devices.retain(|&device| device != *device_account.to_account_info().key);

    Ok(())
}

pub fn get_device_info(ctx: Context<GetDeviceInfo>) -> Result<DeviceInfo> {
    let device_account = &ctx.accounts.device_account;
    Ok(DeviceInfo {
        owner: device_account.owner,
        is_active: device_account.is_active,
        fallback_devices: device_account.fallback_devices.clone(),
        total_uptime: device_account.total_uptime,
        last_ping: device_account.last_ping,
    })
}

pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let device_account = &mut ctx.accounts.device_account;
    require!(device_account.pending_rewards > 0.0, CustomError::NoRewardsPending);
    device_account.pending_rewards = 0.0;
    Ok(())
}

pub fn create_grid(ctx: Context<CreateGrid>) -> Result<()> {
    let grid_account = &mut ctx.accounts.grid_account;
    grid_account.manager = *ctx.accounts.manager.key;
    grid_account.devices = vec![]; // Start with an empty device list
    Ok(())
}


#[derive(Accounts)]
pub struct RegisterDevice<'info> {
    #[account(init, payer = owner, space = 8 + DeviceAccount::SIZE)]
    pub device_account: Account<'info, DeviceAccount>,
    #[account(mut)]
    pub grid_account: Account<'info, GridAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PingDevice<'info> {
    #[account(mut, has_one = owner)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarkFaulty<'info> {
    #[account(mut, has_one = owner)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,

}

#[derive(Accounts)]
pub struct GetDeviceInfo<'info> {
    #[account(mut, has_one = owner)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut, has_one = owner)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateGrid<'info> {
    #[account(init, payer = manager, space = 8 + GridAccount::SIZE)]
    pub grid_account: Account<'info, GridAccount>,
    #[account(mut)]
    pub manager: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveDevice<'info> {
    #[account(mut, has_one = owner)]
    pub device_account: Account<'info, DeviceAccount>,
    pub owner: Signer<'info>,
    pub grid_account: Account<'info, GridAccount>,
}


#[account]
pub struct DeviceAccount {
    pub owner: Pubkey,
    pub grid_id: Pubkey,             
    pub is_active: bool,            
    pub fallback_devices: Vec<Pubkey>,
    pub total_uptime: u64,          
    pub last_ping: i64,   
    pub pending_rewards: f64   
}

#[account]
pub struct GridAccount {            
    pub manager: Pubkey,             
    pub devices: Vec<Pubkey>,        
}

impl DeviceAccount {
    const SIZE: usize = 32 + 1 + 4 + (32 * 5) + 8 + 8+8; 
}

impl GridAccount {
    const SIZE: usize = 32 + 32 + 4; 
}

#[error_code]
pub enum CustomError {
    #[msg("Device is already marked as faulty.")]
    DeviceAlreadyFaulty,
    #[msg("No rewards are pending for this device.")]
    NoRewardsPending,
    #[msg("Invalid grid ID.")]
    InvalidGridId,
    #[msg("Device is not in the grid.")]
    DeviceNotInGrid,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DeviceInfo {
    pub owner: Pubkey,
    pub is_active: bool,
    pub fallback_devices: Vec<Pubkey>,
    pub total_uptime: u64,
    pub last_ping: i64,
}
