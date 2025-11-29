<template>
  <div class="branch-table-page">
    <div class="mb-4 flex gap-2">
      <Button
        :label="$t('companies.viewCompany')"
        icon="pi pi-building"
        class="p-button-text"
        @click="goBackToCompany"
      />
      <Button
        :label="$t('branches.addBranch')"
        icon="pi pi-plus"
        @click="createBranch"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('branches.search')"
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
        :placeholder="$t('branches.show')"
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
      <Column field="id" :header="$t('branches.id')" style="min-width: 80px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('branches.name')"
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

      <!-- Phone Column -->
      <Column
        field="phone"
        :header="$t('branches.phone')"
        style="min-width: 130px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.phone }}</span>
        </template>
      </Column>

      <!-- Address Column -->
      <Column
        field="address"
        :header="$t('branches.address')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div>
            <div class="text-sm mb-1">{{ slotProps.data.address }}</div>
            <div class="text-xs text-color-secondary">
              {{ slotProps.data.address_ar }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('branches.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('branches.actions')"
        :exportable="false"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editBranchModal(slotProps.data)"
              v-tooltip.top="$t('branches.edit')"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm"
              @click="goToBranchShow(slotProps.data)"
              v-tooltip.top="$t('branches.show')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('branches.delete')"
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
      <i class="pi pi-map-marker text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("branches.noBranches") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("branches.createFirstBranch") }}
      </p>
      <Button
        :label="$t('branches.addBranch')"
        icon="pi pi-plus"
        @click="createBranch"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Branch Modal -->
    <BranchCreateModal
      ref="branchCreateModal"
      :company_id="effectiveCompanyId"
      @branch-created="handleBranchCreated"
    />

    <!-- Edit Branch Modal -->
    <BranchEditModal
      ref="branchEditModal"
      :branch="selectedItem"
      :company_id="effectiveCompanyId"
      @branch-updated="handleBranchUpdated"
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
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import BranchCreateModal from "./BranchCreateModal.vue";
import BranchEditModal from "./BranchEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "BranchTable",

  components: {
    BranchCreateModal,
    BranchEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  mixins: [useTable(), useCrud()],

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route?.params?.company_id;
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        console.warn("⚠️ Company ID is undefined, cannot build search URL");
        return "";
      }
      const url = `${general_request.BASE_URL}/admin/company/branches/search/${this.effectiveCompanyId}?paginate=true`;
      console.log("🌐 Search URL:", url);
      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/branch`;
    },
  },

  mounted() {
    console.log("🚀 BranchTable mounted");
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
     * Open create branch modal
     */
    createBranch() {
      if (!this.effectiveCompanyId) {
        this.showToast("error", "Error", "Company ID is missing");
        return;
      }
      this.$refs.branchCreateModal.openModal();
    },

    /**
     * Handle branch created event
     */
    handleBranchCreated(newBranch) {
      this.handleItemCreated(newBranch);
    },

    /**
     * Open edit branch modal
     */
    editBranchModal(branch) {
      this.selectedItem = { ...branch };
      this.$nextTick(() => {
        this.$refs.branchEditModal.openModal();
      });
    },

    /**
     * Handle branch updated event
     */
    handleBranchUpdated(updatedBranch) {
      this.handleItemUpdated(updatedBranch);
    },

    /**
     * Delete branch
     */
    deleteRow(branch) {
      this.deleteItem(
        branch,
        this.propMainUrl,
        this.$t("branches.branchDeleted"),
        this.$t("branches.deleteError")
      );
    },

    /**
     * Navigate to branch show page
     */
    goToBranchShow(branch) {
      const companyId = this.effectiveCompanyId;
      const branchId = branch?.id;
      if (!companyId || !branchId) {
        this.showToast(
          "error",
          this.$t("common.error") || "Error",
          this.$t("branches.missingIds") || "Missing company or branch ID"
        );
        return;
      }
      this.$router.push(`/company/${companyId}/branches/${branchId}`);
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
    goBackToCompany() {
      const companyId = this.effectiveCompanyId;
      if (!companyId) {
        if (this.$toast) {
          this.$toast.add({
            severity: "warn",
            summary: this.$t("common.error") || "Error",
            detail: this.$t("branches.missingIds") || "Missing company ID",
            life: 3000,
          });
        }
        return;
      }
      // Try navigating via named child route to avoid redirects
      try {
        console.debug("Navigating to company-details for company", companyId);
        this.$router.push({
          name: "company-details",
          params: { company_id: companyId },
        });
      } catch (e) {
        console.warn("Named route navigation failed, falling back to path", e);
        this.$router.push(`/company/${companyId}/show`);
      }
    },
  },
};
</script>

<style scoped>
.branch-table-page {
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
