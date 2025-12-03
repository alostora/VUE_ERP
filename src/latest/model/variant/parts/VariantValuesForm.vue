<template>
  <div class="variant-values-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <!-- Variant Info -->
    <div v-if="variant" class="variant-info mb-4 p-3 border-round bg-surface-ground">
      <h4 class="m-0 mb-2">{{ $t('variants.variant') }}: {{ variant.name }}</h4>
      <p class="m-0 text-color-secondary">{{ variant.name_ar }}</p>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('variants.addVariantValues')"
        icon="pi pi-plus-circle"
        @click="showMultipleValuesForm = true"
        class="p-button-outlined p-button-sm"
      />
    </div>

    <!-- Single Value Form -->
    <div v-if="!showMultipleValuesForm" class="single-value-form mb-4">
      <h5 class="mb-3">{{ $t('variants.addVariantValue') }}</h5>
      <form @submit.prevent="submitSingleValue" class="grid">
        <div class="col-12 md:col-5 field">
          <InputText
            v-model="singleFormData.value"
            :class="{ 'p-invalid': errors.value }"
            class="w-full"
            :placeholder="$t('variants.valuePlaceholder')"
          />
          <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
        </div>
        <div class="col-12 md:col-5 field">
          <InputText
            v-model="singleFormData.value_ar"
            :class="{ 'p-invalid': errors.value_ar }"
            class="w-full"
            :placeholder="$t('variants.valueArPlaceholder')"
          />
          <small v-if="errors.value_ar" class="p-error">{{ errors.value_ar }}</small>
        </div>
        <div class="col-12 md:col-2">
          <Button
            type="submit"
            :label="$t('common.add')"
            :loading="loading"
            class="p-button-primary w-full"
          />
        </div>
      </form>
    </div>

    <!-- Multiple Values Form -->
    <div v-else class="multiple-values-form mb-4">
      <div class="flex justify-content-between align-items-center mb-3">
        <h5 class="m-0">{{ $t('variants.addVariantValues') }}</h5>
        <Button
          :label="$t('variants.addNewValue')"
          icon="pi pi-plus"
          @click="addValue"
          class="p-button-outlined p-button-sm"
        />
      </div>

      <form @submit.prevent="submitMultipleValues">
        <div
          v-for="(value, index) in multipleFormData.values"
          :key="index"
          class="value-item grid mb-2"
        >
          <div class="col-12 md:col-5">
            <InputText
              v-model="value.value"
              :class="{ 'p-invalid': hasValueError(index, 'value') }"
              class="w-full"
              :placeholder="$t('variants.valuePlaceholder')"
            />
            <small v-if="hasValueError(index, 'value')" class="p-error">
              {{ getValueError(index, 'value') }}
            </small>
          </div>
          <div class="col-12 md:col-5">
            <InputText
              v-model="value.value_ar"
              :class="{ 'p-invalid': hasValueError(index, 'value_ar') }"
              class="w-full"
              :placeholder="$t('variants.valueArPlaceholder')"
            />
            <small v-if="hasValueError(index, 'value_ar')" class="p-error">
              {{ getValueError(index, 'value_ar') }}
            </small>
          </div>
          <div class="col-12 md:col-2">
            <Button
              v-if="multipleFormData.values.length > 1"
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

    <!-- Values Table -->
    <div class="values-table-section">
      <div class="flex gap-2 mb-4">
        <div class="search-container">
          <InputText
            v-model="query_string"
            :placeholder="$t('variants.searchValues')"
            @input="handleSearchInput"
            class="search-input w-20rem"
          />
          <i class="pi pi-search search-icon" />
        </div>

        <Select
          v-model="per_page"
          :options="perPageOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('variants.show')"
          @change="getData"
          class="w-10rem"
        />
      </div>

      <DataTable
        :value="tableItems"
        :paginator="true"
        :rows="per_page"
        :totalRecords="meta.total"
        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
        :loading="loading"
        
      :lazy="true"
      resizableColumns
      columnResizeMode="fit"
      showGridlines
      tableStyle="min-width: 50rem"
        class="p-datatable-sm table-scroll-container"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        @page="handlePageChange"
      >
        <Column
          field="id"
          :header="$t('variants.id')"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column
          field="value"
          :header="$t('variants.value')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.value }}</span>
          </template>
        </Column>

        <Column
          field="value_ar"
          :header="$t('variants.value_ar')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.value_ar }}</span>
          </template>
        </Column>

        <Column
          field="created_at"
          :header="$t('variants.createdAt')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          :header="$t('variants.actions')"
          :exportable="false"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editValueModal(slotProps.data)"
                v-tooltip.top="$t('variants.editVariantValue')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteValue(slotProps.data)"
                v-tooltip.top="$t('variants.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Edit Value Modal -->
    <Dialog
      v-model:visible="showEditModal"
      :header="$t('variants.editVariantValue')"
      :modal="true"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="edit-value-form">
        <form @submit.prevent="submitEditValue">
          <div class="grid">
            <div class="col-12 md:col-6 field">
              <label class="font-bold block mb-2">{{ $t('variants.value') }} *</label>
              <InputText
                v-model="editFormData.value"
                :class="{ 'p-invalid': editErrors.value }"
                class="w-full"
              />
              <small v-if="editErrors.value" class="p-error">{{ editErrors.value }}</small>
            </div>
            <div class="col-12 md:col-6 field">
              <label class="font-bold block mb-2">{{ $t('variants.value_ar') }} *</label>
              <InputText
                v-model="editFormData.value_ar"
                :class="{ 'p-invalid': editErrors.value_ar }"
                class="w-full"
              />
              <small v-if="editErrors.value_ar" class="p-error">{{ editErrors.value_ar }}</small>
            </div>
          </div>
          <div class="flex justify-content-end gap-2 mt-3">
            <Button
              type="button"
              :label="$t('common.cancel')"
              @click="showEditModal = false"
              class="p-button-text"
            />
            <Button
              type="submit"
              :label="$t('common.update')"
              :loading="editLoading"
              class="p-button-primary"
            />
          </div>
        </form>
      </div>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Message from "primevue/message";
import Tooltip from "primevue/tooltip";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "VariantValuesForm",

  components: {
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Dialog,
    Toast,
    ConfirmDialog,
    Message,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    variant: {
      type: Object,
      required: true,
    },
    company_id: {
      type: String,
      default: null,
    },
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      showMultipleValuesForm: false,
      showEditModal: false,
      editLoading: false,
      singleFormData: {
        value: "",
        value_ar: "",
      },
      multipleFormData: {
        values: [
          { value: "", value_ar: "" }
        ]
      },
      editFormData: {
        id: "",
        value: "",
        value_ar: "",
      },
      errors: {},
      editErrors: {},
      valueErrors: [],
    };
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },

    propSearchUrl() {
      if (!this.variant?.id) return "";
      return `${general_request.BASE_URL}/admin/company/variant-values/search/${this.variant.id}?paginate=true`;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/variant-value`;
    },
  },

  watch: {
    variant: {
      immediate: true,
      handler(newVariant) {
        if (newVariant?.id) {
          this.getData();
        }
      },
    },
  },

  mounted() {
    if (this.variant?.id) {
      this.getData();
    }
  },

  methods: {
    // Single Value Methods
    validateSingleForm() {
      this.errors = {};

      if (!this.singleFormData.value?.trim()) {
        this.errors.value = this.$t("variants.valueRequired");
      }

      if (!this.singleFormData.value_ar?.trim()) {
        this.errors.value_ar = this.$t("variants.valueArRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitSingleValue() {
      if (!this.validateSingleForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/variant-value`;

        const payload = {
          company_id: this.effectiveCompanyId,
          variant_id: this.variant.id,
          value: this.singleFormData.value,
          value_ar: this.singleFormData.value_ar,
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetSingleForm();
        this.handleItemCreated(response.data.data);
        this.$emit("variant-values-updated");

        this.showToast(
          "success",
          this.$t("variants.success"),
          this.$t("variants.variantValueCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    // Multiple Values Methods
    addValue() {
      this.multipleFormData.values.push({ value: "", value_ar: "" });
    },

    removeValue(index) {
      this.multipleFormData.values.splice(index, 1);
    },

    validateMultipleForm() {
      this.valueErrors = [];
      let isValid = true;

      if (this.multipleFormData.values.length === 0) {
        this.error = this.$t("variants.atLeastOneValue");
        return false;
      }

      this.multipleFormData.values.forEach((value, index) => {
        const valueError = {};

        if (!value.value?.trim()) {
          valueError.value = this.$t("variants.valueRequired");
          isValid = false;
        }

        if (!value.value_ar?.trim()) {
          valueError.value_ar = this.$t("variants.valueArRequired");
          isValid = false;
        }

        if (Object.keys(valueError).length > 0) {
          this.valueErrors[index] = valueError;
        }
      });

      return isValid;
    },

    hasValueError(index, field) {
      return this.valueErrors[index] && this.valueErrors[index][field];
    },

    getValueError(index, field) {
      return this.valueErrors[index]?.[field] || '';
    },

    async submitMultipleValues() {
      if (!this.validateMultipleForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/variant-values`;

        const payload = {
          company_id: this.effectiveCompanyId,
          variant_id: this.variant.id,
          values: this.multipleFormData.values.map(value => ({
            value: value.value,
            value_ar: value.value_ar
          }))
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetMultipleForm();
        this.showMultipleValuesForm = false;

        // Add all new values to the table
        if (Array.isArray(response.data.data)) {
          response.data.data.forEach(value => {
            this.handleItemCreated(value);
          });
        }

        this.$emit("variant-values-updated");

        this.showToast(
          "success",
          this.$t("variants.success"),
          this.$t("variants.variantValuesCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    // Edit Value Methods
    editValueModal(value) {
      this.editFormData = {
        id: value.id,
        value: value.value,
        value_ar: value.value_ar,
      };
      this.showEditModal = true;
    },

    validateEditForm() {
      this.editErrors = {};

      if (!this.editFormData.value?.trim()) {
        this.editErrors.value = this.$t("variants.valueRequired");
      }

      if (!this.editFormData.value_ar?.trim()) {
        this.editErrors.value_ar = this.$t("variants.valueArRequired");
      }

      return Object.keys(this.editErrors).length === 0;
    },

    async submitEditValue() {
      if (!this.validateEditForm()) {
        return;
      }

      this.editLoading = true;

      try {
        const url = `${general_request.BASE_URL}/admin/company/variant-value/${this.editFormData.id}`;

        const payload = {
          value: this.editFormData.value,
          value_ar: this.editFormData.value_ar,
        };

        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        this.handleItemUpdated(response.data.data);
        this.showEditModal = false;
        this.$emit("variant-values-updated");

        this.showToast(
          "success",
          this.$t("variants.success"),
          this.$t("variants.variantValueUpdated")
        );
      } catch (error) {
        this.handleEditError(error);
      } finally {
        this.editLoading = false;
      }
    },

    deleteValue(value) {
      this.deleteItem(
        value,
        this.propMainUrl,
        this.$t("variants.variantValueDeleted"),
        this.$t("variants.deleteError")
      );
    },

    // Common Methods
    resetSingleForm() {
      this.singleFormData = {
        value: "",
        value_ar: "",
      };
      this.errors = {};
    },

    resetMultipleForm() {
      this.multipleFormData = {
        values: [
          { value: "", value_ar: "" }
        ]
      };
      this.valueErrors = [];
    },

    handleSaveError(error) {
      this.errors = {};
      this.valueErrors = [];
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleEditError(error) {
      this.editErrors = {};

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 422) {
          if (responseData.errors && typeof responseData.errors === "object") {
            this.editErrors = this.formatFieldErrors(responseData.errors);
          }
        } else if (responseData.message) {
          this.error = responseData.message;
        }
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("variants.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("variants.networkError");
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.variant-values-form {
  max-width: 100%;
}

.variant-info {
  border-left: 4px solid var(--primary-500);
}

.search-container {
  position: relative;
  display: inline-block;
}

.search-input {
  padding-left: 2.5rem;
  width: 20rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  pointer-events: none;
}

.value-item {
  gap: 0.5rem;
}

.field {
  margin-bottom: 1rem;
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>