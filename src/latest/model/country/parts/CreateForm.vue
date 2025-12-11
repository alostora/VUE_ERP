<template>
  <Dialog
    :header="$t('countries.createCountry')"
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
            {{ $t("countries.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('countries.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("countries.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('countries.name_arPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="field mb-3">
          <label for="phone_code" class="font-bold block mb-2">
            {{ $t("countries.phone_code") }} *
          </label>
          <InputText
            id="phone_code"
            v-model="formData.phone_code"
            :class="{ 'p-invalid': errors.phone_code }"
            class="w-full"
            :placeholder="$t('countries.phone_codePlaceholder')"
          />
          <small v-if="errors.phone_code" class="p-error">{{
            errors.phone_code
          }}</small>
        </div>

        <div class="field mb-3">
          <label for="prefix" class="font-bold block mb-2">
            {{ $t("countries.prefix") }}
          </label>
          <InputText
            id="prefix"
            v-model="formData.prefix"
            :class="{ 'p-invalid': errors.prefix }"
            class="w-full"
            :placeholder="$t('countries.prefixPlaceholder')"
          />
          <small v-if="errors.prefix" class="p-error">{{
            errors.prefix
          }}</small>
        </div>

        <div class="field mb-4">
          <label for="flag" class="font-bold block mb-2">
            {{ $t("countries.flag") }}
          </label>
          <InputText
            id="flag"
            v-model="formData.flag"
            class="w-full"
            :placeholder="$t('countries.flagPlaceholder')"
          />
          <small class="p-text-secondary">{{ $t("countries.flagHelp") }}</small>
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
      <p class="mt-2">{{ $t("countries.creatingCountry") }}</p>
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
import general_request from "@/utils/general_request";

export default {
  name: "CreateForm",
  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      visible: false,
      loading: false,
      error: "",
      formData: {
        name: "",
        name_ar: "",
        phone_code: "",
        prefix: "",
        flag: "",
      },
      errors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("validation.name_arRequired");
      }

      if (!this.formData.phone_code?.trim()) {
        this.errors.phone_code = this.$t("validation.phone_codeRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = `${general_request.BASE_URL}/admin/country`;
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
