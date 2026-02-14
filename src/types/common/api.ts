export interface IResponse<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}
