// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { TableListItem,ConfigItem } from './typings';

export async function getPage(
  params: {
    // query
    /** 当前的页码 */
    pageNum?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse>('/api/daysMatter/getPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getLunarDate(
  params: {
    date?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse>('/api/daysMatter/getLunarDate', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


/** 保存 */
export async function save(body: TableListItem, options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/daysMatter/save', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

/** 删除 */
export async function remove(ids:number[],options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/daysMatter/delete', {
    method: 'GET',
    params:{
      ids:ids
    },
    ...(options || {}),
  });
}

/** 保存客户端配置 */
export async function saveConfig(body: ConfigItem, options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/daysMatter/saveConfig', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

/** 获取客户端配置 */
export async function getConfig(
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse>('/api/daysMatter/getConfig', {
    method: 'GET',
    ...(options || {}),
  });
}