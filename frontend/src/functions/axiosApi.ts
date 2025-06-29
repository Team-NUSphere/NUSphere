import axios from "axios";
import { backend } from "../constants";
import { auth } from "../firebase";

const axiosApi = axios.create({
  baseURL: backend,
});

axiosApi.interceptors.request.use(
  async (config) => {
    const userToken = await auth.currentUser?.getIdToken();
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosApi;
