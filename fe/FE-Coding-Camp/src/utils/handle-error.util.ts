import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const handleErrorUtil = (response: AxiosResponse<any>) => {
  const { status, data } = response;
  switch (status) {
    case 401:
      if (data.error.message !== "Unauthorized") {
        Cookies.remove("accessToken");
        window.location.reload();
      }
      return {
        ...response,
        data: {
          ...response.data,
          message: null,
        },
      };
    default:
      return response;
  }

  return response;
};

export default handleErrorUtil;
