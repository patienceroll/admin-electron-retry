type FetchInit = Omit<RequestInit, "method"> & {
  method?: Method;
  paramsSerializer?: (params: Record<string | number, unknown>) => string;
};
type FetchParams = Record<string | number, unknown> | BodyInit;
interface BaseResponse<T = null> {
  status: string | number;
  data: T;
  message: string;
}