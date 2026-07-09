<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Image, message, Modal, Popconfirm, Select, Space, Switch, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getArticleListApi,
  searchArticleApi,
  deleteArticleApi,
  updateArticleStatusApi,
  updateArticleIsTopApi,
  type ArticleListVO,
} from '#/api/core/article';
import { useColumns, useGridFormSchema } from './data';
import ArticleFormModal from './modules/form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(),
    pagerConfig: { pageSize: 10 },
    proxyConfig: {
      ajax: {
        query: async (
          { page, formValues }: { page: { currentPage: number; pageSize: number }; formValues?: Record<string, any> },
        ) => {
          let res: ArticleListVO[] = [];
          // 有搜索条件用 search API，否则用 list API
          const hasFilter = formValues && Object.values(formValues).some((v) => v !== undefined && v !== null && v !== '');
          if (!hasFilter) {
            res = (await getArticleListApi()) ?? [];
          } else {
            res = (await searchArticleApi({
              articleTitle: formValues?.articleTitle as string | undefined,
              status: formValues?.status as number | undefined,
              isTop: formValues?.isTop as number | undefined,
            })) ?? [];
          }
          const start = (page.currentPage - 1) * page.pageSize;
          const items = res.slice(start, start + page.pageSize);
          return { items, total: res.length };
        },
      },
    },
    toolbarConfig: { refresh: true },
  },
});

const formModalRef = ref<InstanceType<typeof ArticleFormModal>>();

async function handleDelete(ids: string[]) {
  try {
    await deleteArticleApi(ids);
    message.success('删除成功');
  } catch {
    // handled by interceptor
  }
  gridApi.query();
}

function handleBatchDelete() {
  const records = gridApi?.grid?.getCheckboxRecords() ?? [];
  if (records.length === 0) {
    message.warning('请先选择要删除的文章');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${records.length} 篇文章吗？`,
    onOk: async () => {
      const ids = (records as ArticleListVO[]).map((r) => r.id);
      try {
        await deleteArticleApi(ids);
        message.success('批量删除完成');
      } catch {
        // handled by interceptor
      }
      gridApi.query();
    },
  });
}

async function handleToggleStatus(row: ArticleListVO, newStatus: number) {
  try {
    await updateArticleStatusApi(row.id, newStatus);
    message.success('状态已更新');
  } catch {
    // handled by interceptor
  }
  gridApi.query();
}

async function handleToggleIsTop(row: ArticleListVO, checked: boolean) {
  try {
    await updateArticleIsTopApi(row.id, checked ? 1 : 0);
    message.success('已更新');
  } catch {
    // handled by interceptor
  }
  gridApi.query();
}

const statusOptions = [
  { label: '公开', value: 1 },
  { label: '私密', value: 2 },
  { label: '草稿', value: 3 },
];

function getStatusColor(status: number) {
  const map: Record<number, string> = { 1: 'green', 2: 'orange', 3: 'default' };
  return map[status] ?? 'default';
}

function getStatusLabel(status: number) {
  return statusOptions.find((s) => s.value === status)?.label ?? '未知';
}

const articleTypeLabels: Record<number, string> = { 1: '原创', 2: '转载', 3: '翻译' };
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="文章管理">
      <template #toolbar-tools>
        <Button type="primary" @click="formModalRef?.open()"> 新增文章 </Button>
        <Button danger style="margin-left: 8px" @click="handleBatchDelete"> 批量删除 </Button>
      </template>

      <!-- 封面 -->
      <template #articleCover="{ row }">
        <Image
          v-if="(row as ArticleListVO).articleCover"
          :src="(row as ArticleListVO).articleCover"
          :width="60"
          style="border-radius: 4px"
        />
        <span v-else style="color: #ccc">无</span>
      </template>

      <!-- 标签 -->
      <template #tagsName="{ row }">
        <Space wrap :size="[0, 4]">
          <Tag v-for="tag in (row as ArticleListVO).tagsName" :key="tag" color="blue">
            {{ tag }}
          </Tag>
        </Space>
      </template>

      <!-- 文章类型 -->
      <template #articleType="{ row }">
        {{ articleTypeLabels[(row as ArticleListVO).articleType] ?? '-' }}
      </template>

      <!-- 是否置顶 -->
      <template #isTop="{ row }">
        <Switch
          size="small"
          :checked="(row as ArticleListVO).isTop === 1"
          @change="(checked: boolean) => handleToggleIsTop(row as ArticleListVO, checked)"
        />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <Select
          size="small"
          :value="(row as ArticleListVO).status"
          :options="statusOptions"
          style="width: 80px"
          @change="(val: number) => handleToggleStatus(row as ArticleListVO, val)"
        />
      </template>

      <!-- 操作 -->
      <template #action="{ row }">
        <Space>
          <Button size="small" type="link" @click="formModalRef?.open((row as ArticleListVO).id)">
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该文章吗？"
            @confirm="handleDelete([(row as ArticleListVO).id])"
          >
            <Button size="small" type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      </template>
    </Grid>
  </Page>
  <ArticleFormModal ref="formModalRef" @success="gridApi.query()" />
</template>
