<template>
  <Dialog
    :header="$t('variantValues.create')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="multiple-values-form mb-4">
      <div class="flex justify-content-between align-items-center mb-3">
        <h5 class="m-0">{{ $t("variants.addVariantValues") }}</h5>
        <Button
          :label="$t('variants.addNewValue')"
          icon="pi pi-plus"
          @click="addValue"
          class="p-button-outlined p-button-sm"
        />
      </div>

      <div class="form">
        <Message v-if="error" severity="error" class="mb-3">
          {{ error }}
        </Message>
        <form @submit.prevent="submitForm">
          <div
            v-for="(value, index) in formData.values"
            :key="index"
            class="value-item grid mb-2"
          >
            <div class="col-12 md:col-5">
              <div class="field mb-3">
                <label for="value" class="font-bold block mb-2">
                  {{ $t("variantValues.value") }} *
                </label>
                <InputText
                  id="value"
                  v-model="value.value"
                  :class="{ 'p-invalid': errors.value }"
                  class="w-full"
                  :placeholder="$t('variantValues.valuePlaceholder')"
                />
                <small v-if="errors.value" class="p-error">{{
                  errors.value
                }}</small>
              </div>
            </div>

            <div class="col-12 md:col-5">
              <div class="field mb-3">
                <label for="value_ar" class="font-bold block mb-2">
                  {{ $t("variantValues.valueAr") }} *
                </label>
                <InputText
                  id="value_ar"
                  v-model="value.value_ar"
                  :class="{ 'p-invalid': errors.value_ar }"
                  class="w-full"
                  :placeholder="$t('variantValues.valueArPlaceholder')"
                />
                <small v-if="errors.value_ar" class="p-error">{{
                  errors.value_ar
                }}</small>
              </div>
            </div>

            <div class="col-12 md:col-2">
              <Button
                v-if="formData.values.length > 1"
                icon="pi pi-times"
                @click="removeValue(index)"
                class="p-button-text p-button-danger w-full"
                v-tooltip="$t('variants.removeValue')"
              />
            </div>
          </div>

          <div class="flex justify-content-end gap-2 mt-3">
            <Button
              type="button"
              :label="$t('common.cancel')"
              @click="showMultipleValuesForm = false"
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
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), validationRequest, customFunctions],

  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: Number,
      default: null,
    },
    variant_id: {
      type: Number,
      default: null,
    },
  },

  watch: {
    company_id: {
      immediate: true,
      deep: true,
      handler(company_id) {
        if (company_id) {
          this.formData.company_id = company_id;
        }
      },
    },
    variant_id: {
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
      propMainUrl: moduleUrl.URLS.VARIANT_VALUE.propCreateMultiUrl,
      formData: {
        company_id: "",
        variant_id: "",
        values: [{ value: "", value_ar: "" }],
      },
    };
  },
  methods: {
    async submitForm() {
      if (!this.validateMultipleForm()) {
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
