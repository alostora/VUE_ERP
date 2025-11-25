<template>
  <div class="final-product-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Category -->
        <div class="col-12 md:col-6 field">
          <label for="category" class="font-bold block mb-2">
            {{ $t("final_product.category") }} *
          </label>
          <Select
            id="category"
            v-model="selectedCategory"
            :options="categories"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.category_id }"
            :placeholder="
              loadingCategories
                ? $t('final_product.loadingCategories')
                : $t('final_product.selectCategory')
            "
            class="w-full"
            :loading="loadingCategories"
            :disabled="loadingCategories"
            @change="onCategoryChange"
          />
          <small v-if="errors.category_id" class="p-error">
            {{ errors.category_id }}
          </small>
        </div>

        <!-- Product -->
        <div class="col-12 md:col-6 field">
          <label for="product" class="font-bold block mb-2">
            {{ $t("final_product.product") }} *
          </label>
          <Select
            id="product"
            v-model="selectedProduct"
            :options="filteredProducts"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.product_id }"
            :placeholder="
              loadingProducts
                ? $t('final_product.loadingProducts')
                : $t('final_product.selectProduct')
            "
            class="w-full"
            :loading="loadingProducts"
            :disabled="loadingProducts || !selectedCategory"
          />
          <small v-if="errors.product_id" class="p-error">
            {{ errors.product_id }}
          </small>
        </div>
      </div>

      <!-- Price -->
      <div class="field mb-3">
        <label for="price" class="font-bold block mb-2">
          {{ $t("final_product.price") }} *
        </label>
        <InputNumber
          id="price"
          v-model="formData.price"
          :class="{ 'p-invalid': errors.price }"
          class="w-full price-input"
          mode="decimal"
          :min="0"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :placeholder="$t('final_product.pricePlaceholder')"
          @blur="validatePrice"
        />
        <small v-if="errors.price" class="p-error">{{ errors.price }}</small>
      </div>

      <!-- Names -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("final_product.name") }}
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            class="w-full"
            :placeholder="$t('final_product.namePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("final_product.name_ar") }}
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            class="w-full"
            :placeholder="$t('final_product.nameArPlaceholder')"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("final_product.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("final_product.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsArPlaceholder')"
          />
        </div>
      </div>

      <!-- Variants Section -->
      <div class="field mb-3">
        <div class="flex justify-content-between align-items-center mb-3">
          <label class="font-bold block">
            {{ $t("final_product.variants") }}
          </label>
          <Button
            icon="pi pi-plus"
            :label="$t('final_product.addVariant')"
            class="p-button-outlined p-button-sm"
            @click="addVariantRow"
            :disabled="!selectedCategory"
          />
        </div>

        <div class="variants-section">
          <!-- Variant Rows -->
          <div
            v-for="(variantRow, index) in variantRows"
            :key="index"
            class="variant-row mb-2 p-2 border-round border surface-border"
          >
            <div class="grid align-items-center">
              <!-- Variant Selection -->
              <div class="col-12 md:col-5 field mb-0">
                <label class="font-medium block mb-1 text-xs">
                  {{ $t("final_product.variant") }}
                </label>
                <Select
                  v-model="variantRow.variant_id"
                  :options="availableVariantsForRow(index)"
                  option-label="name"
                  option-value="id"
                  :placeholder="$t('final_product.selectVariant')"
                  class="w-full variant-select"
                  @change="onVariantChange(index, $event)"
                />
              </div>

              <!-- Variant Value Selection -->
              <div class="col-12 md:col-5 field mb-0">
                <label class="font-medium block mb-1 text-xs">
                  {{ $t("final_product.variantValue") }}
                </label>
                <Select
                  v-model="variantRow.variant_value_id"
                  :options="getVariantValues(variantRow.variant_id)"
                  option-label="value"
                  option-value="id"
                  :placeholder="$t('final_product.selectVariantValue')"
                  class="w-full variant-select"
                  :disabled="!variantRow.variant_id"
                  :loading="loadingVariantValues"
                />
              </div>

              <!-- Remove Button -->
              <div class="col-12 md:col-2 field mb-0">
                <Button
                  icon="pi pi-times"
                  class="p-button-text p-button-danger p-button-sm remove-btn"
                  @click="removeVariantRow(index)"
                  v-tooltip="$t('final_product.removeVariant')"
                  :disabled="variantRows.length === 1"
                />
              </div>
            </div>

            <!-- Selected values display -->
            <div
              v-if="variantRow.variant_id || variantRow.variant_value_id"
              class="mt-2 text-xs text-color-secondary"
            >
              <span v-if="variantRow.variant_id">
                Variant: {{ getSelectedVariantName(variantRow.variant_id) }}
              </span>
              <span v-if="variantRow.variant_value_id" class="ml-2">
                Value:
                {{
                  getSelectedVariantValueName(
                    variantRow.variant_value_id,
                    variantRow.variant_id
                  )
                }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="variantRows.length === 0"
            class="empty-variants text-center py-3"
          >
            <i class="pi pi-inbox text-3xl text-color-secondary mb-2"></i>
            <p class="text-color-secondary text-sm mb-2">
              No variants added yet
            </p>
            <Button
              icon="pi pi-plus"
              :label="$t('final_product.addVariant')"
              class="p-button-outlined p-button-sm"
              @click="addVariantRow"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border"
      >
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
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Message from "primevue/message";
import Tooltip from "primevue/tooltip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductCreateForm",
  components: {
    InputText,
    Textarea,
    Select,
    InputNumber,
    Button,
    Message,
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

    filteredProducts() {
      if (!this.selectedCategory) return [];
      return this.products.filter(
        (product) => product.category_id === this.selectedCategory
      );
    },

    availableVariantsForRow() {
      return (currentIndex) => {
        const selectedVariantIds = this.variantRows
          .filter((_, index) => index !== currentIndex)
          .map((row) => row.variant_id)
          .filter((id) => id);

        return this.variants.filter(
          (variant) => !selectedVariantIds.includes(variant.id)
        );
      };
    },
  },

  data() {
    return {
      loading: false,
      loadingCategories: false,
      loadingProducts: false,
      loadingVariants: false,
      loadingVariantValues: false,
      error: "",
      categories: [],
      products: [],
      variants: [],
      variantValues: {},
      selectedCategory: null,
      selectedProduct: null,

      variantRows: [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ],

      formData: {
        company_id: "",
        category_id: "",
        product_id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },

  mounted() {
    this.loadCategories();
    this.loadVariants();
  },

  methods: {
    addVariantRow() {
      this.variantRows.push({
        variant_id: null,
        variant_value_id: null,
      });
    },

    removeVariantRow(index) {
      if (this.variantRows.length > 1) {
        this.variantRows.splice(index, 1);
      }
    },

    validatePrice() {
      if (!this.formData.price || this.formData.price <= 0) {
        this.errors.price = this.$t("final_product.priceRequired");
      } else {
        delete this.errors.price;
      }
    },

    onCategoryChange() {
      this.selectedProduct = null;
      this.formData.product_id = "";
      this.variantRows = [{ variant_id: null, variant_value_id: null }];

      if (this.selectedCategory) {
        this.loadProducts();
      } else {
        this.products = [];
      }
    },

    async onVariantChange(rowIndex, event) {
      const variantId = event.value;

      this.variantRows[rowIndex].variant_value_id = null;

      if (variantId) {
        await this.loadVariantValues(variantId);
      }

      this.$forceUpdate();
    },

    getSelectedVariantName(variantId) {
      if (!variantId) return "";
      const variant = this.variants.find((v) => v.id === variantId);
      return variant ? variant.name : "";
    },

    getSelectedVariantValueName(valueId, variantId) {
      if (!valueId || !variantId) return "";
      const values = this.variantValues[variantId] || [];
      const value = values.find((v) => v.id === valueId);
      return value ? value.value : "";
    },

    getVariantValues(variantId) {
      if (!variantId) return [];
      return this.variantValues[variantId] || [];
    },

    async loadCategories() {
      this.loadingCategories = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/categories/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.categories = response.data.data || [];
      } catch (error) {
        console.error("Error loading categories:", error);
        this.error = this.$t("final_product.loadingCategoriesError");
      } finally {
        this.loadingCategories = false;
      }
    },

    async loadProducts() {
      this.loadingProducts = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/products/search/${this.effectiveCompanyId}?category_uuid=${this.selectedCategory}&paginate=false`,
          {
            headers: general_request.headers,
          }
        );
        this.products = response.data.data || [];
      } catch (error) {
        console.error("Error loading products:", error);
        this.error = this.$t("final_product.loadingProductsError");
      } finally {
        this.loadingProducts = false;
      }
    },

    async loadVariants() {
      this.loadingVariants = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/variants/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.variants = response.data.data || [];
      } catch (error) {
        console.error("Error loading variants:", error);
        this.error = this.$t("final_product.loadingVariantsError");
      } finally {
        this.loadingVariants = false;
      }
    },

    async loadVariantValues(variantId) {
      this.loadingVariantValues = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/variant-values/search/${variantId}`,
          {
            headers: general_request.headers,
          }
        );

        const variantValuesData = response.data.data || [];

        this.variantValues = {
          ...this.variantValues,
          [variantId]: variantValuesData,
        };

        this.$forceUpdate();
      } catch (error) {
        console.error("Error loading variant values:", error);
        this.variantValues = {
          ...this.variantValues,
          [variantId]: [],
        };
      } finally {
        this.loadingVariantValues = false;
      }
    },

    resetForm() {
      this.formData = {
        company_id: this.effectiveCompanyId,
        category_id: "",
        product_id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      };
      this.variantRows = [{ variant_id: null, variant_value_id: null }];
      this.selectedCategory = null;
      this.selectedProduct = null;
      this.variantValues = {};
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.selectedCategory) {
        this.errors.category_id = this.$t("final_product.categoryRequired");
      }

      if (!this.selectedProduct) {
        this.errors.product_id = this.$t("final_product.productRequired");
      }

      if (!this.formData.price || this.formData.price <= 0) {
        this.errors.price = this.$t("final_product.priceRequired");
      }

      this.variantRows.forEach((row, index) => {
        if (row.variant_id && !row.variant_value_id) {
          this.errors[`variant_row_${index}`] = this.$t(
            "final_product.variantValueRequired"
          );
        }
      });

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
          category_id: this.selectedCategory,
          product_id: this.selectedProduct,
          price: this.formData.price,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
          variants: this.variantRows.filter(
            (row) => row.variant_id && row.variant_value_id
          ),
        };

        const url = `${general_request.BASE_URL}/admin/company/product/final-product`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("final-product-created", response.data.data);

        this.showToast(
          "success",
          this.$t("final_product.success"),
          this.$t("final_product.finalProductCreated")
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
      this.error = responseData.message || this.$t("final_product.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("final_product.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("category")) {
          this.errors.category_id = message;
        } else if (message.includes("product")) {
          this.errors.product_id = message;
        } else if (message.includes("price")) {
          this.errors.price = message;
        } else if (message.includes("variant")) {
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
.final-product-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.variants-section {
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.variant-row {
  background: var(--surface-ground);
  padding: 0.75rem;
}

.variant-row:last-child {
  margin-bottom: 0;
}

.empty-variants {
  border: 2px dashed var(--surface-border);
  border-radius: 6px;
  background: var(--surface-card);
  padding: 1.5rem;
}

/* تحسينات للسعر علشان يظهر الخطأ */
:deep(.price-input.p-invalid .p-inputnumber-input) {
  border-color: #e24c4c !important;
}

:deep(.price-input.p-invalid .p-inputnumber-input:focus) {
  box-shadow: 0 0 0 0.2rem rgba(226, 76, 76, 0.2) !important;
}

/* تحسينات لل selects الصغيرة */
:deep(.variant-select .p-dropdown) {
  min-height: 2rem;
  font-size: 0.875rem;
}

:deep(.variant-select .p-dropdown-label) {
  padding: 0.4rem 0.5rem;
  font-size: 0.875rem;
}

/* تحسينات للأزرار الصغيرة */
.remove-btn {
  min-width: 2rem;
  height: 2rem;
}

/* تحسينات لل responsive */
@media (max-width: 768px) {
  .variants-section {
    max-height: 250px;
  }

  .variant-row .grid {
    gap: 0.5rem;
  }
}
</style>
