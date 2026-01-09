<template>
  <Dialog
    :header="$t('final_product_images.previewImage')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
    @hide="closeModal"
    class="image-preview-modal"
  >
    <div v-if="image" class="preview-content">
      <!-- Main Image -->
      <div class="main-image-container mb-4">
        <img
          :src="image.file.file_path"
          :alt="image.file.original_name"
          class="preview-image"
        />
      </div>

      <!-- Image Info -->
      <div class="image-info-grid">
        <div class="info-item">
          <label class="font-semibold"
            >{{ $t("final_product_images.imageName") }}:</label
          >
          <span>{{ image.file.original_name }}</span>
        </div>

        <div class="info-item">
          <label class="font-semibold"
            >{{ $t("final_product_images.mainImage") }}:</label
          >
          <span>
            <i v-if="image.is_main" class="pi pi-check text-green-500 ml-2"></i>
            <i v-else class="pi pi-times text-color-secondary ml-2"></i>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6">
      <i class="pi pi-image text-4xl text-color-secondary mb-3"></i>
      <p class="text-color-secondary">No image selected</p>
    </div>

    <template #footer>
      <Button
        :label="$t('common.close')"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import { useFileCrud } from "@/utils/useFileCrud";

export default {
  name: "ImagePreviewModal",

  mixins: [useTable(), useCrud(), useFileCrud()],

  components: {
    Dialog,
    Button,
  },
  props: {
    image: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
.preview-content {
  text-align: center;
}

.main-image-container {
  max-height: 60vh;
  overflow: hidden;
  border-radius: 8px;
  background: var(--surface-ground);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.image-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--surface-ground);
  border-radius: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  color: var(--text-color-secondary);
}

:deep(.image-preview-modal .p-dialog-content) {
  padding: 2rem;
}
</style>
