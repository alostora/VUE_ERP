<template>
  <div class="warehouse-table-page">
    <div class="mb-4 flex gap-2">
      <Button
        :label="$t('warehouses.backToBranch')"
        icon="pi pi-arrow-left"
        class="p-button-text"
        @click="goBackToBranch"
      />
      <Button
        :label="$t('warehouses.addWarehouse')"
        icon="pi pi-plus"
        @click="createWarehouse"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('warehouses.search')"
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
        :placeholder="$t('warehouses.show')"
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
      <Column field="id" :header="$t('warehouses.id')" style="min-width: 80px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('warehouses.name')"
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
        :header="$t('warehouses.details')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div>
            <div class="text-sm mb-1">{{ slotProps.data.details || "-" }}</div>
            <div class="text-xs text-color-secondary">
              {{ slotProps.data.details_ar || "-" }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Default Column -->
      <Column
        field="is_default"
        :header="$t('warehouses.isDefault')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <Tag
            :value="
              slotProps.data.is_default
                ? $t('warehouses.yes')
                : $t('warehouses.no')
            "
            :severity="slotProps.data.is_default ? 'success' : 'secondary'"
          />
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('warehouses.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('warehouses.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editWarehouseModal(slotProps.data)"
              v-tooltip.top="$t('warehouses.edit')"
            />
            <Button
              icon="pi pi-star"
              class="p-button-text p-button-sm p-button-warning"
              @click="setAsDefault(slotProps.data)"
              v-tooltip.top="$t('warehouses.setDefault')"
              :disabled="slotProps.data.is_default ? true : false"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('warehouses.delete')"
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
      <i class="pi pi-building text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("warehouses.noWarehouses") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("warehouses.createFirstWarehouse") }}
      </p>
      <Button
        :label="$t('warehouses.addWarehouse')"
        icon="pi pi-plus"
        @click="createWarehouse"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Warehouse Modal -->
    <WarehouseCreateModal
      ref="warehouseCreateModal"
      :company_id="effectiveCompanyId"
      :branch_id="effectiveBranchId"
      @warehouse-created="handleWarehouseCreated"
    />

    <!-- Edit Warehouse Modal -->
    <WarehouseEditModal
      ref="warehouseEditModal"
      :warehouse="selectedItem"
      :company_id="effectiveCompanyId"
      :branch_id="effectiveBranchId"
      @warehouse-updated="handleWarehouseUpdated"
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
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import WarehouseCreateModal from "./WarehouseCreateModal.vue";
import WarehouseEditModal from "./WarehouseEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "WarehouseTable",

  components: {
    WarehouseCreateModal,
    WarehouseEditModal,
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
        console.warn("⚠️ Company ID or Branch ID is undefined");
        return "";
      }

      let url = `${general_request.BASE_URL}/admin/company/branch/warehouses/search/${this.effectiveCompanyId}?paginate=true&branch_id=${this.effectiveBranchId}`;

      if (this.query_string) {
        url += `&query_string=${encodeURIComponent(this.query_string)}`;
      }

      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/branch/warehouse`;
    },
  },

  mounted() {
    console.log("🚀 WarehouseTable mounted");
    if (this.effectiveCompanyId && this.effectiveBranchId) {
      this.getData();
    } else {
      console.warn("⚠️ Missing company or branch ID on mount");
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
    createWarehouse() {
      if (!this.effectiveCompanyId || !this.effectiveBranchId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("warehouses.missingIds")
        );
        return;
      }
      this.$refs.warehouseCreateModal.openModal();
    },

    handleWarehouseCreated(newWarehouse) {
      this.handleItemCreated(newWarehouse);
    },

    editWarehouseModal(warehouse) {
      this.selectedItem = { ...warehouse };
      this.$nextTick(() => {
        this.$refs.warehouseEditModal.openModal();
      });
    },

    handleWarehouseUpdated(updatedWarehouse) {
      this.handleItemUpdated(updatedWarehouse);
    },

    async setAsDefault(warehouse) {
      try {
        this.loading = true;
        const url = `${general_request.BASE_URL}/admin/company/branch/warehouse-set-default/${warehouse.id}`;

        console.log("🌐 Setting warehouse as default:", url);

        const response = await this.$http.patch(
          url,
          {},
          {
            headers: general_request.headers,
          }
        );

        console.log("✅ Warehouse set as default response:", response.data);

        // Update ALL warehouses - set the selected one as default, others as false
        this.tableItems = this.tableItems.map((item) => ({
          ...item,
          is_default: item.id === warehouse.id,
        }));

        this.showToast(
          "success",
          this.$t("warehouses.success"),
          this.$t("warehouses.warehouseSetDefault")
        );

        // Refresh the data to ensure consistency
        this.getData();
      } catch (error) {
        console.error("❌ Error setting warehouse as default:", error);
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("warehouses.setDefaultError")
        );
      } finally {
        this.loading = false;
      }
    },

    deleteRow(warehouse) {
      this.deleteItem(
        warehouse,
        this.propMainUrl,
        this.$t("warehouses.warehouseDeleted"),
        this.$t("warehouses.deleteError")
      );
    },

    goBackToBranch() {
      const companyId = this.effectiveCompanyId;
      const branchId = this.effectiveBranchId;

      if (!companyId || !branchId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("warehouses.missingIds")
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
      }
    },
  },
};
</script>

<style scoped>
.warehouse-table-page {
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
