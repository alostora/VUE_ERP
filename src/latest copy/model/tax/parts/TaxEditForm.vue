<template>
  <div class="tax-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("taxes.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('taxes.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("taxes.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('taxes.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>
      </div>

      <!-- Value -->
      <div class="field mb-3">
        <label for="value" class="font-bold block mb-2">
          {{ $t("taxes.value") }} *
        </label>
        <InputNumber
          id="value"
          v-model="formData.value"
          :class="{ 'p-invalid': errors.value }"
          class="w-full"
          mode="decimal"
          :min="0"
          :max="100"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :placeholder="$t('taxes.valuePlaceholder')"
        />
        <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
        <small class="p-text-secondary">
          {{ $t("taxes.valueHelp") }}
        </small>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("taxes.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('taxes.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("taxes.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('taxes.detailsArPlaceholder')"
          />
        </div>
      </div>

      <!-- Is Active -->
      <div class="field mb-4">
        <div class="flex align-items-center">
          <Checkbox
            id="is_active"
            v-model="formData.is_active"
            :binary="true"
            class="mr-2"
          />
          <label for="is_active" class="font-medium">
            {{ $t("taxes.isActiveLabel") }}
          </label>
        </div>
        <small class="p-text-secondary">
          {{ $t("taxes.activeStatusHelp") }}
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
          :label="$t('common.update')"
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
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "TaxEditForm",
  components: {
    InputText,
    Textarea,
    InputNumber,
    Checkbox,
    Button,
    Message,
  },
  props: {
    tax: {
      type: Object,
      default: () => ({}),
    },
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
      error: "",
      formData: {
        id: "",
        name: "",
        name_ar: "",
        value: null,
        is_active: true,
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },
  watch: {
    tax: {
      immediate: true,
      deep: true,
      handler(newTax) {
        if (newTax && newTax.id) {
          this.populateForm(newTax);
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    populateForm(tax) {
      this.formData = {
        id: tax.id || "",
        name: tax.name || "",
        name_ar: tax.name_ar || "",
        value: tax.value || null,
        is_active: tax.is_active || false,
        details: tax.details || "",
        details_ar: tax.details_ar || "",
      };
    },
    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        value: null,
        is_active: true,
        details: "",
        details_ar: "",
      };
      this.errors = {};
      this.error = "";
    },
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("taxes.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("taxes.nameArRequired");
      }

      if (!this.formData.value && this.formData.value !== 0) {
        this.errors.value = this.$t("taxes.valueRequired");
      } else if (this.formData.value < 0 || this.formData.value > 100) {
        this.errors.value = this.$t("taxes.valueInvalid");
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
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          value: this.formData.value,
          is_active: this.formData.is_active,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
        };

        const url = `${general_request.BASE_URL}/admin/company/tax/${this.formData.id}`;
        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        this.$emit("tax-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("taxes.success"),
          this.$t("taxes.taxUpdated")
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
      this.error = responseData.message || this.$t("taxes.updateError");
    },
    handleNetworkError(error) {
      this.error = error.message || this.$t("taxes.networkError");
    },
    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("value")) {
          this.errors.value = message;
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
.tax-edit-form {
  max-width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
