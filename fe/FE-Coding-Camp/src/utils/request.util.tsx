import axios from "axios";
import Cookies from "js-cookie";
import handleErrorUtil from "./handle-error.util";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
class Request {
  instance;
  constructor() {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    instance.interceptors.request.use(
      async (config: any) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      function (response) {
        return handleErrorUtil(response);
      },
      function (error) {
        if (error.response) {
          return handleErrorUtil(error.response);
        }
        if (error.toString() === "Error: Network Error") {
          return {
            data: {
              message: null,
            },
          };
        }
        return Promise.reject(error);
      }
    );

    this.instance = instance;
  }

  get = (url: string, params?: object) => {
    return this.instance.get(url, { params });
  };

  post = (url: string, data?: object, headers?: any) => {
    return this.instance.post(url, data);
  };

  put = (url: string, data?: object) => {
    return this.instance.put(url, data);
  };

  patch = (url: string, data: object) => {
    return this.instance.patch(url, data);
  };

  delete = (url: string, data?: object) => {
    return this.instance.delete(url, { data });
  };

  postFormData = (url: string, data: { [key: string]: any }) => {
    const formData = new FormData();

    function appendFormData(nameInput: string, array: Array<any>): void {
      for (let i = 0; i < array.length; i += 1) {
        formData.append(nameInput, array[i]);
      }
    }

    const keysData = Object.keys(data);

    if (keysData.length > 0) {
      for (let i = 0; i < keysData.length; i += 1) {
        const keyItem = keysData[i];
        if (Array.isArray(data[keyItem])) {
          appendFormData(keyItem, data[keyItem]);
        } else {
          formData.append(keyItem, data[keyItem]);
        }
      }
    }

    return this.instance.post(url, formData);
  };
}

export default new Request();
