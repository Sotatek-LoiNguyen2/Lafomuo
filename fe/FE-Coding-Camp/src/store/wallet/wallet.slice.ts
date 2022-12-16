import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { WalletInterface } from "./wallet.interface";

const initialState: WalletInterface = {
  isConnected: false,
  connectorName: null,
  walletAddress: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateConnectedState(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    updateWalletAddress(state, action: PayloadAction<string>) {
      state.walletAddress = action.payload;
    },
  },
});
export const selectWallet = (state: RootState) => state.wallet;
export const { updateConnectedState, updateWalletAddress } =
  walletSlice.actions;

export default walletSlice.reducer;
