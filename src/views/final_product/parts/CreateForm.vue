<template>
  <Dialog
    :header="$t('final_products.add')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="form">
      <Message v-if="error" severity="error" class="mb-3">
        {{ error }}
      </Message>

      <form @submit.prevent="submitForm">
        <!-- Basic Information -->
        <div class="grid">
          <!-- Category -->
          <div class="col-12 md:col-6 field">
            <label :id="'category_label'" class="font-bold block mb-2">
              {{ $t("final_product.category") }} *
            </label>
            <Select
              :aria-labelledby="'category_label'"
              v-model="selectedCategory"
              @update:modelValue="onCategoryChange"
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
            />
            <small v-if="errors.category_id" class="p-error">
              {{ errors.category_id }}
            </small>
          </div>

          <!-- Product -->
          <div class="col-12 md:col-6 field">
            <label :id="'product_label'" class="font-bold block mb-2">
              {{ $t("final_product.product") }} *
            </label>
            <Select
              :aria-labelledby="'product_label'"
              v-model="selectedProduct"
              @update:modelValue="onProductChange"
              :options="products"
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
            <h3 class="font-bold m-0">
              {{ $t("final_product.variants") }}
            </h3>
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
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="$t('common.cancel')"
            @click="closeModal"
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

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("common.creating") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import Textarea from "primevue/textarea";
import Select from "primevue/select";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import { useFileCrud } from "@/utils/useFileCrud";
import validationRequest from "../validation/validationRequest";
import useSelectionItems from "@/utils/useSelectionItems";
import moduleUrl from "@/constants/moduleUrl";
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "CreateForm",

  mixins: [
    useTable(),
    useCrud(),
    useFileCrud(),
    validationRequest,
    useSelectionItems,
    customFunctions,
  ],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
    Textarea,
    Select,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      deep: true,
      handler(company_id) {
        if (company_id) {
          this.formData.company_id = company_id;
          this.loadCategories(company_id);
          this.loadVariants(company_id);
        }
      },
    },
    selectedCategory: {
      handler(category_id) {
        if (category_id) {
          const company_id = this.company_id || this.$route.params.company_id;
          this.loadProducts(company_id, category_id);
        } else {
          this.products = [];
          this.variantRows = [{ variant_id: null, variant_value_id: null }];
          this.selectedProduct = null;
          this.formData.product_id = "";
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.FINAL_PRODUCT.propMainUrl,
      selectedCategory: null,
      selectedproduct: null,
      variants: [],
      variantValues: {},
      formData: {
        company_id: "",
        category_id: "",
        product_id: "",
        price: 0,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
        variants: [],
      },
    };
  },
  methods: {
    async submitForm() {
      if (!this.validateCreateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = this.propMainUrl;

      await this.createItem(this.formData, url);

      this.closeModal();
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
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
</style>
