<template>
  <Dialog
    :header="$t('categories.createCategory')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="form">
      <Message v-if="error" severity="error" class="mb-3">
        {{ error }}
      </Message>

      <form @submit.prevent="submitForm">
        <div class="field mb-3">
          <label for="name" class="font-bold block mb-2">
            {{ $t("categories.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('categories.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("categories.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('categories.name_arPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="field mb-3">
          <label for="image" class="font-bold block mb-2">
            {{ $t("categories.categoryImage") }}
          </label>
          <div class="flex flex-column gap-2">
            <div v-if="imagePreview" class="image-preview">
              <img
                :src="imagePreview"
                :alt="formData.name"
                class="preview-image"
              />
              <Button
                icon="pi pi-times"
                class="p-button-text p-button-danger remove-image-btn"
                @click="removeImage"
                v-tooltip="$t('categories.removeImage')"
              />
            </div>

            <FileUpload
              mode="basic"
              :chooseLabel="
                imagePreview
                  ? $t('categories.changeImage')
                  : $t('categories.selectImage')
              "
              accept="image/*"
              :maxFileSize="1000000"
              @select="onImageSelect"
              :class="{ 'p-invalid': errors.file_id }"
              class="w-full"
            />

            <small v-if="errors.file_id" class="p-error">
              {{ errors.file_id }}
            </small>

            <ProgressBar
              v-if="uploading"
              :value="uploadProgress"
              :showValue="false"
            />
            <small v-if="uploading" class="text-color-secondary">
              {{ $t("categories.uploadingImage") }}... {{ uploadProgress }}%
            </small>
          </div>
        </div>

        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="$t('common.cancel')"
            @click="closeModal"
            class="p-button-text"
            :disabled="loading"
          />
          <Button
            type="submit"
            :label="$t('common.create')"
            :loading="loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("common.creating") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), validationRequest],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      deep: true,
      handler(company_id) {
        if (company_id) {
          this.formData.company_id = company_id;
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.CATEGORY.propMainUrl,
      formData: {
        company_id: "",
        file_id: "",
        name: "",
        name_ar: "",
      },
    };
  },
  methods: {
    async submitForm() {
      if (!this.validateCreateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = this.propMainUrl;
      await this.createItem(this.formData, url);

      this.closeModal();
    },

    onImageSelect(event) {
      const file = event.files[0];
      if (file) {
        this.selectedFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);

        // Upload file
       this.formData.file_id = this.uploadFile(file);
      }
    },

    removeImage() {
      this.selectedFile = null;
      this.imagePreview = null;
      this.formData.file_id = "";
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--red-500);
  color: white;
  border: none;
}

:deep(.p-fileupload) {
  width: 100%;
}

:deep(.p-fileupload-choose) {
  width: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
