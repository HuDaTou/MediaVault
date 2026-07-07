import { requestClient } from '#/api/request';

/** Banner 实体 */
export interface BannerVO {
  id: string;
  path: string;
  size: number;
  type: string;
  userId: string;
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

/**
 * 获取 Banner 列表
 */
export async function getBannerListApi() {
  return requestClient.get<BannerVO[]>('/service-web/banners/back/list');
}

/**
 * 上传 Banner 图片
 */
export async function uploadBannerApi(file: File) {
  const formData = new FormData();
  formData.append('bannerImage', file);
  return requestClient.post<BannerVO>('/service-web/banners/upload/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 删除 Banner
 */
export async function deleteBannerApi(id: string) {
  return requestClient.delete<void>(`/service-web/banners/${id}`);
}

/**
 * 更新 Banner 排序
 */
export async function updateBannerSortApi(banners: BannerVO[]) {
  return requestClient.put<void>('/service-web/banners/update/sort/order', banners);
}
