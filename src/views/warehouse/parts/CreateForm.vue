<template>
  <Dialog
    :header="$t('warehouse.createWarehouse')"
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
            {{ $t("warehouse.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('warehouse.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label for="name" class="font-bold block mb-2">
            {{ $t("warehouse.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('warehouse.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="field mb-4">
          <label for="details" class="font-bold block mb-2">
            {{ $t("warehouse.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('warehouse.detailsPlaceholder')"
          />
        </div>

        <div class="field mb-4">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("warehouse.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('warehouse.detailsArPlaceholder')"
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
import Select from "primevue/select";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
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

  props: {
    company_id: {
      type: String,
      default: null,
    },
    branch_id: {
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
    "$route.params.branch_id": {
      immediate: true,
      deep: true,
      handler(branch_id) {
        if (branch_id) {
          this.formData.branch_id = branch_id;
        }
      },
    },
  },

  mixins: [useTable(), useCrud(), validationRequest],

  data() {
    return {
      propMainUrl: moduleUrl.URLS.WAREHOUSE.propMainUrl,
      formData: {
        company_id: "",
        branch_id: "",
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
    };
  },

  mounted() {},
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
