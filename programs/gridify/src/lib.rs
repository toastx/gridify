use anchor_lang::prelude::*;

declare_id!("3ZeNA6X2Nf14Yx2AGq9WHU9fYqjVnoMrruxmBE9ZnXka");

#[program]
pub mod gridify {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
