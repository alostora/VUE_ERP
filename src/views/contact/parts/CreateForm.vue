<template>
  <Dialog
    :header="$t('contacts.create')"
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
        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label class="font-bold block mb-2"
              >{{ $t("contacts.name") }} *</label
            >
            <InputText
              v-model="formData.name"
              :class="{ 'p-invalid': errors.name }"
              class="w-full"
              :placeholder="$t('contacts.namePlaceholder')"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="col-12 md:col-6 field">
            <label class="font-bold block mb-2">{{
              $t("contacts.email")
            }}</label>
            <InputText
              v-model="formData.email"
              :class="{ 'p-invalid': errors.email }"
              class="w-full"
              :placeholder="$t('contacts.emailPlaceholder')"
            />
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label class="font-bold block mb-2">{{
              $t("contacts.phone")
            }}</label>
            <InputText
              v-model="formData.phone"
              :class="{ 'p-invalid': errors.phone }"
              class="w-full"
              :placeholder="$t('contacts.phonePlaceholder')"
            />
            <small v-if="errors.phone" class="p-error">{{
              errors.phone
            }}</small>
          </div>

          <div class="col-12 md:col-6 field">
            <label class="font-bold block mb-2">{{
              $t("contacts.address")
            }}</label>
            <InputText
              v-model="formData.address"
              :class="{ 'p-invalid': errors.address }"
              class="w-full"
              :placeholder="$t('contacts.addressPlaceholder')"
            />
            <small v-if="errors.address" class="p-error">{{
              errors.address
            }}</small>
          </div>
        </div>

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
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.CONTACT.propMainUrl,
      formData: {
        company_id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
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
