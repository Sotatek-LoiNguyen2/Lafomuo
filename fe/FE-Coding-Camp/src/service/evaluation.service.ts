import Request from "../utils/request.util";
import { SERVER_ENDPOINT } from "../constants";
import { FileType } from "../types/asset.type";

export interface IBodyEvaluation {
  avatar: FileType;
  address: string;
  description: string;
  certificates: FileType[];
  projectImages: FileType[];
  attributes: any;
}

const EvaluationService = {
  createLand: async (body: IBodyEvaluation) => {
    try {
      const response = await Request.post(`evaluations`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getLand: async (params: any) => {
    try {
      const response = await Request.get(`evaluations/owner`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getAllLand: async (params: any) => {
    try {
      const response = await Request.get(`evaluations`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getDetail: async (id: any) => {
    try {
      const response = await Request.get(`evaluations/${id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  mintNft: async (base64_serialized_tx: any, id: any) => {
    try {
      const response = await Request.post(`mint/${id}`, {
        base64_serialized_tx,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  frac_sign: async (base64_serialized_tx: any, id: any) => {
    try {
      const response = await Request.post(`fractionalize/${id}`, {
        base64_serialized_tx,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  frac: async (id: any, body: any) => {
    try {
      const response = await Request.put(`evaluations/${id}/tokenize`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  updateAssetMetadata: async (id: any, body: any) => {
    try {
      const response = await Request.put(
        `evaluations/${id}/assetMetadata`,
        body
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  deleteAsset: async (id: any) => {
    try {
      const response = await Request.delete(`evaluations/${id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  updateLand: async (body: IBodyEvaluation, id: any) => {
    try {
      const response = await Request.put(`evaluations/${id}`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getAllCheckpoints: async (id: any) => {
    try {
      const response = await Request.get(`check-point`, { evaluation_id: id });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default EvaluationService;
