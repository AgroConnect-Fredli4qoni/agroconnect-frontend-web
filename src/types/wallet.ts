/**
 * FarmerWallet represents the balance and escrow status for a farmer in AgroConnect.
 */
export interface FarmerWallet {
  id: number
  farmer_id: number
  balance: number
  pending_balance: number
  bank_name?: string
  account_number?: string
  account_holder?: string
  created_at: string
  updated_at: string
}

/**
 * WalletTransaction represents an individual credit or debit movement in the ledger.
 */
export interface WalletTransaction {
  id: number
  wallet_id: number
  order_id?: number
  type: 'credit_earning' | 'debit_withdrawal' | 'fee'
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  description: string
  created_at: string
}

/**
 * WithdrawalRequest represents a cash-out application to a bank or e-wallet account.
 */
export interface WithdrawalRequest {
  id: number
  farmer_id: number
  amount: number
  target_type: 'bank' | 'ewallet'
  target_provider: string
  target_account: string
  account_holder: string
  status: 'pending' | 'approved' | 'transferred' | 'rejected'
  created_at: string
}

/**
 * CreateWithdrawalPayload defines input parameters for requesting a wallet withdrawal.
 */
export interface CreateWithdrawalPayload {
  amount: number
  target_type: 'bank' | 'ewallet'
  target_provider: string
  target_account: string
  account_holder: string
}

/**
 * UpdateWalletAccountPayload defines bank account preference updates for farmer payouts.
 */
export interface UpdateWalletAccountPayload {
  bank_name: string
  account_number: string
  account_holder: string
}

/**
 * WalletOverview represents the consolidated wallet dashboard payload.
 */
export interface WalletOverview {
  wallet: FarmerWallet
  transactions: WalletTransaction[]
  withdrawals: WithdrawalRequest[]
}
