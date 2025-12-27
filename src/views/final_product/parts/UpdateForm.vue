<template>
  <Dialog
    :header="this.$t('final_products.edit')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div class="form">
      <Message v-if="error" severity="error" class="mb-3">
        {{ error }}
      </Message>

      <form @submit.prevent="submitForm">
        <!-- Basic Information (Read-only) -->

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
          v-if="selectedFinalProductVariantValues?.length"
        >
          <label class="font-bold block mb-2">
            {{ $t("final_product.currentVariants") }}
          </label>
          <div class="current-variants p-3 border-round border surface-border">
            <div
              v-for="variantValue in selectedFinalProductVariantValues"
              :key="variantValue.id"
              class="variant-chip mb-2"
            >
              <Chip
                :label="`${variantValue.variant?.name}: ${variantValue.variant_value.value}`"
                class="mr-2"
              />
              <small class="text-color-secondary">
                (Arabic: {{ variantValue.variant?.name_ar }}:
                {{ variantValue.variant_value.value_ar }})
              </small>
            </div>
          </div>
          <small class="p-text-secondary">
            {{ $t("final_product.cannotChangeVariants") }}
          </small>
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
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";
import useSelectionItems from "@/utils/useSelectionItems";

export default {
  name: "UpdateForm",

  mixins: [
    useTable(),
    useCrud(),
    useFileCrud(),
    validationRequest,
    useSelectionItems,
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
    selected_item: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    selected_item: {
      immediate: true,
      deep: true,
      handler(selectedItem) {
        if (selectedItem && selectedItem.id) {
          this.populateForm(selectedItem);
        } else {
          this.resetForm();
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.FINAL_PRODUCT.propMainUrl,
      formData: {
        id: "",
        price: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
    };
  },

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        id: selectedItem.id || "",
        price: selectedItem.price || "",
        name: selectedItem.name || "",
        name_ar: selectedItem.name_ar || "",
        details: selectedItem.details || "",
        details_ar: selectedItem.details_ar || "",
      };
      this.selectedCategory = selectedItem.category || null;
      this.selectedProduct = selectedItem.product || null;
      this.selectedFinalProductVariantValues =
        selectedItem.final_product_variant_values || [];
    },

    async submitForm() {
      if (!this.validateUpdateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = this.propMainUrl;
      await this.updateItem(this.formData.id, this.formData, url);

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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
