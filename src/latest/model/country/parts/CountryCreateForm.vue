<template>
  <div class="country-create-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
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

      <!-- Name Arabic Field -->
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

      <!-- Phone Code Field -->
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

      <!-- Prefix Field -->
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
        <small v-if="errors.prefix" class="p-error">{{ errors.prefix }}</small>
      </div>

      <!-- Flag Field -->
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

      <!-- Action Buttons -->
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
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";

// Import composables
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";

// Import utilities
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CountryCreateForm",
  components: {
    InputText,
    Button,
    Message,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
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
    },
  },
};
</script>

<style scoped>
.country-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>
