<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Form,
  FormItem,
  Input,
  Select,
  Textarea,
  Upload,
  message,
} from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';

import {
  publishArticleApi,
  getArticleEchoApi,
  getCategoryListApi,
  getTagListApi,
  type ArticleDTO,
  type CategoryVO,
  type TagVO,
} from '#/api/core/article';

const emit = defineEmits<{ success: [] }>();
const submitting = ref(false);
const editId = ref<string | null>(null);
const isEdit = ref(false);

// 分类和标签选项
const categories = ref<CategoryVO[]>([]);
const tags = ref<TagVO[]>([]);

// 表单数据
const formData = ref<ArticleDTO>({
  categoryId: 0,
  tagId: [],
  articleCover: '',
  articleTitle: '',
  articleContent: '',
  articleType: 1,
  isTop: 0,
  status: 1,
});

// 封面上传相关
const coverFileList = ref<any[]>([]);

// 文章类型选项
const typeOptions = [
  { label: '原创', value: 1 },
  { label: '转载', value: 2 },
  { label: '翻译', value: 3 },
];

// 状态选项
const statusOptions = [
  { label: '公开', value: 1 },
  { label: '私密', value: 2 },
  { label: '草稿', value: 3 },
];

const [Modal, modalApi] = useVbenModal({
  confirmLoading: submitting,
  destroyOnClose: true,
  onConfirm: handleSubmit,
  async onOpenChange(isOpen) {
    if (isOpen) {
      resetForm();
      await loadCategoryAndTags();
    }
  },
});

function resetForm() {
  formData.value = {
    categoryId: 0,
    tagId: [],
    articleCover: '',
    articleTitle: '',
    articleContent: '',
    articleType: 1,
    isTop: 0,
    status: 1,
  };
  coverFileList.value = [];
  editId.value = null;
  isEdit.value = false;
}

async function loadCategoryAndTags() {
  try {
    const [catRes, tagRes] = await Promise.all([
      getCategoryListApi(),
      getTagListApi(),
    ]);
    categories.value = catRes ?? [];
    tags.value = tagRes ?? [];
  } catch {
    // ignore
  }
}

async function loadArticle(id: string) {
  try {
    const data = await getArticleEchoApi(id);
    if (data) {
      formData.value = {
        id: data.id,
        categoryId: data.categoryId,
        tagId: data.tagId ?? [],
        articleCover: data.articleCover,
        articleTitle: data.articleTitle,
        articleContent: data.articleContent,
        articleType: data.articleType,
        isTop: data.isTop,
        status: data.status,
      };
      if (data.articleCover) {
        coverFileList.value = [
          { uid: '-1', name: '封面', status: 'done', url: data.articleCover },
        ];
      }
    }
  } catch {
    message.error('加载文章数据失败');
  }
}

function handleCoverChange(info: UploadChangeParam) {
  coverFileList.value = info.fileList.slice(-1);
}

async function uploadCover(file: File): Promise<string> {
  const formDataUpload = new FormData();
  formDataUpload.append('articleCover', file);
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const resp = await fetch(`${baseUrl}/service-web/article/upload/articleCover`, {
    method: 'POST',
    body: formDataUpload,
    credentials: 'include',
  });
  const result = await resp.json();
  if (result.code === '200' || result.code === 200) {
    return result.data as string;
  }
  throw new Error(result.msg ?? '上传失败');
}

async function handleSubmit() {
  if (!formData.value.articleTitle.trim()) {
    message.warning('请输入文章标题');
    modalApi.lock();
    return;
  }
  if (!formData.value.categoryId) {
    message.warning('请选择分类');
    modalApi.lock();
    return;
  }
  submitting.value = true;
  try {
    // 先上传封面（如果有新文件）
    if (coverFileList.value.length > 0) {
      const fileItem = coverFileList.value[0];
      if (fileItem.originFileObj) {
        const url = await uploadCover(fileItem.originFileObj);
        formData.value.articleCover = url;
      }
    }

    await publishArticleApi(formData.value);
    message.success(isEdit.value ? '更新成功' : '发布成功');
    modalApi.close();
    emit('success');
  } catch {
    // handled by interceptor
  } finally {
    submitting.value = false;
  }
}

defineExpose({
  open(id?: string) {
    if (id) {
      editId.value = id;
      isEdit.value = true;
    }
    modalApi.open();
    if (id) {
      loadArticle(id);
    }
  },
});
</script>

<template>
  <Modal :title="isEdit ? '编辑文章' : '新增文章'" :width="800">
    <Form :model="formData" layout="vertical">
      <FormItem label="标题" required>
        <Input v-model:value="formData.articleTitle" placeholder="请输入文章标题" />
      </FormItem>

      <FormItem label="分类" required>
        <Select
          v-model:value="formData.categoryId"
          :options="categories.map((c) => ({ label: c.categoryName, value: c.id }))"
          placeholder="请选择分类"
          style="width: 100%"
        />
      </FormItem>

      <FormItem label="标签">
        <Select
          v-model:value="formData.tagId"
          :options="tags.map((t) => ({ label: t.tagName, value: t.id }))"
          mode="multiple"
          placeholder="请选择标签"
          style="width: 100%"
        />
      </FormItem>

      <FormItem label="封面">
        <Upload
          v-model:file-list="coverFileList"
          accept="image/*"
          :before-upload="() => false"
          :max-count="1"
          list-type="picture-card"
          @change="handleCoverChange"
        >
          <div v-if="coverFileList.length === 0">
            <span style="font-size: 24px">+</span>
            <div style="margin-top: 8px">上传封面</div>
          </div>
        </Upload>
      </FormItem>

      <FormItem label="内容">
        <Textarea
          v-model:value="formData.articleContent"
          :rows="8"
          placeholder="请输入文章内容（支持 Markdown）"
        />
      </FormItem>

      <FormItem label="类型" required>
        <Select
          v-model:value="formData.articleType"
          :options="typeOptions"
          style="width: 200px"
        />
      </FormItem>

      <FormItem label="状态" required>
        <Select
          v-model:value="formData.status"
          :options="statusOptions"
          style="width: 200px"
        />
      </FormItem>

      <FormItem label="置顶">
        <Select
          v-model:value="formData.isTop"
          :options="[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]"
          style="width: 200px"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
