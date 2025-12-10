<template>
  <div class="variant-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <!-- Single Variant Form -->
    <form v-if="singleVariant" @submit.prevent="submitSingleVariant">
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("variants.name") }} *
        </label>
        <InputText
          id="name"
          v-model="singleFormData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('variants.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("variants.name_ar") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="singleFormData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
          :placeholder="$t('variants.nameArPlaceholder')"
        />
        <small v-if="errors.name_ar" class="p-error">{{
          errors.name_ar
        }}</small>
      </div>

      <div class="flex justify-content-end gap-2">
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

    <!-- Multiple Variants Form -->
    <div v-else>
      <div class="mb-4">
        <Button
          :label="$t('variants.addNewVariant')"
          icon="pi pi-plus"
          @click="addVariant"
          class="p-button-outlined p-button-sm"
        />
      </div>

      <form @submit.prevent="submitMultipleVariants">
        <div
          v-for="(variant, index) in multipleFormData.variants"
          :key="index"
          class="variant-group mb-4 p-3 border-round border surface-border"
        >
          <div class="flex justify-content-between align-items-center mb-3">
            <h4 class="m-0">
              {{ $t("variants.variantName") }} {{ index + 1 }}
            </h4>
            <Button
              v-if="multipleFormData.variants.length > 1"
              icon="pi pi-times"
              @click="removeVariant(index)"
              class="p-button-text p-button-danger p-button-sm"
              v-tooltip="$t('variants.removeVariant')"
            />
          </div>

          <div class="grid mb-3">
            <div class="col-12 md:col-6 field">
              <label :for="`name-${index}`" class="font-bold block mb-2">
                {{ $t("variants.name") }} *
              </label>
              <InputText
                :id="`name-${index}`"
                v-model="variant.name"
                :class="{ 'p-invalid': hasVariantError(index, 'name') }"
                class="w-full"
                :placeholder="$t('variants.namePlaceholder')"
              />
              <small v-if="hasVariantError(index, 'name')" class="p-error">
                {{ getVariantError(index, "name") }}
              </small>
            </div>

            <div class="col-12 md:col-6 field">
              <label :for="`name_ar-${index}`" class="font-bold block mb-2">
                {{ $t("variants.name_ar") }} *
              </label>
              <InputText
                :id="`name_ar-${index}`"
                v-model="variant.name_ar"
                :class="{ 'p-invalid': hasVariantError(index, 'name_ar') }"
                class="w-full"
                :placeholder="$t('variants.nameArPlaceholder')"
              />
              <small v-if="hasVariantError(index, 'name_ar')" class="p-error">
                {{ getVariantError(index, "name_ar") }}
              </small>
            </div>
          </div>

          <!-- Variant Values Section -->
          <div class="values-section">
            <div class="flex justify-content-between align-items-center mb-2">
              <h5 class="m-0">{{ $t("variants.variantValues") }}</h5>
              <Button
                :label="$t('variants.addNewValue')"
                icon="pi pi-plus"
                @click="addValue(index)"
                class="p-button-outlined p-button-sm"
              />
            </div>

            <div
              v-for="(value, valueIndex) in variant.values"
              :key="valueIndex"
              class="value-item grid mb-2"
            >
              <div class="col-12 md:col-5">
                <InputText
                  v-model="value.value"
                  :class="{
                    'p-invalid': hasValueError(index, valueIndex, 'value'),
                  }"
                  class="w-full"
                  :placeholder="$t('variants.valuePlaceholder')"
                />
                <small
                  v-if="hasValueError(index, valueIndex, 'value')"
                  class="p-error"
                >
                  {{ getValueError(index, valueIndex, "value") }}
                </small>
              </div>
              <div class="col-12 md:col-5">
                <InputText
                  v-model="value.value_ar"
                  :class="{
                    'p-invalid': hasValueError(index, valueIndex, 'value_ar'),
                  }"
                  class="w-full"
                  :placeholder="$t('variants.valueArPlaceholder')"
                />
                <small
                  v-if="hasValueError(index, valueIndex, 'value_ar')"
                  class="p-error"
                >
                  {{ getValueError(index, valueIndex, "value_ar") }}
                </small>
              </div>
              <div class="col-12 md:col-2">
                <Button
                  v-if="variant.values.length > 1"
                  icon="pi pi-times"
                  @click="removeValue(index, valueIndex)"
                  class="p-button-text p-button-danger w-full"
                  v-tooltip="$t('variants.removeValue')"
                />
              </div>
            </div>
          </div>
        </div>

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
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import Tooltip from "primevue/tooltip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "VariantCreateForm",
  components: {
    InputText,
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
    singleVariant: {
      type: Boolean,
      default: true,
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
      singleFormData: {
        name: "",
        name_ar: "",
      },
      multipleFormData: {
        variants: [
          {
            name: "",
            name_ar: "",
            values: [{ value: "", value_ar: "" }],
          },
        ],
      },
      errors: {},
      variantErrors: [],
      valueErrors: [],
    };
  },
  methods: {
    // Single Variant Methods
    validateSingleForm() {
      this.errors = {};

      if (!this.singleFormData.name?.trim()) {
        this.errors.name = this.$t("variants.nameRequired");
      }

      if (!this.singleFormData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("variants.nameArRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitSingleVariant() {
      if (!this.validateSingleForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/variant`;

        const payload = {
          company_id: this.effectiveCompanyId,
          name: this.singleFormData.name,
          name_ar: this.singleFormData.name_ar,
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetSingleForm();
        this.$emit("variants-created", response.data.data);

        this.showToast(
          "success",
          this.$t("variants.success"),
          this.$t("variants.variantCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    // Multiple Variants Methods
    addVariant() {
      this.multipleFormData.variants.push({
        name: "",
        name_ar: "",
        values: [{ value: "", value_ar: "" }],
      });
    },

    removeVariant(index) {
      this.multipleFormData.variants.splice(index, 1);
    },

    addValue(variantIndex) {
      this.multipleFormData.variants[variantIndex].values.push({
        value: "",
        value_ar: "",
      });
    },

    removeValue(variantIndex, valueIndex) {
      this.multipleFormData.variants[variantIndex].values.splice(valueIndex, 1);
    },

    validateMultipleForm() {
      this.variantErrors = [];
      this.valueErrors = [];

      let isValid = true;

      if (this.multipleFormData.variants.length === 0) {
        this.error = this.$t("variants.atLeastOneVariant");
        return false;
      }

      this.multipleFormData.variants.forEach((variant, variantIndex) => {
        const variantError = {};

        if (!variant.name?.trim()) {
          variantError.name = this.$t("variants.nameRequired");
          isValid = false;
        }

        if (!variant.name_ar?.trim()) {
          variantError.name_ar = this.$t("variants.nameArRequired");
          isValid = false;
        }

        if (variant.values.length === 0) {
          variantError.values = this.$t("variants.atLeastOneValue");
          isValid = false;
        }

        if (Object.keys(variantError).length > 0) {
          this.variantErrors[variantIndex] = variantError;
        }

        // Validate values
        variant.values.forEach((value, valueIndex) => {
          const valueError = {};

          if (!value.value?.trim()) {
            valueError.value = this.$t("variants.valueRequired");
            isValid = false;
          }

          if (!value.value_ar?.trim()) {
            valueError.value_ar = this.$t("variants.valueArRequired");
            isValid = false;
          }

          if (Object.keys(valueError).length > 0) {
            if (!this.valueErrors[variantIndex]) {
              this.valueErrors[variantIndex] = [];
            }
            this.valueErrors[variantIndex][valueIndex] = valueError;
          }
        });
      });

      return isValid;
    },

    hasVariantError(variantIndex, field) {
      return (
        this.variantErrors[variantIndex] &&
        this.variantErrors[variantIndex][field]
      );
    },

    getVariantError(variantIndex, field) {
      return this.variantErrors[variantIndex]?.[field] || "";
    },

    hasValueError(variantIndex, valueIndex, field) {
      return this.valueErrors[variantIndex]?.[valueIndex]?.[field];
    },

    getValueError(variantIndex, valueIndex, field) {
      return this.valueErrors[variantIndex]?.[valueIndex]?.[field] || "";
    },

    async submitMultipleVariants() {
      if (!this.validateMultipleForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/variants`;

        const payload = {
          company_id: this.effectiveCompanyId,
          variants: this.multipleFormData.variants.map((variant) => ({
            name: variant.name,
            name_ar: variant.name_ar,
            values: variant.values.map((value) => ({
              value: value.value,
              value_ar: value.value_ar,
            })),
          })),
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetMultipleForm();
        this.$emit("variants-created", response.data.data);

        this.showToast(
          "success",
          this.$t("variants.success"),
          this.$t("variants.variantsCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    // Common Methods
    resetSingleForm() {
      this.singleFormData = {
        name: "",
        name_ar: "",
      };
      this.errors = {};
      this.error = "";
    },

    resetMultipleForm() {
      this.multipleFormData = {
        variants: [
          {
            name: "",
            name_ar: "",
            values: [{ value: "", value_ar: "" }],
          },
        ],
      };
      this.variantErrors = [];
      this.valueErrors = [];
      this.error = "";
    },

    handleSaveError(error) {
      this.errors = {};
      this.variantErrors = [];
      this.valueErrors = [];
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
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("variants.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("variants.networkError");
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
.variant-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.variant-group {
  background: var(--surface-ground);
}

.values-section {
  background: var(--surface-card);
  padding: 1rem;
  border-radius: 6px;
}

.value-item {
  gap: 0.5rem;
}
</style>
