import { CreateWithdrawalPayload, UpdateWalletAccountPayload, WalletOverview, WithdrawalRequest } from '../types/wallet'
import { httpClient } from './httpClient'

/**
 * Fetch consolidated wallet overview including balance, transactions, and withdrawal records.
 *
 * @param token - Bearer JWT authorization token.
 * @returns Consolidated WalletOverview object.
 */
export async function fetchWalletOverview(token: string): Promise<WalletOverview> {
  return httpClient.request<WalletOverview>({
    path: '/api/wallet',
    token,
  })
}

/**
 * Submit withdrawal application to bank or e-wallet account.
 *
 * @param payload - Target withdrawal specifications.
 * @param token - Bearer JWT authorization token.
 * @returns Created WithdrawalRequest record.
 */
export async function requestWithdrawal(payload: CreateWithdrawalPayload, token: string): Promise<WithdrawalRequest> {
  return httpClient.request<WithdrawalRequest>({
    path: '/api/wallet/withdraw',
    method: 'POST',
    body: payload,
    token,
  })
}

/**
 * Update default disbursement account credentials.
 *
 * @param payload - Preferred account name, number, and bank provider.
 * @param token - Bearer JWT authorization token.
 * @returns Status message confirming account persistence.
 */
export async function updateWalletAccount(payload: UpdateWalletAccountPayload, token: string): Promise<{ message: string }> {
  return httpClient.request<{ message: string }>({
    path: '/api/wallet/account',
    method: 'PUT',
    body: payload,
    token,
  })
}

/**
 * Obtain Midtrans Snap transaction token for an existing order.
 *
 * @param orderCode - Unique order tracking identifier.
 * @param token - Optional Bearer JWT authorization token.
 * @returns Object containing snap_token and redirect_url.
 */
export async function fetchOrderSnapToken(orderCode: string, token?: string): Promise<{ snap_token: string; snap_redirect_url: string }> {
  return httpClient.request<{ snap_token: string; snap_redirect_url: string }>({
    path: `/api/orders/${orderCode}/snap-token`,
    method: 'POST',
    token,
  })
}
