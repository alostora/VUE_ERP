<template>
  <Dialog
    :header="$t('final_product_variants.addVariants')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- Available Variants Info -->
    <Message severity="info" class="mb-4" v-if="variants.length > 0">
      {{ $t("final_product_variants.availableVariants") }}:
      {{ variants.length }}
    </Message>

    <Message severity="warn" class="mb-4" v-else-if="!loadingVariants">
      No variants available for this company
    </Message>

    <!-- Variant Rows -->
    <div class="variant-rows">
      <div
        v-for="(variantRow, index) in variantRows"
        :key="index"
        class="variant-row mb-3 p-3 border-round border surface-border"
      >
        <div class="grid align-items-center">
          <!-- Variant Selection -->
          <div class="col-12 md:col-5 field mb-0">
            <label class="font-medium block mb-2">
              {{ $t("final_product_variants.variantType") }} *
            </label>
            <Select
              v-model="variantRow.variant_id"
              :options="availableVariantsForRow(index)"
              option-label="name"
              option-value="id"
              :placeholder="$t('final_product_variants.selectVariant')"
              class="w-full"
              @change="onVariantChange(index, $event)"
              :disabled="loadingVariants || variants.length === 0"
            />
            <small class="p-error" v-if="errors[`variant_${index}`]">
              {{ errors[`variant_${index}`] }}
            </small>
          </div>

          <!-- Variant Value Selection -->
          <div class="col-12 md:col-5 field mb-0">
            <label class="font-medium block mb-2">
              {{ $t("final_product_variants.variantValue") }} *
            </label>
            <Select
              v-model="variantRow.variant_value_id"
              :options="getVariantValues(variantRow.variant_id)"
              option-label="value"
              option-value="id"
              :placeholder="$t('final_product_variants.selectVariantValue')"
              class="w-full"
              :disabled="!variantRow.variant_id || loadingVariantValues"
            />
            <small class="p-error" v-if="errors[`value_${index}`]">
              {{ errors[`value_${index}`] }}
            </small>
          </div>

          <!-- Remove Button -->
          <div class="col-12 md:col-2 field mb-0 pt-4">
            <Button
              icon="pi pi-times"
              class="p-button-text p-button-danger"
              @click="removeVariantRow(index)"
              v-tooltip="$t('final_product_variants.removeVariantRow')"
              :disabled="variantRows.length === 1"
            />
          </div>
        </div>

        <!-- Selected Variant Info -->
        <div
          v-if="variantRow.variant_id || variantRow.variant_value_id"
          class="mt-2 text-sm text-color-secondary"
        >
          <span v-if="variantRow.variant_id">
            {{ getSelectedVariantName(variantRow.variant_id) }}
          </span>
          <span v-if="variantRow.variant_value_id" class="ml-2">
            -
            {{
              getSelectedVariantValueName(
                variantRow.variant_value_id,
                variantRow.variant_id
              )
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add More Button -->
    <div class="flex justify-content-start mb-4">
      <Button
        :label="$t('final_product_variants.addVariantRow')"
        icon="pi pi-plus"
        class="p-button-outlined p-button-sm"
        @click="addVariantRow"
        :disabled="loadingVariants || variants.length === 0"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button
        :label="$t('common.cancel')"
        @click="closeModal"
        class="p-button-text"
        :disabled="loading"
      />
      <Button
        :label="$t('common.create')"
        @click="submitForm"
        class="p-button-primary"
        :loading="loading"
        :disabled="!canSubmit || loading"
      />
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("final_product_variants.creatingVariants") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import Tooltip from "primevue/tooltip";
import general_request from "../../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductVariantCreateModal",
  components: {
    Dialog,
    Select,
    Button,
    Message,
    ProgressSpinner,
  },
  directives: {
    tooltip: Tooltip,
  },
  props: {
    final_product_id: {
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
      visible: false,
      loading: false,
      loadingVariants: false,
      loadingVariantValues: false,
      variants: [],
      variantValues: {},
      variantRows: [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ],
      errors: {},
    };
  },
  computed: {
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

    canSubmit() {
      return this.variantRows.some(
        (row) => row.variant_id && row.variant_value_id
      );
    },
  },
  methods: {
    openModal() {
      console.log("🔧 Modal opened with:", {
        company_id: this.company_id,
        final_product_id: this.final_product_id,
      });

      this.visible = true;
      this.errors = {};

      if (!this.company_id) {
        console.error("❌ Company ID is undefined!");
        this.showError("Company ID is missing");
        return;
      }

      this.loadVariants();
    },

    closeModal() {
      this.visible = false;
      this.resetForm();
    },

    addVariantRow() {
      this.variantRows.push({
        variant_id: null,
        variant_value_id: null,
      });
    },

    removeVariantRow(index) {
      if (this.variantRows.length > 1) {
        this.variantRows.splice(index, 1);

        // Clear errors for removed row
        delete this.errors[`variant_${index}`];
        delete this.errors[`value_${index}`];
      }
    },

    async onVariantChange(rowIndex, event) {
      const variantId = event.value;
      this.variantRows[rowIndex].variant_value_id = null;

      // Clear errors
      delete this.errors[`variant_${rowIndex}`];
      delete this.errors[`value_${rowIndex}`];

      if (variantId) {
        await this.loadVariantValues(variantId);
      }
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

    async loadVariants() {
      this.loadingVariants = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/variants/list/${this.company_id}?final_product_id=${this.final_product_id}`;
        console.log("🌐 Loading variants from:", url);

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        console.log("✅ Variants loaded:", response.data.data?.length || 0);
        this.variants = response.data.data || [];
      } catch (error) {
        console.error("❌ Error loading variants:", error);
        this.showError("Failed to load variants");
      } finally {
        this.loadingVariants = false;
      }
    },

    async loadVariantValues(variantId) {
      if (!variantId) return;

      this.loadingVariantValues = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/variant-values/search/${variantId}`;
        console.log("🌐 Loading variant values from:", url);

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        const variantValuesData = response.data.data || [];
        this.variantValues = {
          ...this.variantValues,
          [variantId]: variantValuesData,
        };

        console.log("✅ Variant values loaded:", variantValuesData.length);
        this.$forceUpdate();
      } catch (error) {
        console.error("❌ Error loading variant values:", error);
        this.variantValues = {
          ...this.variantValues,
          [variantId]: [],
        };
      } finally {
        this.loadingVariantValues = false;
      }
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      // Filter out empty rows and validate filled ones
      const validRows = this.variantRows.filter(
        (row) => row.variant_id && row.variant_value_id
      );

      if (validRows.length === 0) {
        this.showError("Please add at least one valid variant");
        return false;
      }

      // Validate each row
      this.variantRows.forEach((row, index) => {
        if (row.variant_id && !row.variant_value_id) {
          this.errors[`value_${index}`] = "Variant value is required";
          isValid = false;
        }
      });

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const payload = {
          final_product_id: this.final_product_id,
          variants: this.variantRows
            .filter((row) => row.variant_id && row.variant_value_id)
            .map((row) => ({
              variant_id: row.variant_id,
              variant_value_id: row.variant_value_id,
            })),
        };

        console.log("📤 Submitting variants:", payload);

        const url = `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Variants added successfully:", response.data.data);

        this.$emit("variants-added", response.data.data);
        this.closeModal();

        this.showSuccess(this.$t("final_product_variants.variantsAdded"));
      } catch (error) {
        console.error("❌ Error adding variants:", error);
        this.showError(
          error.response?.data?.message || "Failed to add variants"
        );
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.variantRows = [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ];
      this.variantValues = {};
      this.errors = {};
    },

    showError(message) {
      this.$toast.add({
        severity: "error",
        summary: this.$t("common.error"),
        detail: message,
        life: 3000,
      });
    },

    showSuccess(message) {
      this.$toast.add({
        severity: "success",
        summary: this.$t("common.success"),
        detail: message,
        life: 3000,
      });
    },
  },
};
</script>

<style scoped>
.variant-rows {
  max-height: 400px;
  overflow-y: auto;
}

.variant-row {
  background: var(--surface-ground);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

:deep(.p-dialog-content) {
  position: relative;
}
</style>
