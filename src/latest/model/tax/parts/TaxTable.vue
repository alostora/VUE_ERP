<template>
  <div class="tax-table-page">
    <div class="mb-4">
      <Button
        :label="$t('taxes.addTax')"
        icon="pi pi-plus"
        @click="createTax"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('taxes.search')"
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
        :placeholder="$t('taxes.show')"
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
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- ID Column -->
      <Column field="id" :header="$t('taxes.id')" style="min-width: 80px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('taxes.name')"
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

      <!-- Value Column -->
      <Column
        field="value"
        :header="$t('taxes.value')"
        sortable
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.value }}%</span>
        </template>
      </Column>

      <!-- Details Column -->
      <Column
        field="details"
        :header="$t('taxes.details')"
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

      <!-- Status Column -->
      <Column
        field="is_active"
        :header="$t('taxes.is_active')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <Badge
            v-if="slotProps.data.is_active"
            :value="$t('taxes.active')"
            severity="success"
          />
          <Badge v-else :value="$t('taxes.inactive')" severity="secondary" />
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('taxes.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('taxes.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editTaxModal(slotProps.data)"
              v-tooltip.top="$t('taxes.edit')"
            />
            <Button
              v-if="!slotProps.data.is_active"
              icon="pi pi-check"
              class="p-button-text p-button-sm p-button-success"
              @click="setActive(slotProps.data)"
              v-tooltip.top="$t('taxes.setAsActive')"
            />
            <Button
              v-if="slotProps.data.is_active"
              icon="pi pi-times"
              class="p-button-text p-button-sm p-button-secondary"
              @click="setInactive(slotProps.data)"
              v-tooltip.top="$t('taxes.setAsInactive')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('taxes.delete')"
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
      <i class="pi pi-percentage text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("taxes.noTaxes") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("taxes.createFirstTax") }}
      </p>
      <Button
        :label="$t('taxes.addTax')"
        icon="pi pi-plus"
        @click="createTax"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Tax Modal -->
    <TaxCreateModal
      ref="taxCreateModal"
      :company_id="effectiveCompanyId"
      @tax-created="handleTaxCreated"
    />

    <!-- Edit Tax Modal -->
    <TaxEditModal
      ref="taxEditModal"
      :tax="selectedItem"
      :company_id="effectiveCompanyId"
      @tax-updated="handleTaxUpdated"
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

import TaxCreateModal from "./TaxCreateModal.vue";
import TaxEditModal from "./TaxEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "TaxTable",

  components: {
    TaxCreateModal,
    TaxEditModal,
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
      const url = `${general_request.BASE_URL}/admin/company/taxes/search/${this.effectiveCompanyId}?paginate=true`;
      console.log("🌐 Search URL:", url);
      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/tax`;
    },
  },

  mounted() {
    console.log("🚀 TaxTable mounted");
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
     * Open create tax modal
     */
    createTax() {
      if (!this.effectiveCompanyId) {
        this.showToast("error", "Error", "Company ID is missing");
        return;
      }
      this.$refs.taxCreateModal.openModal();
    },

    /**
     * Handle tax created event
     */
    handleTaxCreated(newTax) {
      this.handleItemCreated(newTax);
    },

    /**
     * Open edit tax modal
     */
    editTaxModal(tax) {
      this.selectedItem = { ...tax };
      this.$nextTick(() => {
        this.$refs.taxEditModal.openModal();
      });
    },

    /**
     * Handle tax updated event
     */
    handleTaxUpdated(updatedTax) {
      this.handleItemUpdated(updatedTax);
    },

    /**
     * Delete tax
     */
    deleteRow(tax) {
      this.deleteItem(
        tax,
        this.propMainUrl,
        this.$t("taxes.taxDeleted"),
        this.$t("taxes.deleteError")
      );
    },

    /**
     * Set tax as active
     */
    async setActive(tax) {
      this.$confirm.require({
        message: this.$t("taxes.confirmSetActive"),
        header: this.$t("common.confirmation"),
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: async () => {
          try {
            this.loading = true;
            const url = `${general_request.BASE_URL}/admin/company/tax/set-active/${tax.id}`;
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
              is_active: item.id === tax.id,
            }));

            this.showToast(
              "success",
              this.$t("taxes.success"),
              this.$t("taxes.taxSetActive")
            );
          } catch (error) {
            console.error("Error setting active:", error);
            this.showToast(
              "error",
              this.$t("common.error"),
              this.$t("taxes.setActiveError")
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
     * Set tax as inactive
     */
    async setInactive(tax) {
      this.$confirm.require({
        message: this.$t("taxes.confirmSetInactive"),
        header: this.$t("common.confirmation"),
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: async () => {
          try {
            this.loading = true;
            const url = `${general_request.BASE_URL}/admin/company/tax/set-inactive/${tax.id}`;
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
              is_active: item.id === tax.id ? false : item.is_active,
            }));

            this.showToast(
              "success",
              this.$t("taxes.success"),
              this.$t("taxes.taxSetInactive")
            );
          } catch (error) {
            console.error("Error setting inactive:", error);
            this.showToast(
              "error",
              this.$t("common.error"),
              this.$t("taxes.setInactiveError")
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
.tax-table-page {
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
