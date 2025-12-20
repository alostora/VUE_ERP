<template>
  <Dialog
    :header="this.$t('categories.editCategory')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
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
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label for="file" class="font-bold block mb-2">
              {{ $t("categories.categoryImage") }}
            </label>

            <div v-if="this.filePath" class="current-file-preview mb-3">
              <label class="p-text-secondary text-sm block mb-2"
                >Current File:</label
              >
              <img
                :src="this.filePath"
                :alt="formData.name"
                class="file-preview-image"
              />
            </div>

            <FileUpload
              mode="basic"
              :chooseLabel="$t('categories.chooseFile')"
              class="w-full"
              :maxFileSize="1000000"
              accept="image/*"
              @select="(event) => onFileSelect(event, 'generalFile', 'file_id')"
            />

            <div v-if="generalFile" class="new-file-preview mt-2">
              <label class="p-text-secondary text-sm block mb-2"
                >New File Preview:</label
              >

              <Button
                icon="pi pi-times"
                class="p-button-text p-button-danger remove-image-btn"
                @click="removeImage"
                v-tooltip="$t('categories.removeImage')"
              />

              <img
                :src="getFilePreview(generalFile)"
                alt="New File Preview"
                class="file-preview-image"
              />
            </div>

            <small v-else class="p-text-secondary">
              {{ $t("categories.noFileChosen") }}
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
            :label="$t('common.update')"
            :loading="loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
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
import { useFileCrud } from "@/utils/useFileCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";

export default {
  name: "UpdateForm",

  mixins: [useTable(), useCrud(), useFileCrud(), validationRequest],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
  },

  props: {
    selected_item: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    selected_item: {
      immediate: true,
      deep: true,
      handler(selectedItem) {
        if (selectedItem && selectedItem.id) {
          this.populateForm(selectedItem);
        } else {
          this.resetForm();
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.CATEGORY.propMainUrl,
      accountTypes: [],
      selectedAccountType: null,
      generalFile: null,
      filePath: null,
      formData: {
        id: "",
        name: "",
        name_ar: "",
        file_id: "",
      },
    };
  },

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        name_ar: selectedItem.name_ar || "",
        file_id: selectedItem.file_id || "",
      };

      this.filePath = selectedItem.file ? selectedItem.file.file_path : null;

      console.log("Populated formData:", selectedItem);
    },

    async submitForm() {
      if (!this.validateUpdateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = this.propMainUrl;
      await this.updateItem(this.formData.id, this.formData, url);

      this.closeModal();
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
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
.file-preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
