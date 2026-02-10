<template>
  <Dialog
    :header="this.$t('discount.edit')"
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
            :label="$t('common.update')"
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
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Calendar from "primevue/calendar";
import Chip from "primevue/chip";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";
import useSelectionItems from "@/utils/useSelectionItems";

export default {
  name: "UpdateForm",

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
    Calendar,
    Chip,
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

    selectedType: {
      handler(newValue) {
        this.formData.type_id = newValue;
      },
    },
  },

  mounted() {
    this.loadDiscountTypes();
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.DISCOUNT.propMainUrl,
      selectedType: null,
      formData: {
        id: "",
        name: "",
        name_ar: "",
        type_id: null,
        value: null,
        date_from: null,
        date_to: null,
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

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        name_ar: selectedItem.name_ar || "",
        type_id: selectedItem.type?.id || "",
        value: selectedItem.value || null,
        date_from: selectedItem.date_from
          ? new Date(selectedItem.date_from)
          : null,
        date_to: selectedItem.date_to ? new Date(selectedItem.date_to) : null,
        details: selectedItem.details || "",
        details_ar: selectedItem.details_ar || "",
      };

      this.selectedType = selectedItem.type?.id || null;
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
