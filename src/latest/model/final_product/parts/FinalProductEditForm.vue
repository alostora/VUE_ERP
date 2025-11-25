<template>
  <div class="final-product-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information (Read-only) -->
      <div class="grid">
        <!-- Category -->
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">
            {{ $t("final_product.category") }}
          </label>
          <div
            class="flex align-items-center gap-2 p-inputtext p-component w-full"
            style="background: #f8f9fa; color: #6c757d"
          >
            <img
              v-if="finalProduct.category?.file"
              :src="finalProduct.category.file.file_path"
              :alt="finalProduct.category.name"
              class="category-image"
            />
            <span>{{ finalProduct.category?.name || "No category" }}</span>
          </div>
          <small class="p-text-secondary">
            {{ $t("final_product.cannotChangeCategory") }}
          </small>
        </div>

        <!-- Product -->
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">
            {{ $t("final_product.product") }}
          </label>
          <div
            class="p-inputtext p-component w-full"
            style="background: #f8f9fa; color: #6c757d"
          >
            {{ finalProduct.product?.name || "No product" }}
          </div>
          <small class="p-text-secondary">
            {{ $t("final_product.cannotChangeProduct") }}
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
          class="w-full"
          mode="currency"
          currency="USD"
          locale="en-US"
          :placeholder="$t('final_product.pricePlaceholder')"
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

      <!-- Current Variants (Read-only) -->
      <div
        class="field mb-3"
        v-if="finalProduct.final_product_variant_values?.length"
      >
        <label class="font-bold block mb-2">
          {{ $t("final_product.currentVariants") }}
        </label>
        <div class="current-variants p-3 border-round border surface-border">
          <div
            v-for="variantValue in finalProduct.final_product_variant_values"
            :key="variantValue.id"
            class="variant-chip mb-2"
          >
            <Chip
              :label="`${variantValue.variant.name}: ${variantValue.variant_value.value}`"
              class="mr-2"
            />
            <small class="text-color-secondary">
              (Arabic: {{ variantValue.variant.name_ar }}:
              {{ variantValue.variant_value.value_ar }})
            </small>
          </div>
        </div>
        <small class="p-text-secondary">
          {{ $t("final_product.cannotChangeVariants") }}
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
import Button from "primevue/button";
import Message from "primevue/message";
import Chip from "primevue/chip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductEditForm",
  components: {
    InputText,
    Textarea,
    InputNumber,
    Button,
    Message,
    Chip,
  },

  props: {
    finalProduct: {
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
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },

  watch: {
    finalProduct: {
      immediate: true,
      deep: true,
      handler(newFinalProduct) {
        if (newFinalProduct && newFinalProduct.id) {
          this.populateForm(newFinalProduct);
        } else {
          this.resetForm();
        }
      },
    },
  },

  methods: {
    populateForm(finalProduct) {
      console.log("📝 Populating form with final product:", finalProduct);

      this.formData = {
        id: finalProduct.id || "",
        price: finalProduct.price || null,
        name: finalProduct.name || "",
        name_ar: finalProduct.name_ar || "",
        details: finalProduct.details || "",
        details_ar: finalProduct.details_ar || "",
      };

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      };
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.price) {
        this.errors.price = this.$t("final_product.priceRequired");
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
        // Prepare payload for update (only allowed fields)
        const payload = {
          price: this.formData.price,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
        };

        console.log("📤 Updating final product with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company/product/final-product/${this.formData.id}`;
        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Final product updated successfully:", response.data);

        this.$emit("final-product-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("final_product.success"),
          this.$t("final_product.finalProductUpdated")
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
      this.error = responseData.message || this.$t("final_product.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("final_product.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("price")) {
          this.errors.price = message;
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
.final-product-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.current-variants {
  background: var(--surface-ground);
}

.variant-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--surface-border);
}
</style>
