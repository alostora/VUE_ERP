<template>
  <Dialog
    :header="$t('variantValues.create')"
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
          <label for="value" class="font-bold block mb-2">
            {{ $t("variantValues.value") }} *
          </label>
          <InputText
            id="value"
            v-model="formData.value"
            :class="{ 'p-invalid': errors.value }"
            class="w-full"
            :placeholder="$t('variantValues.valuePlaceholder')"
          />
          <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
        </div>

        <div class="field mb-3">
          <label for="value_ar" class="font-bold block mb-2">
            {{ $t("variantValues.value_ar") }} *
          </label>
          <InputText
            id="value_ar"
            v-model="formData.value_ar"
            :class="{ 'p-invalid': errors.value_ar }"
            class="w-full"
            :placeholder="$t('variantValues.value_arPlaceholder')"
          />
          <small v-if="errors.value_ar" class="p-error">{{
            errors.value_ar
          }}</small>
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

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import validationRequest from "../validation/validationRequest";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), validationRequest],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
    variant_id: {
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
        }
      },
    },
    "$route.params.variant_id": {
      immediate: true,
      deep: true,
      handler(variant_id) {
        if (variant_id) {
          this.formData.variant_id = variant_id;
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.VARIANT_VALUE.propMainUrl,
      formData: {
        company_id: "",
        variant_id: "",
        value: "",
        value_ar: "",
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
