<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Upload, message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';

import { uploadBannerApi } from '#/api/core/banner';

const emit = defineEmits<{ success: [] }>();
const uploading = ref(false);
const fileList = ref<any[]>([]);

const [Modal, modalApi] = useVbenModal({
  confirmLoading: uploading,
  destroyOnClose: true,
  onConfirm: handleUpload,
  async onOpenChange(isOpen) {
    if (isOpen) {
      fileList.value = [];
      uploading.value = false;
    }
  },
});

function handleFileChange(info: UploadChangeParam) {
  fileList.value = info.fileList.slice(-1);
}

async function handleUpload() {
  if (fileList.value.length === 0) {
    message.warning('请先选择图片文件');
    modalApi.lock();
    return;
  }
  uploading.value = true;
  try {
    const file = fileList.value[0].originFileObj as File;
    await uploadBannerApi(file);
    message.success('上传成功');
    modalApi.close();
    emit('success');
  } catch {
    // handled by interceptor
  } finally {
    uploading.value = false;
  }
}

defineExpose({
  open() {
    modalApi.open();
  },
});
</script>

<template>
  <Modal :title="'上传轮播图'">
    <Upload
      v-model:file-list="fileList"
      accept="image/*"
      :before-upload="() => false"
      :max-count="1"
      list-type="picture-card"
      @change="handleFileChange"
    >
      <div>
        <span style="font-size: 24px">+</span>
        <div style="margin-top: 8px">选择图片</div>
      </div>
    </Upload>
  </Modal>
</template>
