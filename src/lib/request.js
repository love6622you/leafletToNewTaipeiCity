import Axios from "axios";

const api = Axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_API}`,
  timeout: 1000
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else {
      console.error(error);
    }
  }
);

export default api;
