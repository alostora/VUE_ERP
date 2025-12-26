<template>
  <Dialog
    :header="$t('products.add')"
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
        <div class="field mb-3">
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

        <div class="field mb-3">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("products.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('products.name_arPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="field mb-3">
          <label for="category" class="font-bold block mb-2">
            {{ $t("products.category") }} *
          </label>
          <Select
            id="category"
            v-model="selectedCategory"
            @update:modelValue="onCategoryChange"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.category_id }"
            :placeholder="
              loadingCategories
                ? $t('products.loadingCategories')
                : $t('products.selectCategory')
            "
            class="w-full"
            :loading="loadingCategories"
            :disabled="loadingCategories"
            filter
          />
          <small v-if="errors.category_id" class="p-error">
            {{ errors.category_id }}
          </small>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label for="purchasesUnit" class="font-bold block mb-2">
              {{ $t("products.purchasesUnit") }} *
            </label>
            <Select
              id="purchasesUnit"
              v-model="selectedPurchasesUnit"
              @update:modelValue="onPurchasesUnitChange"
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
              @update:modelValue="onSalesUnitChange"
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

export default {
  name: "CreateForm",

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
          this.loadMeasurementUnits(company_id);
          this.loadCategories(company_id);
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.PRODUCT.propMainUrl,
      selectedCategory: null,
      selectedPurchasesUnit: null,
      selectedSalesUnit: null,
      formData: {
        company_id: "",
        category_id: "",
        purchases_measurement_unit_id: "",
        sales_measurement_unit_id: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
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

    onPurchasesUnitChange(value) {
      this.selectedPurchasesUnit = value;
      this.formData.purchases_measurement_unit_id = value;
    },

    onSalesUnitChange(value) {
      this.selectedSalesUnit = value;
      this.formData.sales_measurement_unit_id = value;
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
