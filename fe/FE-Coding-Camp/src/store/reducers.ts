import { combineReducers } from "@reduxjs/toolkit";
import walletReducer from "./wallet/wallet.slice";

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
