import type { VxeTableGridColumns } from '#/adapter/vxe-table';

import type { ArticleListVO } from '#/api/core/article';

/**
 * 文章表格列定义
 */
export function useColumns(): VxeTableGridColumns<ArticleListVO> {
  return [
    { type: 'checkbox', width: 50 },
    {
      field: 'articleCover',
      minWidth: 100,
      slots: { default: 'articleCover' },
      title: '封面',
    },
    { field: 'articleTitle', minWidth: 180, title: '标题' },
    { field: 'categoryName', width: 100, title: '分类' },
    {
      field: 'tagsName',
      minWidth: 120,
      slots: { default: 'tagsName' },
      title: '标签',
    },
    { field: 'userName', width: 100, title: '作者' },
    {
      field: 'articleType',
      width: 80,
      slots: { default: 'articleType' },
      title: '类型',
    },
    {
      field: 'isTop',
      width: 80,
      align: 'center',
      slots: { default: 'isTop' },
      title: '置顶',
    },
    {
      field: 'status',
      width: 90,
      align: 'center',
      slots: { default: 'status' },
      title: '状态',
    },
    { field: 'visitCount', width: 90, align: 'center', title: '访问量' },
    {
      field: 'createTime',
      title: '创建时间',
      width: 170,
    },
    {
      field: 'action',
      fixed: 'right',
      headerAlign: 'center',
      title: '操作',
      width: 260,
      slots: { default: 'action' },
    },
  ];
}

/**
 * 搜索表单 schema
 */
export function useGridFormSchema() {
  return [
    {
      component: 'Input',
      field: 'articleTitle',
      formItemProps: { label: '标题' },
      componentProps: { placeholder: '请输入文章标题' },
    },
    {
      component: 'Select',
      field: 'status',
      formItemProps: { label: '状态' },
      componentProps: {
        placeholder: '请选择状态',
        allowClear: true,
        options: [
          { label: '公开', value: 1 },
          { label: '私密', value: 2 },
          { label: '草稿', value: 3 },
        ],
      },
    },
    {
      component: 'Select',
      field: 'isTop',
      formItemProps: { label: '置顶' },
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
    },
  ];
}
