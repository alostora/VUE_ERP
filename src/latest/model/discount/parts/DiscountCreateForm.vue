<template>
  <div class="discount-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("discounts.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('discounts.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("discounts.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('discounts.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>
      </div>

      <!-- Discount Type and Value -->
      <div class="grid">
        <!-- Type -->
        <div class="col-12 md:col-6 field">
          <label for="type" class="font-bold block mb-2">
            {{ $t("discounts.type") }} *
          </label>
          <Select
            id="type"
            v-model="selectedType"
            :options="discountTypes"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.type_id }"
            :placeholder="
              loadingTypes
                ? $t('discounts.loadingTypes')
                : $t('discounts.typePlaceholder')
            "
            class="w-full"
            :loading="loadingTypes"
            :disabled="loadingTypes"
          />
          <small v-if="errors.type_id" class="p-error">{{
            errors.type_id
          }}</small>
        </div>

        <!-- Value -->
        <div class="col-12 md:col-6 field">
          <label for="value" class="font-bold block mb-2">
            {{ $t("discounts.value") }} *
          </label>
          <InputNumber
            id="value"
            v-model="formData.value"
            :class="{ 'p-invalid': errors.value }"
            class="w-full"
            mode="decimal"
            :min="0"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :placeholder="$t('discounts.valuePlaceholder')"
          />
          <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid">
        <!-- Date From -->
        <div class="col-12 md:col-6 field">
          <label for="date_from" class="font-bold block mb-2">
            {{ $t("discounts.date_from") }} *
          </label>
          <Calendar
            id="date_from"
            v-model="formData.date_from"
            :class="{ 'p-invalid': errors.date_from }"
            class="w-full"
            date-format="yy-mm-dd"
            :show-icon="true"
            :min-date="minDate"
          />
          <small v-if="errors.date_from" class="p-error">{{
            errors.date_from
          }}</small>
        </div>

        <!-- Date To -->
        <div class="col-12 md:col-6 field">
          <label for="date_to" class="font-bold block mb-2">
            {{ $t("discounts.date_to") }} *
          </label>
          <Calendar
            id="date_to"
            v-model="formData.date_to"
            :class="{ 'p-invalid': errors.date_to }"
            class="w-full"
            date-format="yy-mm-dd"
            :show-icon="true"
            :min-date="formData.date_from || minDate"
          />
          <small v-if="errors.date_to" class="p-error">{{
            errors.date_to
          }}</small>
        </div>
      </div>

      <!-- Branches Selection -->
      <div class="field">
        <label class="font-bold block mb-2">
          {{ $t("discounts.branches") }}
        </label>
        <MultiSelect
          v-model="selectedBranches"
          :options="branches"
          option-label="name"
          option-value="id"
          class="w-full"
          :placeholder="
            loadingBranches
              ? $t('discounts.loadingBranches')
              : $t('discounts.branchesPlaceholder')
          "
          :loading="loadingBranches"
          :disabled="loadingBranches"
          display="chip"
        />
      </div>

      <!-- Products Selection -->
      <div class="field">
        <label class="font-bold block mb-2">
          {{ $t("discounts.products") }}
        </label>
        <MultiSelect
          v-model="selectedProducts"
          :options="products"
          option-label="name"
          option-value="id"
          class="w-full"
          :placeholder="
            loadingProducts
              ? $t('discounts.loadingProducts')
              : $t('discounts.productsPlaceholder')
          "
          :loading="loadingProducts"
          :disabled="loadingProducts"
          display="chip"
        />
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("discounts.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('discounts.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("discounts.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('discounts.detailsArPlaceholder')"
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
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-secondary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "DiscountCreateForm",
  components: {
    InputText,
    Textarea,
    InputNumber,
    Select,
    MultiSelect,
    Calendar,
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
      discountTypes: [],
      branches: [],
      products: [],
      loadingTypes: false,
      loadingBranches: false,
      loadingProducts: false,
      selectedType: null,
      selectedBranches: [],
      selectedProducts: [],
      formData: {
        company_id: "",
        name: "",
        name_ar: "",
        type_id: null,
        value: null,
        date_from: null,
        date_to: null,
        branch_ids: [],
        final_product_ids: [],
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    minDate() {
      return new Date();
    },
  },
  watch: {
    selectedType: {
      handler(newValue) {
        this.formData.type_id = newValue;
      },
    },
    selectedBranches: {
      handler(newValue) {
        this.formData.branch_ids = newValue;
      },
    },
    selectedProducts: {
      handler(newValue) {
        this.formData.final_product_ids = newValue;
      },
    },
  },
  mounted() {
    this.formData.company_id = this.effectiveCompanyId;
    this.loadDiscountTypes();
    this.loadBranches();
    this.loadProducts();
  },
  methods: {
    resetForm() {
      this.formData = {
        company_id: this.effectiveCompanyId,
        name: "",
        name_ar: "",
        type_id: null,
        value: null,
        date_from: null,
        date_to: null,
        branch_ids: [],
        final_product_ids: [],
        details: "",
        details_ar: "",
      };
      this.selectedType = null;
      this.selectedBranches = [];
      this.selectedProducts = [];
      this.errors = {};
      this.error = "";
    },
    async loadDiscountTypes() {
      this.loadingTypes = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/16`,
          {
            headers: general_request.headers,
          }
        );
        // ✅ CORRECT: Use the API response directly
        this.discountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading discount types:", error);
        this.error = this.$t("discounts.loadingTypesError");
      } finally {
        this.loadingTypes = false;
      }
    },
    async loadBranches() {
      this.loadingBranches = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/branches/list/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.branches = response.data.data || [];
      } catch (error) {
        console.error("Error loading branches:", error);
        this.error = this.$t("discounts.loadingBranchesError");
      } finally {
        this.loadingBranches = false;
      }
    },
    async loadProducts() {
      this.loadingProducts = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/product/final-products/list/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.products = response.data.data || [];
      } catch (error) {
        console.error("Error loading products:", error);
        this.error = this.$t("discounts.loadingProductsError");
      } finally {
        this.loadingProducts = false;
      }
    },
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("discounts.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("discounts.nameArRequired");
      }

      if (!this.formData.type_id) {
        this.errors.type_id = this.$t("discounts.typeRequired");
      }

      if (!this.formData.value && this.formData.value !== 0) {
        this.errors.value = this.$t("discounts.valueRequired");
      } else if (this.formData.value < 0) {
        this.errors.value = this.$t("discounts.valueInvalid");
      }

      if (!this.formData.date_from) {
        this.errors.date_from = this.$t("discounts.dateFromRequired");
      }

      if (!this.formData.date_to) {
        this.errors.date_to = this.$t("discounts.dateToRequired");
      } else if (
        this.formData.date_from &&
        this.formData.date_to < this.formData.date_from
      ) {
        this.errors.date_to = this.$t("discounts.dateToInvalid");
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
          type_id: this.formData.type_id,
          value: this.formData.value,
          date_from: this.formatDate(this.formData.date_from),
          date_to: this.formatDate(this.formData.date_to),
          branch_ids: this.formData.branch_ids,
          final_product_ids: this.formData.final_product_ids,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
        };

        const url = `${general_request.BASE_URL}/admin/company/discount`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("discount-created", response.data.data);

        this.showToast(
          "success",
          this.$t("discounts.success"),
          this.$t("discounts.discountCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
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
      this.error = responseData.message || this.$t("discounts.createError");
    },
    handleNetworkError(error) {
      this.error = error.message || this.$t("discounts.networkError");
    },
    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("value")) {
          this.errors.value = message;
        } else if (message.includes("type")) {
          this.errors.type_id = message;
        } else if (message.includes("date_from")) {
          this.errors.date_from = message;
        } else if (message.includes("date_to")) {
          this.errors.date_to = message;
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
.discount-create-form {
  max-width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
