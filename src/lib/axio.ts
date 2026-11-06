import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 5000,
});

export default AxiosInstance;
