import axios from "axios";
import { backend } from "../constants";

const axiosApi = axios.create({
  baseURL: backend,
});

axiosApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosApi;
