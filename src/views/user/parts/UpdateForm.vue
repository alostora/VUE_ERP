<template>
  <Dialog
    :header="this.$t('countries.editCountry')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div class="form">
      <Message v-if="error" severity="error" class="mb-3">
        {{ error }}
      </Message>

      <form @submit.prevent="submitForm">
        <div class="field mb-3">
          <label for="accountType" class="font-bold block mb-2">
            {{ $t("users.accountType") }} *
          </label>
          <Select
            id="accountType"
            v-model="selectedAccountType"
            @update:modelValue="onAccountTypeChange"
            :options="accountTypes"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.user_account_type_id }"
            :placeholder="$t('users.selectAccountType')"
            class="w-full"
          />
          <small v-if="errors.user_account_type_id" class="p-error">
            {{ errors.user_account_type_id }}
          </small>
        </div>

        <div class="field mb-3">
          <label for="name" class="font-bold block mb-2">
            {{ $t("users.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label for="email" class="font-bold block mb-2">
            {{ $t("users.email") }} *
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="field mb-3">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("users.phone") }}
          </label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <div class="field mb-3">
          <label for="password" class="font-bold block mb-2">
            {{ $t("users.password") }}
          </label>
          <Password
            id="password"
            v-model="formData.password"
            :feedback="false"
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
            :placeholder="$t('users.passwordPlaceholder')"
          />
          <small v-if="errors.password" class="p-error">{{
            errors.password
          }}</small>
        </div>

        <div class="field mb-4">
          <label for="address" class="font-bold block mb-2">
            {{ $t("users.address") }}
          </label>
          <Textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="w-full"
          />
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
import Select from "primevue/select";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import useSelectionItems from "@/utils/useSelectionItems";
import validationRequest from "../validation/validationRequest";

export default {
  name: "UpdateForm",
  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
    Select,
  },

  mixins: [useTable(), useCrud(), validationRequest, useSelectionItems],

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
      propMainUrl: moduleUrl.URLS.USER.propMainUrl,
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      },
    };
  },

  mounted() {
    this.loadAccountTypes();
  },

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        email: selectedItem.email || "",
        phone: selectedItem.phone || "",
        password: "", // Never pre-fill password
        address: selectedItem.address || "",
        user_account_type_id: selectedItem.account_type?.id || "",
      };

      this.selectedAccountType = selectedItem.account_type?.id || null;
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

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
