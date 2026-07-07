<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Image, message, Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteBannerApi,
  getBannerListApi,
  updateBannerSortApi,
  type BannerVO,
} from '#/api/core/banner';
import { useColumns, useGridFormSchema } from './data';
import BannerFormModal from './modules/form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(),
    pagerConfig: { pageSize: 10 },
    proxyConfig: {
      ajax: {
        query: async ({ page }: { page: { currentPage: number; pageSize: number } }) => {
          const res = await getBannerListApi();
          const allItems = (res ?? []) as BannerVO[];
          const start = (page.currentPage - 1) * page.pageSize;
          const items = allItems.slice(start, start + page.pageSize);
          return { items, total: allItems.length };
        },
      },
    },
    toolbarConfig: { refresh: true },
  },
});

const formModalRef = ref<InstanceType<typeof BannerFormModal>>();

async function handleDelete(id: string) {
  try {
    await deleteBannerApi(id);
    message.success('删除成功');
    gridApi.query();
  } catch {
    // handled by interceptor
  }
}

function handleBatchDelete() {
  const records = gridApi?.grid?.getCheckboxRecords() ?? [];
  if (records.length === 0) {
    message.warning('请先选择要删除的轮播图');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${records.length} 张轮播图吗？`,
    onOk: async () => {
      for (const r of records as BannerVO[]) {
        try {
          await deleteBannerApi(r.id);
        } catch {
          // continue
        }
      }
      message.success('批量删除完成');
      gridApi.query();
    },
  });
}

async function handleMoveUp(row: BannerVO) {
  const allItems = gridApi?.grid?.getTableData().fullData as BannerVO[];
  if (!allItems) return;
  const idx = allItems.findIndex((item) => item.id === row.id);
  if (idx <= 0) return;
  [allItems[idx], allItems[idx - 1]] = [allItems[idx - 1], allItems[idx]];
  const updated = allItems.map((item, i) => ({ ...item, sortOrder: i + 1 }));
  try {
    await updateBannerSortApi(updated);
    message.success('排序已更新');
    gridApi.query();
  } catch {
    // handled by interceptor
  }
}

async function handleMoveDown(row: BannerVO) {
  const allItems = gridApi?.grid?.getTableData().fullData as BannerVO[];
  if (!allItems) return;
  const idx = allItems.findIndex((item) => item.id === row.id);
  if (idx < 0 || idx >= allItems.length - 1) return;
  [allItems[idx], allItems[idx + 1]] = [allItems[idx + 1], allItems[idx]];
  const updated = allItems.map((item, i) => ({ ...item, sortOrder: i + 1 }));
  try {
    await updateBannerSortApi(updated);
    message.success('排序已更新');
    gridApi.query();
  } catch {
    // handled by interceptor
  }
}

function formatFileSize(size: number): string {
  if (!size) return '-';
  return (size / 1024).toFixed(1);
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="轮播图管理">
      <template #toolbar-tools>
        <Button type="primary" @click="formModalRef?.open()"> 上传轮播图 </Button>
        <Button danger style="margin-left: 8px" @click="handleBatchDelete()">
          批量删除
        </Button>
      </template>

      <template #path="{ row }">
        <Image
          :src="(row as BannerVO).path"
          :width="120"
          :preview="{ mask: '点击预览' }"
          style="border-radius: 4px"
        />
      </template>

      <template #size="{ row }">
        {{ formatFileSize((row as BannerVO).size) }}
      </template>

      <template #action="{ row }">
        <Space>
          <Button
            size="small"
            :disabled="(row as BannerVO).sortOrder <= 1"
            @click="handleMoveUp(row as BannerVO)"
          >
            上移
          </Button>
          <Button size="small" @click="handleMoveDown(row as BannerVO)">
            下移
          </Button>
          <Popconfirm
            title="确定要删除该轮播图吗？"
            @confirm="handleDelete((row as BannerVO).id)"
          >
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      </template>
    </Grid>
  </Page>
  <BannerFormModal ref="formModalRef" @success="gridApi.query()" />
</template>
