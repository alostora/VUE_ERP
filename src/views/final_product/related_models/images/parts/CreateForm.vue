<template>
  <Dialog
    :header="$t('final_product_images.uploadImages')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- File Upload Section -->
    <div class="upload-section mb-4">
      <FileUpload
        name="files[]"
        :url="uploadUrl"
        @upload="onUpload"
        :multiple="true"
        accept="image/*"
        :maxFileSize="2000000"
        :auto="false"
        :chooseLabel="$t('final_product_images.selectFiles')"
        :uploadLabel="$t('common.upload')"
        :cancelLabel="$t('common.cancel')"
        :customUpload="true"
        @select="onFileSelect"
        :disabled="uploading"
      >
        <template #empty>
          <div class="upload-placeholder">
            <i
              class="pi pi-cloud-upload text-4xl text-color-secondary mb-3"
            ></i>
            <p class="font-semibold mb-2">
              {{ $t("final_product_images.dragAndDrop") }}
            </p>
            <p class="text-color-secondary text-sm">
              {{ $t("final_product_images.supportedFormats") }}<br />
              {{ $t("final_product_images.maxFileSize") }}
            </p>
          </div>
        </template>
      </FileUpload>
    </div>

    <!-- Selected Files List -->
    <div v-if="selectedFiles.length > 0" class="selected-files-section mb-4">
      <h4 class="mb-3">
        {{ $t("final_product_images.filesSelected") }} ({{
          selectedFiles.length
        }})
      </h4>

      <div class="selected-files-list">
        <div
          v-for="(file, index) in selectedFiles"
          :key="file.id"
          class="file-item p-3 border-round border surface-border mb-2"
        >
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center gap-3">
              <img
                v-if="file.objectUrl"
                :src="file.objectUrl"
                :alt="file.name"
                class="file-preview"
              />
              <i v-else class="pi pi-image text-2xl text-color-secondary"></i>

              <div>
                <div class="font-medium">{{ file.name }}</div>
                <div class="text-color-secondary text-sm">
                  {{ formatFileSize(file.size) }}
                </div>
              </div>
            </div>

            <div class="flex align-items-center gap-2">
              <!-- Set as Main Checkbox - ALWAYS VISIBLE -->
              <div class="main-checkbox mr-3">
                <Checkbox
                  v-model="file.isMain"
                  :binary="true"
                  @change="onMainImageChange(index)"
                  :disabled="uploading"
                />
                <label class="ml-2 text-sm">
                  {{ $t("final_product_images.setAsMain") }}
                </label>
              </div>

              <!-- Progress Bar -->
              <ProgressBar
                v-if="file.progress > 0 && file.progress < 100"
                :value="file.progress"
                class="w-10rem"
                :showValue="false"
              />

              <!-- Status Icons -->
              <i
                v-if="file.progress === 100"
                class="pi pi-check text-green-500"
              ></i>
              <i v-else-if="file.error" class="pi pi-times text-red-500"></i>

              <Button
                icon="pi pi-times"
                class="p-button-text p-button-danger p-button-sm"
                @click="removeFile(index)"
                :disabled="uploading"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Image Warning -->
      <Message v-if="hasMultipleMainImages" severity="warn" class="mt-3">
        {{ $t("final_product_images.mainImageWarning") }}
      </Message>

      <!-- Single Image Info -->
      <Message v-if="selectedFiles.length === 1" severity="info" class="mt-3">
        {{ $t("final_product_images.singleImageInfo") }}
      </Message>
    </div>

    <!-- Total Progress -->
    <div v-if="uploading" class="total-progress mb-4">
      <div class="flex justify-content-between align-items-center mb-2">
        <span class="font-medium">{{
          $t("final_product_images.totalProgress")
        }}</span>
        <span>{{ totalProgress }}%</span>
      </div>
      <ProgressBar :value="totalProgress" />
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button
        :label="$t('common.cancel')"
        @click="closeModal"
        class="p-button-text"
        :disabled="uploading"
      />
      <Button
        :label="uploadButtonLabel"
        @click="startUpload"
        class="p-button-primary"
        :loading="uploading"
        :disabled="
          selectedFiles.length === 0 || uploading || hasMultipleMainImages
        "
      />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import Checkbox from "primevue/checkbox";
import Message from "primevue/message";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import { useFileCrud } from "@/utils/useFileCrud";
import general_request from "@/utils/general_request";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), useFileCrud()],

  components: {
    Dialog,
    FileUpload,
    Button,
    ProgressBar,
    Checkbox,
    Message,
  },
  props: {
    final_product_id: {
      type: String,
      required: true,
    },
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      uploading: false,
      selectedFiles: [],
      uploadUrl: `${general_request.BASE_URL}/storage/file`,
      fileCounter: 0, // عداد للمفاتيح الفريدة
    };
  },
  computed: {
    uploadButtonLabel() {
      if (this.uploading) {
        return this.$t("final_product_images.uploading");
      }
      return this.$t("final_product_images.uploadImages");
    },
    totalProgress() {
      if (this.selectedFiles.length === 0) return 0;
      const total = this.selectedFiles.reduce(
        (sum, file) => sum + (file.progress || 0),
        0,
      );
      return Math.round(total / this.selectedFiles.length);
    },
    hasMultipleMainImages() {
      const mainImagesCount = this.selectedFiles.filter(
        (file) => file.isMain,
      ).length;
      return mainImagesCount > 1;
    },
    mainImageCount() {
      return this.selectedFiles.filter((file) => file.isMain).length;
    },
  },
  methods: {
    openModal() {
      this.visible = true;
      this.selectedFiles = [];
      this.uploading = false;
      this.fileCounter = 0;
    },

    closeModal() {
      this.visible = false;
      // تنظيف الـ object URLs
      this.selectedFiles.forEach((file) => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
      this.selectedFiles = [];
      this.uploading = false;
    },

    onFileSelect(event) {
      // أخذ الملفات المختارة فقط بدون تكرار
      const newFiles = Array.from(event.files).map((file) => {
        this.fileCounter++;
        return {
          id: `file-${this.fileCounter}-${Date.now()}`, // مفتاح فريد
          file: file,
          name: file.name,
          size: file.size,
          progress: 0,
          error: false,
          isMain: false, // المستخدم يقرر
          objectUrl: URL.createObjectURL(file),
        };
      });

      // منع التكرار بناءً على اسم الملف والحجم
      const existingFileNames = this.selectedFiles.map(
        (f) => `${f.name}-${f.size}`,
      );
      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !existingFileNames.includes(`${newFile.name}-${newFile.size}`),
      );

      if (uniqueNewFiles.length > 0) {
        this.selectedFiles = [...this.selectedFiles, ...uniqueNewFiles];
        console.log("✅ Added files:", uniqueNewFiles.length);
      }

      // إعادة تعيين عنصر الرفع
      event.options.clear();
    },

    onMainImageChange(changedIndex) {
      // إذا تم تعيين ملف كرئيسي، إلغاء تعيين الباقي
      if (this.selectedFiles[changedIndex].isMain) {
        this.selectedFiles.forEach((file, index) => {
          if (index !== changedIndex) {
            file.isMain = false;
          }
        });
      }
      this.$forceUpdate();
    },

    removeFile(index) {
      const removedFile = this.selectedFiles[index];

      // تنظيف الـ object URL
      if (removedFile.objectUrl) {
        URL.revokeObjectURL(removedFile.objectUrl);
      }

      this.selectedFiles.splice(index, 1);
      console.log("🗑️ Removed file, remaining:", this.selectedFiles.length);
    },

    async startUpload() {
      if (this.selectedFiles.length === 0 || this.hasMultipleMainImages) return;

      this.uploading = true;
      const uploadedFileIds = [];

      try {
        console.log("📤 Starting upload process...");

        // الخطوة 1: رفع جميع الملفات إلى التخزين والحصول على معرفات الملفات
        for (let i = 0; i < this.selectedFiles.length; i++) {
          const fileItem = this.selectedFiles[i];

          try {
            // تحديث التقدم لرفع الملف
            fileItem.progress = 10;
            this.$forceUpdate();

            console.log(`📁 Uploading file: ${fileItem.name}`);

            // رفع الملف إلى التخزين
            const fileId = await this.uploadFileToStorage(fileItem);
            fileItem.progress = 50;

            console.log(`✅ File uploaded successfully, ID: ${fileId}`);
            uploadedFileIds.push({
              file_id: fileId,
              is_main: fileItem.isMain,
            });

            fileItem.progress = 100;
          } catch (error) {
            fileItem.error = true;
            fileItem.progress = 0;
            throw error; // إيقاف العملية إذا فشل أي ملف
          }
        }

        // الخطوة 2: إنشاء سجلات صور المنتج النهائي بجميع الملفات
        console.log("🔄 Creating final product image records...");
        const finalProductImages =
          await this.createFinalProductImages(uploadedFileIds);

        console.log("✅ All images created successfully:", finalProductImages);

        this.$emit("images-uploaded", finalProductImages);
        this.showToast(
          "success",
          this.$t("common.success"),
          this.$t("final_product_images.uploadSuccess"),
        );
        this.closeModal();
      } catch (error) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product_images.uploadError"),
        );
      } finally {
        this.uploading = false;
      }
    },

    async uploadFileToStorage(fileItem) {
      const formData = new FormData();
      formData.append("file", fileItem.file);

      const response = await this.$http.post(this.uploadUrl, formData, {
        headers: {
          ...general_request.headers,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 45) / progressEvent.total,
          );
          fileItem.progress = 10 + progress; // 10-55% لرفع الملف
          this.$forceUpdate();
        },
      });

      return response.data.data.id;
    },

    async createFinalProductImages(uploadedFiles) {
      const payload = {
        final_product_id: this.final_product_id,
        files: uploadedFiles,
      };

      console.log(
        "📦 Sending payload to create final product images:",
        payload,
      );

      const response = await this.$http.post(
        `${general_request.BASE_URL}/admin/company/product/final-product-image`,
        payload,
        {
          headers: general_request.headers,
        },
      );

      console.log("✅ Final product images created:", response.data.data);
      return response.data.data; // إرجاع جميع الصور المنشأة
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.upload-placeholder {
  text-align: center;
  padding: 2rem;
  border: 2px dashed var(--surface-border);
  border-radius: 8px;
  background: var(--surface-ground);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.file-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--surface-border);
}

.selected-files-list {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  transition: all 0.3s ease;
}

.file-item:hover {
  background: var(--surface-hover);
}

.main-checkbox {
  display: flex;
  align-items: center;
}

.main-checkbox label {
  cursor: pointer;
  user-select: none;
}

:deep(.p-fileupload .p-button) {
  width: 100%;
}

:deep(.p-fileupload-content) {
  border: none;
  padding: 0;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

:deep(.p-fileupload-choose) {
  width: 100%;
}
</style>
