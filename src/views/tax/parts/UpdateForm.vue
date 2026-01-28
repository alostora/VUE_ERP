<template>
  <Dialog
    :header="this.$t('measurementUnits.edit')"
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
              {{ $t("taxes.name") }} *
            </label>
            <InputText
              id="name"
              v-model="formData.name"
              :class="{ 'p-invalid': errors.name }"
              class="w-full"
              :placeholder="$t('taxes.namePlaceholder')"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <!-- Arabic Name -->
          <div class="col-12 md:col-6 field">
            <label for="name_ar" class="font-bold block mb-2">
              {{ $t("taxes.name_ar") }} *
            </label>
            <InputText
              id="name_ar"
              v-model="formData.name_ar"
              :class="{ 'p-invalid': errors.name_ar }"
              class="w-full"
              :placeholder="$t('taxes.nameArPlaceholder')"
            />
            <small v-if="errors.name_ar" class="p-error">{{
              errors.name_ar
            }}</small>
          </div>
        </div>

        <!-- Value -->
        <div class="field mb-3">
          <label for="value" class="font-bold block mb-2">
            {{ $t("taxes.value") }} *
          </label>
          <InputNumber
            id="value"
            v-model="formData.value"
            :class="{ 'p-invalid': errors.value }"
            class="w-full"
            mode="decimal"
            :min="0"
            :max="100"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :placeholder="$t('taxes.valuePlaceholder')"
          />
          <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
          <small class="p-text-secondary">
            {{ $t("taxes.valueHelp") }}
          </small>
        </div>

        <!-- Details -->
        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label for="details" class="font-bold block mb-2">
              {{ $t("taxes.details") }}
            </label>
            <Textarea
              id="details"
              v-model="formData.details"
              rows="3"
              class="w-full"
              :placeholder="$t('taxes.detailsPlaceholder')"
            />
          </div>

          <div class="col-12 md:col-6 field">
            <label for="details_ar" class="font-bold block mb-2">
              {{ $t("taxes.details_ar") }}
            </label>
            <Textarea
              id="details_ar"
              v-model="formData.details_ar"
              rows="3"
              class="w-full"
              :placeholder="$t('taxes.detailsArPlaceholder')"
            />
          </div>
        </div>

        <!-- Is Active -->
        <div class="field mb-4">
          <div class="flex align-items-center">
            <Checkbox
              id="is_active"
              v-model="formData.is_active"
              :binary="true"
              class="mr-2"
            />
            <label for="is_active" class="font-medium">
              {{ $t("taxes.isActiveLabel") }}
            </label>
          </div>
          <small class="p-text-secondary">
            {{ $t("taxes.activeStatusHelp") }}
          </small>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-content-end gap-2 mt-4">
          <Button
            type="button"
            :label="$t('common.cancel')"
            @click="closeModal"
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

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";

export default {
  name: "UpdateForm",

  mixins: [useTable(), useCrud(), validationRequest],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
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
      propMainUrl: moduleUrl.URLS.TAX.propMainUrl,
      formData: {
        id: "",
        name: "",
        name_ar: "",
        value: null,
        is_active: true,
        details: "",
        details_ar: "",
      },
    };
  },

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        name_ar: selectedItem.name_ar || "",
        value: selectedItem.value || "",
        is_active: selectedItem.is_active || false,
        details: selectedItem.details || "",
        details_ar: selectedItem.details_ar || "",
      };
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
