<template>
  <div class="invoice-stage-table-page">
    <div class="mb-4">
      <Button
        :label="$t('invoice_stages.addInvoiceStage')"
        icon="pi pi-plus"
        @click="createInvoiceStage"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('invoice_stages.search')"
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
        :placeholder="$t('invoice_stages.show')"
        @change="getData(propSearchUrl)"
        class="w-10rem"
      />
    </div>

    <!-- Data Table -->
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
      <!-- ID Column -->
      <Column
        field="id"
        :header="$t('invoice_stages.id')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('invoice_stages.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <div>
            <div class="font-medium">{{ slotProps.data.name }}</div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.name_ar }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Details Column -->
      <Column
        field="details"
        :header="$t('invoice_stages.details')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div>
            <div class="text-sm mb-1">{{ slotProps.data.details }}</div>
            <div class="text-xs text-color-secondary">
              {{ slotProps.data.details_ar }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Is Default Column -->
      <Column
        field="is_default"
        :header="$t('invoice_stages.is_default')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <Badge
            v-if="slotProps.data.is_default"
            :value="$t('invoice_stages.defaultStage')"
            severity="success"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('invoice_stages.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('invoice_stages.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editInvoiceStageModal(slotProps.data)"
              v-tooltip.top="$t('invoice_stages.edit')"
            />
            <Button
              icon="pi pi-star"
              class="p-button-text p-button-sm p-button-warning"
              @click="setAsDefault(slotProps.data)"
              v-tooltip.top="$t('invoice_stages.setAsDefault')"
              :disabled="slotProps.data.is_default"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('invoice_stages.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Empty State -->
    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-receipt text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("invoice_stages.noInvoiceStages") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("invoice_stages.createFirstInvoiceStage") }}
      </p>
      <Button
        :label="$t('invoice_stages.addInvoiceStage')"
        icon="pi pi-plus"
        @click="createInvoiceStage"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Invoice Stage Modal -->
    <InvoiceStageCreateModal
      ref="invoiceStageCreateModal"
      :company_id="effectiveCompanyId"
      @invoice-stage-created="handleInvoiceStageCreated"
    />

    <!-- Edit Invoice Stage Modal -->
    <InvoiceStageEditModal
      ref="invoiceStageEditModal"
      :invoice-stage="selectedItem"
      :company_id="effectiveCompanyId"
      @invoice-stage-updated="handleInvoiceStageUpdated"
    />

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
import Badge from "primevue/badge";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import InvoiceStageCreateModal from "./InvoiceStageCreateModal.vue";
import InvoiceStageEditModal from "./InvoiceStageEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "InvoiceStageTable",

  components: {
    InvoiceStageCreateModal,
    InvoiceStageEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Badge,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    company_id: {
      type: String,
      required: true,
    },
  },

  mixins: [useTable(), useCrud()],

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      console.log("🏢 Effective Company ID:", companyId);
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        console.warn("⚠️ Company ID is undefined, cannot build search URL");
        return "";
      }
      const url = `${general_request.BASE_URL}/admin/company/invoice-stages/search/${this.effectiveCompanyId}?paginate=true`;
      console.log("🌐 Search URL:", url);
      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/invoice-stage`;
    },
  },

  mounted() {
    console.log("🚀 InvoiceStageTable mounted");
    if (this.effectiveCompanyId) {
      this.getData();
    } else {
      console.warn("⚠️ No company ID found on mount");
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        console.log("🔄 Route company_id changed:", newCompanyId);
        if (newCompanyId) {
          this.getData();
        }
      },
    },
  },

  methods: {
    /**
     * Open create invoice stage modal
     */
    createInvoiceStage() {
      if (!this.effectiveCompanyId) {
        this.showToast("error", "Error", "Company ID is missing");
        return;
      }
      this.$refs.invoiceStageCreateModal.openModal();
    },

    /**
     * Handle invoice stage created event
     */
    handleInvoiceStageCreated(newInvoiceStage) {
      this.handleItemCreated(newInvoiceStage);
    },

    /**
     * Open edit invoice stage modal
     */
    editInvoiceStageModal(invoiceStage) {
      this.selectedItem = { ...invoiceStage };
      this.$nextTick(() => {
        this.$refs.invoiceStageEditModal.openModal();
      });
    },

    /**
     * Handle invoice stage updated event
     */
    handleInvoiceStageUpdated(updatedInvoiceStage) {
      this.handleItemUpdated(updatedInvoiceStage);
    },

    /**
     * Delete invoice stage
     */
    deleteRow(invoiceStage) {
      this.deleteItem(
        invoiceStage,
        this.propMainUrl,
        this.$t("invoice_stages.invoiceStageDeleted"),
        this.$t("invoice_stages.deleteError")
      );
    },

    /**
     * Set invoice stage as default
     */
    async setAsDefault(invoiceStage) {
      this.$confirm.require({
        message: this.$t("invoice_stages.confirmSetDefault"),
        header: this.$t("common.confirmation"),
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-warning",
        accept: async () => {
          try {
            this.loading = true;
            const url = `${general_request.BASE_URL}/admin/company/invoice-stage-set-default/${invoiceStage.id}`;
            const response = await this.$http.patch(
              url,
              {},
              {
                headers: general_request.headers,
              }
            );

            // Update the local data
            this.tableItems = this.tableItems.map((item) => ({
              ...item,
              is_default: item.id === invoiceStage.id,
            }));

            this.showToast(
              "success",
              this.$t("invoice_stages.success"),
              this.$t("invoice_stages.invoiceStageSetDefault")
            );
          } catch (error) {
            console.error("Error setting default:", error);
            this.showToast(
              "error",
              this.$t("common.error"),
              this.$t("invoice_stages.setDefaultError")
            );
          } finally {
            this.loading = false;
          }
        },
        reject: () => {
          // User rejected
        },
      });
    },

    /**
     * Show toast notification
     */
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
.invoice-stage-table-page {
  padding: 1rem;
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

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
  margin: 2rem 0;
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
