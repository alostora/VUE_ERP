<template>
  <Dialog
    :header="$t('discounts.create')"
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
              @update:modelValue="onDiscountTypeChange"
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
            <small v-if="errors.value" class="p-error">{{
              errors.value
            }}</small>
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
            :options="final_products"
            option-label="name"
            option-value="id"
            class="w-full"
            :placeholder="
              loadingFinalProducts
                ? $t('discounts.loadingFinalProducts')
                : $t('discounts.productsPlaceholder')
            "
            :loading="loadingFinalProducts"
            :disabled="loadingFinalProducts"
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
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";
import useSelectionItems from "@/utils/useSelectionItems";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), validationRequest, useSelectionItems],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
    Textarea,
    InputNumber,
    Select,
    MultiSelect,
    Calendar,
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
          this.company_id = company_id;
        }
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

  data() {
    return {
      propMainUrl: moduleUrl.URLS.DISCOUNT.propMainUrl,
      propListhUrl: moduleUrl.URLS.DISCOUNT.propListhUrl,
      company_id: null,
      loadingFinalProducts: false,
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
    };
  },
  computed: {
    minDate() {
      return new Date();
    },
  },
  mounted() {
    this.loadDiscountTypes();
    this.loadBranches(this.company_id);
    this.loadFinalProducts(this.company_id);
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
    formatDate(date) {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
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

:deep(.p-fileupload) {
  width: 100%;
}

:deep(.p-fileupload-choose) {
  width: 100%;
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
