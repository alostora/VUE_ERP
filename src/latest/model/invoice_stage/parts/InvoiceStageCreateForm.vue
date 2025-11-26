<template>
  <div class="invoice-stage-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("invoice_stages.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('invoice_stage.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("invoice_stages.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('invoice_stage.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("invoice_stages.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('invoice_stage.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("invoice_stages.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('invoice_stage.detailsArPlaceholder')"
          />
        </div>
      </div>

      <!-- Is Default -->
      <div class="field mb-4">
        <div class="flex align-items-center">
          <Checkbox
            id="is_default"
            v-model="formData.is_default"
            :binary="true"
            class="mr-2"
          />
          <label for="is_default" class="font-medium">
            {{ $t("invoice_stages.isDefaultLabel") }}
          </label>
        </div>
        <small class="p-text-secondary">
          This stage will be set as the default for new invoices
        </small>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
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
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "InvoiceStageCreateForm",
  components: {
    InputText,
    Textarea,
    Checkbox,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      formData: {
        company_id: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
        is_default: false,
      },
      errors: {},
    };
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        company_id: this.effectiveCompanyId,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
        is_default: false,
      };
      this.errors = {};
      this.error = "";
    },
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("invoice_stages.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("invoice_stages.nameArRequired");
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
        const payload = {
          company_id: this.effectiveCompanyId,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
          is_default: this.formData.is_default,
        };

        const url = `${general_request.BASE_URL}/admin/company/invoice-stage`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("invoice-stage-created", response.data.data);

        this.showToast(
          "success",
          this.$t("invoice_stages.success"),
          this.$t("invoice_stages.invoiceStageCreated")
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
      this.error = responseData.message || this.$t("invoice_stages.createError");
    },
    handleNetworkError(error) {
      this.error = error.message || this.$t("invoice_stages.networkError");
    },
    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
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
.invoice-stage-create-form {
  max-width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
