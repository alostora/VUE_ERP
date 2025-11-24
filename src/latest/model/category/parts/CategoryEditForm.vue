<template>
  <div class="category-edit-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("categories.categoryName") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Image Upload Field -->
      <div class="field mb-3">
        <label for="image" class="font-bold block mb-2">
          {{ $t("categories.categoryImage") }}
        </label>
        <div class="flex flex-column gap-2">
          <!-- Current Image -->
          <div v-if="formData.file?.file_path" class="current-image">
            <p class="text-sm text-color-secondary mb-2">
              {{ $t("categories.currentImage") }}:
            </p>
            <img
              :src="formData.file.file_path"
              :alt="formData.name"
              class="current-image-preview"
            />
          </div>

          <!-- Image Preview for New Upload -->
          <div v-if="imagePreview" class="image-preview">
            <p class="text-sm text-color-secondary mb-2">
              {{ $t("categories.newImage") }}:
            </p>
            <img
              :src="imagePreview"
              :alt="formData.name"
              class="preview-image"
            />
            <Button
              icon="pi pi-times"
              class="p-button-text p-button-danger remove-image-btn"
              @click="removeNewImage"
              v-tooltip="$t('categories.removeImage')"
            />
          </div>

          <!-- File Upload -->
          <FileUpload
            mode="basic"
            :chooseLabel="
              imagePreview
                ? $t('categories.changeImage')
                : $t('categories.selectNewImage')
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

          <!-- Upload Progress -->
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

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading || uploading"
        />
        <Button
          type="submit"
          :label="submitButtonText"
          :loading="loading"
          :disabled="uploading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressBar from "primevue/progressbar";
import Tooltip from "primevue/tooltip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CategoryEditForm",
  components: {
    InputText,
    FileUpload,
    Button,
    Message,
    ProgressBar,
  },
  directives: {
    tooltip: Tooltip,
  },
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      uploading: false,
      uploadProgress: 0,
      error: "",
      imagePreview: null,
      selectedFile: null,
      newFileId: null,
      formData: {
        id: "",
        name: "",
        file: null,
      },
      errors: {},
    };
  },
  computed: {
    submitButtonText() {
      return this.formData.id
        ? this.$t("common.update")
        : this.$t("common.create");
    },
    isEditMode() {
      return !!this.formData.id;
    },
  },
  watch: {
    category: {
      immediate: true,
      deep: true,
      handler(newCategory) {
        if (newCategory && newCategory.id) {
          this.populateForm(newCategory);
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    populateForm(category) {
      this.formData = {
        id: category.id || "",
        name: category.name || "",
        file: category.file || null,
      };
      this.newFileId = null;
      this.imagePreview = null;
      this.selectedFile = null;
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        file: null,
      };
      this.newFileId = null;
      this.imagePreview = null;
      this.selectedFile = null;
      this.errors = {};
      this.error = "";
      this.uploadProgress = 0;
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
        this.uploadFile(file);
      }
    },

    removeNewImage() {
      this.selectedFile = null;
      this.imagePreview = null;
      this.newFileId = null;
    },

    async uploadFile(file) {
      this.uploading = true;
      this.uploadProgress = 0;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$http.post(
          `${general_request.BASE_URL}/storage/file`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: general_request.headers.Authorization,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.uploadProgress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              }
            },
          }
        );

        this.newFileId = response.data.id;
        this.showToast(
          "success",
          "Success",
          this.$t("categories.imageUploaded")
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        this.error = this.$t("categories.imageUploadError");
        this.removeNewImage();
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/category/${this.formData.id}`;

        // Prepare payload - only include file_id if a new image was uploaded
        const payload = {
          name: this.formData.name,
          ...(this.newFileId && { file_id: this.newFileId }),
        };

        console.log("Updating category with payload:", payload);

        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        console.log("Category updated successfully:", response.data);
        this.$emit("category-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("categories.success"),
          this.$t("categories.categoryUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("categories.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("categories.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("file") || message.includes("image")) {
          this.errors.file_id = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
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
.category-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.current-image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
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
  border: 2px solid var(--primary-color);
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
</style>
