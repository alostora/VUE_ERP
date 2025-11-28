<template>
  <div class="discount-final-product-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <!-- Available Products Info -->
    <Message severity="info" class="mb-4" v-if="availableProducts.length > 0">
      {{ $t("discounts.availableProducts") }}: {{ availableProducts.length }}
    </Message>

    <Message severity="warn" class="mb-4" v-else-if="!loadingProducts">
      {{ $t("discounts.noAvailableProducts") }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Products Selection -->
      <div class="field">
        <label class="font-bold block mb-2">
          {{ $t("discounts.selectProducts") }} *
        </label>
        <MultiSelect
          v-model="selectedProducts"
          :options="availableProducts"
          option-label="name"
          option-value="id"
          :class="{ 'p-invalid': errors.final_product_ids }"
          :placeholder="
            loadingProducts
              ? $t('discounts.loadingProducts')
              : $t('discounts.productsPlaceholder')
          "
          class="w-full"
          :loading="loadingProducts"
          :disabled="loadingProducts || availableProducts.length === 0"
          display="chip"
          :maxSelectedLabels="3"
          :filter="true"
        />
        <small class="p-error" v-if="errors.final_product_ids">
          {{ errors.final_product_ids }}
        </small>
      </div>

      <!-- Selected Products Preview -->
      <div
        v-if="selectedProducts.length > 0"
        class="selected-products-preview mt-3"
      >
        <label class="font-medium block mb-2"
          >{{ $t("discounts.selectedProducts") }}:</label
        >
        <div class="selected-chips">
          <Chip
            v-for="product in getSelectedProductsDetails()"
            :key="product.id"
            :label="product.name"
            class="mr-2 mb-2"
          >
            <span class="ml-2 text-xs text-color-secondary"
              >({{ product.name_ar }})</span
            >
          </Chip>
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
          class="p-button-primary"
          :disabled="!canSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script>
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Message from "primevue/message";
import Chip from "primevue/chip";
import general_request from "../../../../views/layouts/constants/general_request";

export default {
  name: "DiscountFinalProductCreateForm",
  components: {
    MultiSelect,
    Button,
    Message,
    Chip,
  },
  props: {
    discount_id: {
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
      loading: false,
      loadingProducts: false,
      error: "",
      availableProducts: [],
      selectedProducts: [],
      errors: {},
    };
  },
  computed: {
    canSubmit() {
      return this.selectedProducts.length > 0;
    },
  },
  mounted() {
    this.loadAvailableProducts();
  },
  methods: {
    getSelectedProductsDetails() {
      return this.selectedProducts.map((productId) => {
        return (
          this.availableProducts.find((p) => p.id === productId) || {
            id: productId,
            name: this.$t("discounts.unknownProduct"),
            name_ar: this.$t("discounts.unknownProductAr"),
          }
        );
      });
    },

    async loadAvailableProducts() {
      this.loadingProducts = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/product/final-products/list/${this.company_id}?discount_id=${this.discount_id}`;
        console.log("Loading available products from:", url);

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        console.log(
          "Available products loaded:",
          response.data.data?.length || 0
        );
        this.availableProducts = response.data.data || [];
      } catch (error) {
        console.error("Error loading available products:", error);
        this.error = this.$t("discounts.loadingProductsError");
      } finally {
        this.loadingProducts = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (this.selectedProducts.length === 0) {
        this.errors.final_product_ids = this.$t("discounts.productsRequired");
        return false;
      }

      return true;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const payload = {
          company_id: this.company_id,
          discount_id: this.discount_id,
          final_product_ids: this.selectedProducts,
        };

        console.log("Creating discount final products:", payload);

        const url = `${general_request.BASE_URL}/admin/company/discount-final-product`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log(
          "Discount final products created successfully:",
          response.data.data
        );

        this.resetForm();
        this.$emit("final-products-added", response.data.data);

        this.showToast(
          "success",
          this.$t("common.success"),
          this.$t("discounts.finalProductsAdded")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.selectedProducts = [];
      this.errors = {};
      this.error = "";
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
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
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
.discount-final-product-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.selected-products-preview {
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 1rem;
  background: var(--surface-ground);
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
