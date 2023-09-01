// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function checkConfirm(
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse>('/api/token/checkConfirm', {
    method: 'GET',
    ...(options || {}),
  });
}
