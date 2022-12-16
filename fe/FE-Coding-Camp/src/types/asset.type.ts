export type FileType = {
  name: string;
  data: any;
};
export interface AssetType {
  _id: string;
  avatar: any;
  name: string;
  totalSupply: number;
  tokenPrice: number;
  status?: string;
  action?: string;
  detail: string;
  rewardDate?: string;
}

export enum STATUS {
  PENDING = "PENDING",
  PASSED = "PASSED",
  REJECTED = "REJECTED",
  MISSING_INFORMATION = "MISSING_INFORMATION",
  MINTED = "MINTED",
  TOKENIZED = "TOKENIZED",
  LISTED = "LISTED",
}
