export type WalletInterface = {
  isConnected: boolean;
  connectorName: string | null | undefined;
  walletAddress: string | null | undefined;
};
