import Request from "../utils/request.util";
import { SERVER_ENDPOINT } from "../constants";
import { FileType } from "../types/asset.type";

export interface IBodyEvaluation {
  dividend_distributor: string;
  evaluation_id: string;
  description: string;
  token_address: string;
  reportFile: any;
}

const CheckpointService = {
  updateCheckpoint: async (body: IBodyEvaluation) => {
    console.log("updateCheckpoint", body);
    try {
      const response = await Request.post(`check-point`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getCheckpointDetail: async (checkpointId: any) => {
    try {
      const response = await Request.get(`check-point/${checkpointId}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getTransactionHistory: async (locker: any) => {
    try {
      const response = await Request.get(`activity-history/${locker}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  sendSerializedTransaction: async (
    evaluation_id: any,
    base64_serialized_tx: any
  ) => {
    try {
      const response = await Request.post(`check-point/get-signature`, {
        evaluation_id,
        base64_serialized_tx,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getLocker: async (locker: string, escrowOwner: string) => {
    try {
      const response = await Request.get(`locker/${locker}/${escrowOwner}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default CheckpointService;
