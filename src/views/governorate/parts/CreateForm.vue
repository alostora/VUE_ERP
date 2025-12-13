<template>
  <Dialog
    :header="$t('governorates.createGovernorate')"
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
        <!-- Country Selection (Required) -->
        <div class="field mb-3">
          <label for="country" class="font-bold block mb-2">
            {{ $t("governorates.country") }} *
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            @update:modelValue="onCountryChange"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.country_id }"
            :placeholder="
              loadingItems
                ? $t('governorates.loadingCountries')
                : $t('governorates.selectCountry')
            "
            class="w-full"
            :loading="loadingItems"
            :disabled="loadingItems"
            :showClear="false"
          />
          <small v-if="errors.country_id" class="p-error">
            {{ errors.country_id }}
          </small>
        </div>

        <!-- Name Field -->
        <div class="field mb-3">
          <label for="name" class="font-bold block mb-2">
            {{ $t("governorates.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('governorates.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name Field -->
        <div class="field mb-3">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("governorates.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('governorates.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <!-- Prefix Field -->
        <div class="field mb-4">
          <label for="prefix" class="font-bold block mb-2">
            {{ $t("governorates.prefix") }}
          </label>
          <InputText
            id="prefix"
            v-model="formData.prefix"
            :class="{ 'p-invalid': errors.prefix }"
            class="w-full"
            :placeholder="$t('governorates.prefixPlaceholder')"
          />
          <small v-if="errors.prefix" class="p-error">{{
            errors.prefix
          }}</small>
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
      <p class="mt-2">{{ $t('common.creating') }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import Select from "primevue/select";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import useSelectionItems from "@/utils/useSelectionItems";
import validationRequest from "../validation/validationRequest";

export default {
  name: "CreateForm",
  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
    Select,
  },

  mixins: [useTable(), useCrud(), validationRequest, useSelectionItems],

  data() {
    return {
      propMainUrl: moduleUrl.URLS.GOVERNORATE.propMainUrl,
      selectedCountry: null,
      formData: {
        country_id: "",
        name: "",
        name_ar: "",
        prefix: "",
      },
    };
  },

  mounted() {
    this.loadCountries();
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
    onCountryChange(value) {
      this.selectedCountry = value;
      this.formData.country_id = value;
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
