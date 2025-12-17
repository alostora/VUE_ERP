<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("employees.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('employees.backToBranch')"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="goBackToBranch"
          />
          <Button
            :label="$t('employees.addEmployee')"
            icon="pi pi-plus"
            @click="createEmployee"
            class="p-button-primary"
          />
        </div>
      </div>

      <div
        class="table-filters"
      >
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('employees.search')"
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
          :placeholder="$t('employees.show')"
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
        class="table-content"
        :class="{ 'responsive-table': true }"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        @page="handlePageChange"
      >
        <!-- ID Column -->
        <Column field="id" :header="$t('employees.id')" style="min-width: 80px">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <!-- Name Column -->
        <Column
          field="name"
          :header="$t('employees.name')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div class="font-medium">{{ slotProps.data.name }}</div>
          </template>
        </Column>

        <!-- Email Column -->
        <Column
          field="email"
          :header="$t('employees.email')"
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div class="flex align-items-center">
              <i class="pi pi-envelope mr-2 text-color-secondary"></i>
              {{ slotProps.data.email }}
            </div>
          </template>
        </Column>

        <!-- Phone Column -->
        <Column
          field="phone"
          :header="$t('employees.phone')"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div class="flex align-items-center">
              <i class="pi pi-phone mr-2 text-color-secondary"></i>
              {{ slotProps.data.phone || "-" }}
            </div>
          </template>
        </Column>

        <!-- Account Type Column -->
        <Column :header="$t('employees.accountType')" style="min-width: 150px">
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.account_type"
              :value="slotProps.data.account_type.name"
              severity="info"
            />
            <span v-else>-</span>
          </template>
        </Column>

        <!-- Created At Column -->
        <Column
          field="created_at"
          :header="$t('employees.createdAt')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <!-- Actions Column -->
        <Column
          :header="$t('employees.actions')"
          :exportable="false"
          style="min-width: 180px"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editEmployeeModal(slotProps.data)"
                v-tooltip.top="$t('employees.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('employees.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Empty State -->
      <div v-if="!loading && tableItems.length === 0" class="text-center py-6">
        <i class="pi pi-users text-6xl text-color-secondary mb-3"></i>
        <h3 class="text-color-secondary">
          {{ $t("employees.noEmployees") }}
        </h3>
        <p class="text-color-secondary">
          {{ $t("employees.createFirstEmployee") }}
        </p>
        <Button
          :label="$t('employees.addEmployee')"
          icon="pi pi-plus"
          @click="createEmployee"
          class="p-button-primary mt-3"
        />
      </div>

      <!-- Create Employee Modal -->
      <EmployeeCreateModal
        ref="employeeCreateModal"
        :company_id="effectiveCompanyId"
        :branch_id="effectiveBranchId"
        @employee-created="handleEmployeeCreated"
      />

      <!-- Edit Employee Modal -->
      <EmployeeEditModal
        ref="employeeEditModal"
        :employee="selectedItem"
        :company_id="effectiveCompanyId"
        :branch_id="effectiveBranchId"
        @employee-updated="handleEmployeeUpdated"
      />

      <Toast />
      <ConfirmDialog />
    </div>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import EmployeeCreateModal from "./EmployeeCreateModal.vue";
import EmployeeEditModal from "./EmployeeEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "EmployeeTable",

  components: {
    EmployeeCreateModal,
    EmployeeEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Tag,
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
    branch_id: {
      type: String,
      default: null,
    },
  },

  mixins: [useTable(), useCrud()],

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route?.params?.company_id;
    },

    effectiveBranchId() {
      return this.branch_id || this.$route?.params?.branch_id;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId || !this.effectiveBranchId) {
        return "";
      }

      // UPDATED URL FORMAT
      let url = `${general_request.BASE_URL}/admin/company-employees/search?company_id=${this.effectiveCompanyId}&branch_id=${this.effectiveBranchId}&paginate=true`;

      if (this.query_string) {
        url += `&query_string=${encodeURIComponent(this.query_string)}`;
      }

      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company-employee`;
    },
  },

  mounted() {
    if (this.effectiveCompanyId && this.effectiveBranchId) {
      this.getData();
    } else {
    }
  },

  watch: {
    "$route.params.company_id": {
      handler(newCompanyId) {
        if (newCompanyId && this.effectiveBranchId) {
          this.getData();
        }
      },
    },
    "$route.params.branch_id": {
      handler(newBranchId) {
        if (newBranchId && this.effectiveCompanyId) {
          this.getData();
        }
      },
    },
  },

  methods: {
    createEmployee() {
      if (!this.effectiveCompanyId || !this.effectiveBranchId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("employees.missingIds")
        );
        return;
      }
      this.$refs.employeeCreateModal.openModal();
    },

    handleEmployeeCreated(newEmployee) {
      this.handleItemCreated(newEmployee);
      // Refresh the table data
      this.getData();
    },

    editEmployeeModal(employee) {
      this.selectedItem = { ...employee };
      this.$nextTick(() => {
        this.$refs.employeeEditModal.openModal();
      });
    },

    handleEmployeeUpdated(updatedEmployee) {
      this.handleItemUpdated(updatedEmployee);
      // Refresh the table data
      this.getData();
    },

    deleteRow(employee) {
      this.deleteItem(
        employee,
        this.propMainUrl,
        this.$t("employees.employeeDeleted"),
        this.$t("employees.deleteError")
      ).then(() => {
        // Refresh data after delete
        this.getData();
      });
    },

    goBackToBranch() {
      const companyId = this.effectiveCompanyId;
      const branchId = this.effectiveBranchId;

      if (!companyId || !branchId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("employees.missingIds")
        );
        return;
      }

      this.$router.push({
        name: "branch-details",
        params: { company_id: companyId, branch_id: branchId },
      });
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return dateString;
      }
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      } else {
      }
    },
  },
};
</script>

<style scoped></style>
