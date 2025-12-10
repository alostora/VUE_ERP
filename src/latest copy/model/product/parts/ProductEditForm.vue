<template>
  <div class="product-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("products.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('products.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("products.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('products.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>
      </div>

      <!-- Current Category (Read-only) -->
      <div class="field mb-3">
        <label class="font-bold block mb-2">
          {{ $t("products.category") }}
        </label>
        <div
          class="flex align-items-center gap-2 p-inputtext p-component w-full"
          style="background: #f8f9fa; color: #6c757d"
        >
          <img
            v-if="product.category?.file"
            :src="product.category.file.file_path"
            :alt="product.category.name"
            class="category-image"
          />
          <span>{{ product.category?.name || "No category" }}</span>
        </div>
        <small class="p-text-secondary">
          {{ $t("products.categoryCannotBeChanged") }}
        </small>
      </div>

      <!-- Measurement Units -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="purchasesUnit" class="font-bold block mb-2">
            {{ $t("products.purchasesUnit") }} *
          </label>
          <Select
            id="purchasesUnit"
            v-model="selectedPurchasesUnit"
            :options="measurementUnits"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.purchases_measurement_unit_id }"
            :placeholder="
              loadingMeasurementUnits
                ? $t('products.loadingMeasurementUnits')
                : $t('products.selectPurchasesUnit')
            "
            class="w-full"
            :loading="loadingMeasurementUnits"
            :disabled="loadingMeasurementUnits"
          />
          <small v-if="errors.purchases_measurement_unit_id" class="p-error">
            {{ errors.purchases_measurement_unit_id }}
          </small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="salesUnit" class="font-bold block mb-2">
            {{ $t("products.salesUnit") }} *
          </label>
          <Select
            id="salesUnit"
            v-model="selectedSalesUnit"
            :options="measurementUnits"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.sales_measurement_unit_id }"
            :placeholder="
              loadingMeasurementUnits
                ? $t('products.loadingMeasurementUnits')
                : $t('products.selectSalesUnit')
            "
            class="w-full"
            :loading="loadingMeasurementUnits"
            :disabled="loadingMeasurementUnits"
          />
          <small v-if="errors.sales_measurement_unit_id" class="p-error">
            {{ errors.sales_measurement_unit_id }}
          </small>
        </div>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("products.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('products.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("products.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('products.detailsArPlaceholder')"
          />
        </div>
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
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "ProductEditForm",
  components: {
    InputText,
    Textarea,
    Select,
    Button,
    Message,
  },
  props: {
    product: {
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
      loadingMeasurementUnits: false,
      error: "",
      measurementUnits: [],
      selectedPurchasesUnit: null,
      selectedSalesUnit: null,
      formData: {
        id: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
        purchases_measurement_unit_id: "",
        sales_measurement_unit_id: "",
      },
      errors: {},
    };
  },
  watch: {
    product: {
      immediate: true,
      deep: true,
      handler(newProduct) {
        if (newProduct && newProduct.id) {
          this.populateForm(newProduct);
        } else {
          this.resetForm();
        }
      },
    },
    selectedPurchasesUnit: {
      handler(newValue) {
        this.formData.purchases_measurement_unit_id = newValue;
      },
    },
    selectedSalesUnit: {
      handler(newValue) {
        this.formData.sales_measurement_unit_id = newValue;
      },
    },
  },
  mounted() {
    this.loadMeasurementUnits();
  },
  methods: {
    populateForm(product) {

      this.formData = {
        id: product.id || "",
        name: product.name || "",
        name_ar: product.name_ar || "",
        details: product.details || "",
        details_ar: product.details_ar || "",
        purchases_measurement_unit_id:
          product.purchases_measurement_unit?.id || "",
        sales_measurement_unit_id: product.sales_measurement_unit?.id || "",
      };

      // Set selected values
      this.selectedPurchasesUnit =
        product.purchases_measurement_unit?.id || null;
      this.selectedSalesUnit = product.sales_measurement_unit?.id || null;

    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
        purchases_measurement_unit_id: "",
        sales_measurement_unit_id: "",
      };
      this.selectedPurchasesUnit = null;
      this.selectedSalesUnit = null;
      this.errors = {};
      this.error = "";
    },

    async loadMeasurementUnits() {
      this.loadingMeasurementUnits = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/measurement-units/search/${this.effectiveCompanyId}`;

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        this.measurementUnits = response.data.data || [];
      } catch (error) {
        this.error = this.$t("products.fetchError");
      } finally {
        this.loadingMeasurementUnits = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("products.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("products.nameArRequired");
      }

      if (!this.formData.purchases_measurement_unit_id) {
        this.errors.purchases_measurement_unit_id = this.$t(
          "products.purchasesUnitRequired"
        );
      }

      if (!this.formData.sales_measurement_unit_id) {
        this.errors.sales_measurement_unit_id = this.$t(
          "products.salesUnitRequired"
        );
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
        const url = `${general_request.BASE_URL}/admin/company/product/${this.formData.id}`;

        const payload = {
          purchases_measurement_unit_id:
            this.formData.purchases_measurement_unit_id,
          sales_measurement_unit_id: this.formData.sales_measurement_unit_id,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
        };

        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        this.$emit("product-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("products.success"),
          this.$t("products.productUpdated")
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
      this.error = responseData.message || this.$t("products.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("products.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("purchases")) {
          this.errors.purchases_measurement_unit_id = message;
        } else if (message.includes("sales")) {
          this.errors.sales_measurement_unit_id = message;
        } else if (message.includes("name")) {
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
.product-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.category-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--surface-border);
}
</style>
