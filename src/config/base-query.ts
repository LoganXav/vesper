import { apiConfig } from "./http";

export interface PostRequestPropsType {
  endpoint: string;
  payload: Record<string, any>;
  config?: any;
}
export interface GetRequestPropsType {
  endpoint: string;
  payload?: Record<string, any>;
  config?: any;
}

export interface PostRequestReturnType<T> {
  data: T;
  message: string;
  status?: string;
  statusCode?: number;
}

export interface GetRequestReturnType<T> {
  data: T;
  message: string;
  status?: string;
  statusCode?: number;
}

export const postRequest = async <T>({
  endpoint,
  payload,
  config = {},
}: PostRequestPropsType): Promise<PostRequestReturnType<T>> => {
  return await apiConfig.post(endpoint, payload, {
    ...config,
    params: config.params,
  });
};

export const getRequest = async <T>({
  endpoint,
  payload,
  config = {},
}: GetRequestPropsType): Promise<GetRequestReturnType<T>> => {
  return await apiConfig.get(endpoint, { params: payload, ...config });
};
