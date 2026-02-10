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
        <div class="field">
          <label class="font-bold block mb-2"
            >{{ $t("discounts.selectBranches") }} *</label
          >
          <MultiSelect
            v-model="selectedBranches"
            :options="availableBranches"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.branch_ids }"
            :placeholder="
              loadingBranches
                ? $t('discounts.loadingBranches')
                : $t('discounts.branchesPlaceholder')
            "
            class="w-full"
            :loading="loadingBranches"
            :disabled="loadingBranches || availableBranches.length === 0"
            display="chip"
            :maxSelectedLabels="3"
            :filter="true"
          />
          <small class="p-error" v-if="errors.branch_ids">{{
            errors.branch_ids
          }}</small>
        </div>

        <div
          v-if="selectedBranches.length > 0"
          class="selected-branches-preview mt-3"
        >
          <label class="font-medium block mb-2"
            >{{ $t("discounts.selectedProducts") }}:</label
          >
          <div class="selected-chips">
            <Chip
              v-for="b in getSelectedBranchesDetails()"
              :key="b.id"
              :label="b.name"
              class="mr-2 mb-2"
            >
              <span class="ml-2 text-xs text-color-secondary"
                >({{ b.name_ar }})</span
              >
            </Chip>
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
            :disabled="!canSubmit"
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
import useSelectionItems from "@/utils/useSelectionItems";

export default {
  name: "CreateForm",

  mixins: [useTable(), useCrud(), validationRequest, useSelectionItems],

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
      propMainUrl: moduleUrl.URLS.DISCOUNT_BRANCH.propMainUrl,
      company_id: "",
      discount_id: "",
      selectedBranches: [],
      formData: {
        company_id: "",
        discount_id: "",
      },
    };
  },

  computed: {
    canSubmit() {
      return this.selectedBranches.length > 0;
    },
  },

  mounted() {
    this.loadAvailableBranches(this.company_id);
  },

  methods: {
    populateForm(selectedItem) {
      this.formData = {
        company_id: selectedItem.company_id || "",
        discount_id: selectedItem.id || "",
      };
      this.company_id = selectedItem.company_id || "";
      this.discount_id = selectedItem.id || "";
    },

    getSelectedBranchesDetails() {
      return this.selectedBranches.map(
        (id) =>
          this.availableBranches.find((b) => b.id === id) || {
            id,
            name: this.$t("discounts.branchName"),
            name_ar: this.$t("discounts.branchName"),
          },
      );
    },

    async submitForm() {
      if (!this.validateCreateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      const url = this.propMainUrl;

      const payload = {
        company_id: this.company_id,
        discount_id: this.discount_id,
        branch_ids: this.selectedBranches,
      };

      await this.createItem(payload, url);

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
