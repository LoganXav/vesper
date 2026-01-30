import axios from "axios";
import { config as AppConfig } from "@/config";

export const apiConfig = axios.create({
  baseURL: AppConfig.baseUrl,
});

apiConfig.interceptors.request.use(async (config) => {
  if (!AppConfig.isProduction) {
    console.groupCollapsed(`@Request`, config.url);
    if (config.params) {
      console.groupCollapsed("Params");
      console.info(config.params);
      console.groupEnd();
    }
    if (config.data) {
      console.groupCollapsed("Data");
      console.info(config.data);
      console.groupEnd();
    }
    console.groupEnd();
  }

  return config;
});

apiConfig.interceptors.response.use(
  (response) => {
    if (!AppConfig.isProduction) {
      console.groupCollapsed(`@Response`, response.config.url, response.status);
      if (response.data) {
        console.groupCollapsed("Data");
        console.info(response.data);
        console.groupEnd();
      }
      if (response.config.params) {
        console.groupCollapsed("Params");
        console.info(response.config.params);
        console.groupEnd();
      }
      if (response.headers) {
        console.groupCollapsed("Headers");
        console.info(response.headers);
        console.groupEnd();
      }
      console.groupEnd();
    }

    return response.data.result;
  },
  async (error) => {
    if (error?.response) {
      if (!AppConfig.isProduction) {
        console.groupCollapsed(
          `@Response`,
          error.response.config.url,
          error.response.status,
        );
        if (error.response.data) {
          console.groupCollapsed("Data");
          console.info(error.response.data);
          console.groupEnd();
        }
        if (error.response.config.params) {
          console.groupCollapsed("Params");
          console.info(error.response.config.params);
          console.groupEnd();
        }
        if (error.response.headers) {
          console.groupCollapsed("Headers");
          console.info(error.response.headers);
          console.groupEnd();
        }
        console.groupEnd();
      }
    }

    return Promise.reject(
      error.response
        ? {
            message:
              error.response.data?.errors?.[0]?.message ||
              error?.response?.data?.data?.message ||
              error?.response?.data?.message ||
              error?.response?.data?.details?.[0]?.message ||
              error?.response?.data?.result?.message?.name ||
              error?.response?.data?.result?.message ||
              "Something went wrong. Please contact admin.",

            status: error.response.status,
          }
        : {
            message: "Something went wrong. Please contact admin.",
            status: 500,
          },
    );
  },
);
