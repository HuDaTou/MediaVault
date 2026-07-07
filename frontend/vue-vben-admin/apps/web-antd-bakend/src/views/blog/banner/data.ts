import type { VxeTableGridColumns } from '#/adapter/vxe-table';
import type { BannerVO } from '#/api/core/banner';

/**
 * 表格列定义
 */
export function useColumns(): VxeTableGridColumns<BannerVO> {
  return [
    { type: 'checkbox', width: 50 },
    {
      field: 'path',
      minWidth: 240,
      slots: { default: 'path' },
      title: '预览图',
    },
    {
      field: 'size',
      minWidth: 100,
      align: 'center',
      slots: { default: 'size' },
      title: '大小(KB)',
    },
    { field: 'type', title: '类型', width: 120 },
    { field: 'sortOrder', title: '排序', width: 70, align: 'center' },
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
      width: 220,
      slots: { default: 'action' },
    },
  ];
}

/**
 * 搜索表单 schema
 */
export function useGridFormSchema() {
  return [];
}
