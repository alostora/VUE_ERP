<template>
  <div class="category-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("categories.categoryName") }} *
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
          {{ $t("categories.categoryNameAr") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="formData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
          :placeholder="$t('categories.nameArPlaceholder')"
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
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading || uploading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
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
  name: "CategoryCreateForm",
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
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
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
      formData: {
        name: "",
        name_ar: "",
        file_id: "", // Correct field name for API
      },
      errors: {},
    };
  },
  methods: {
    resetForm() {
      this.formData = {
        name: "",
        name_ar: "",
        file_id: "",
      };
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

    removeImage() {
      this.selectedFile = null;
      this.imagePreview = null;
      this.formData.file_id = "";
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

        // CORRECT: Get file_id from response
        console.log("📁 File upload response:", response.data);

        // Handle different response structures
        if (response.data.data && response.data.data.id) {
          this.formData.file_id = response.data.data.id;
        } else if (response.data.id) {
          this.formData.file_id = response.data.id;
        } else {
          throw new Error("Invalid file upload response format");
        }

        console.log("✅ File ID set to:", this.formData.file_id);

        this.showToast(
          "success",
          "Success",
          this.$t("categories.imageUploaded")
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        this.error = this.$t("categories.imageUploadError");
        this.removeImage();
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("categories.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("categories.nameArRequired");
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
        const url = `${general_request.BASE_URL}/admin/company/category`;

        // CORRECT PAYLOAD STRUCTURE for CREATE:
        const payload = {
          company_id: this.effectiveCompanyId,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          file_id: this.formData.file_id, // Only include if file was uploaded
        };

        console.log("📤 Creating category with payload:", payload);

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Category created successfully:", response.data);

        this.resetForm();
        this.$emit("category-created", response.data.data);

        this.showToast(
          "success",
          this.$t("categories.success"),
          this.$t("categories.categoryCreated")
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
      this.error = responseData.message || this.$t("categories.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("categories.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (
          message.includes("file") ||
          message.includes("image") ||
          message.includes("file_id")
        ) {
          this.errors.file_id = message;
        } else if (message.includes("company")) {
          this.error = message;
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
.category-create-form {
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
</style>
