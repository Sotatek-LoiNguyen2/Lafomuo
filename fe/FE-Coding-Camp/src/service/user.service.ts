import Request from "../utils/request.util";
import Cookies from "js-cookie";
import { SERVER_ENDPOINT } from "../constants";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

interface UpdateWalletAddresProps {
  message: string;
  wallet_address: string;
}

const UserService = {
  login: async (credentials: AuthCredentials) => {
    try {
      const response = await Request.post("auth/login", credentials);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  signUp: async (data: SignUpData) => {
    try {
      const response = await Request.post("auth/register", data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateWalletAddress: async (data: UpdateWalletAddresProps) => {
    try {
      const response = await Request.post("user/update-wallet-address", data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default UserService;
