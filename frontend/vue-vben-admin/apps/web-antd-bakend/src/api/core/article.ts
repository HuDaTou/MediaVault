import { requestClient } from '#/api/request';

/** 文章列表项 */
export interface ArticleListVO {
  id: string;
  categoryId: string;
  userId: string;
  userName: string;
  articleType: number;
  categoryName: string;
  tagsName: string[];
  articleCover: string;
  articleTitle: string;
  isTop: number;
  status: number;
  visitCount: number;
  createTime: string;
}

/** 文章编辑/发布 DTO */
export interface ArticleDTO {
  id?: string;
  categoryId: number;
  tagId: number[];
  articleCover: string;
  articleTitle: string;
  articleContent: string;
  articleType: number;
  isTop: number;
  status: number;
}

/** 搜索文章参数 */
export interface SearchArticleDTO {
  categoryId?: number;
  articleTitle?: string;
  status?: number;
  isTop?: number;
}

/** 分类 */
export interface CategoryVO {
  id: number;
  categoryName: string;
  articleCount: number;
}

/** 标签 */
export interface TagVO {
  id: number;
  tagName: string;
  articleCount: number;
}

/**
 * 获取文章列表（后台）
 */
export async function getArticleListApi() {
  return requestClient.get<ArticleListVO[]>('/service-web/article/back/list');
}

/**
 * 搜索文章
 */
export async function searchArticleApi(data: SearchArticleDTO) {
  return requestClient.post<ArticleListVO[]>('/service-web/article/back/search', data);
}

/**
 * 回显文章数据（编辑用）
 */
export async function getArticleEchoApi(id: string) {
  return requestClient.get<ArticleDTO>(`/service-web/article/back/echo/${id}`);
}

/**
 * 发布/更新文章
 */
export async function publishArticleApi(data: ArticleDTO) {
  return requestClient.post<void>('/service-web/article/publish', data);
}

/**
 * 修改文章状态
 */
export async function updateArticleStatusApi(id: string, status: number) {
  return requestClient.post<void>(
    `/service-web/article/back/update/status?id=${id}&status=${status}`,
  );
}

/**
 * 修改文章是否置顶
 */
export async function updateArticleIsTopApi(id: string, isTop: number) {
  return requestClient.post<void>(
    `/service-web/article/back/update/isTop?id=${id}&isTop=${isTop}`,
  );
}

/**
 * 删除文章
 */
export async function deleteArticleApi(ids: string[]) {
  return requestClient.delete<void>('/service-web/article/back/delete', { data: ids });
}

/**
 * 获取分类列表
 */
export async function getCategoryListApi() {
  return requestClient.get<CategoryVO[]>('/service-web/category/back/list');
}

/**
 * 获取标签列表
 */
export async function getTagListApi() {
  return requestClient.get<TagVO[]>('/service-web/tag/back/list');
}
