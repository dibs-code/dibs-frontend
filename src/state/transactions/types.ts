export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL,
  REGISTER,
  REWARD,
  CLAIM_ALL,
}

export interface BaseTransactionInfo {
  type: TransactionType;
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL;
  tokenAddress: string;
  tokenSymbol?: string;
  spender: string;
}

export interface RegisterTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.REGISTER;
  name: string;
}

export interface RewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.REWARD;
  parentName: string;
}

export interface ClaimAllTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.CLAIM_ALL;
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | RegisterTransactionInfo
  | RewardTransactionInfo
  | ClaimAllTransactionInfo;

export interface TransactionDetails {
  hash: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
  info: TransactionInfo;
}
