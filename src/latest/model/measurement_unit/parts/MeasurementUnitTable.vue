<template>
  <div class="measurement-unit-table-page">
    <div class="mb-4">
      <Button
        :label="$t('measurementUnits.addMeasurementUnit')"
        icon="pi pi-plus"
        @click="createMeasurementUnit"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('measurementUnits.search')"
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
        :placeholder="$t('measurementUnits.show')"
        @change="getData(propSearchUrl)"
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
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <Column
        field="id"
        :header="$t('measurementUnits.id')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column
        field="name"
        :header="$t('measurementUnits.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <Column
        field="equals"
        :header="$t('measurementUnits.equals')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.equals || "-" }}</span>
        </template>
      </Column>

      <Column
        field="created_at"
        :header="$t('measurementUnits.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <Column
        :header="$t('measurementUnits.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editMeasurementUnitModal(slotProps.data)"
              v-tooltip.top="$t('measurementUnits.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('measurementUnits.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <MeasurementUnitEditModal
      ref="measurementUnitEditModal"
      :measurement-unit="selectedItem"
      :company_id="effectiveCompanyId"
      @measurement-unit-updated="handleMeasurementUnitUpdated"
    />

    <MeasurementUnitCreateModal
      ref="measurementUnitCreateModal"
      :company_id="effectiveCompanyId"
      @measurement-unit-created="handleMeasurementUnitCreated"
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

import MeasurementUnitCreateModal from "./MeasurementUnitCreateModal.vue";
import MeasurementUnitEditModal from "./MeasurementUnitEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "MeasurementUnitTable",

  components: {
    MeasurementUnitCreateModal,
    MeasurementUnitEditModal,
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
      const companyId = this.company_id || this.$route.params.company_id;
      console.log("🏢 Effective Company ID:", companyId);
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        console.error("❌ No company ID found!");
        return "";
      }
      return `${general_request.BASE_URL}/admin/company/measurement-units/${this.effectiveCompanyId}?paginate=true`;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/measurement-unit`;
    },
  },

  mounted() {
    console.log("🚀 MeasurementUnitTable mounted()");
    console.log("🏢 Effective Company ID:", this.effectiveCompanyId);

    if (this.effectiveCompanyId) {
      console.log("✅ Company ID found, fetching measurement units...");
      this.getData();
    } else {
      console.error("❌ No company ID found!");
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        console.log("🛣️ Route company_id changed:", newCompanyId);
        if (newCompanyId) {
          console.log("✅ Company ID available, fetching data...");
          this.getData();
        }
      },
    },
  },

  methods: {
    createMeasurementUnit() {
      this.$refs.measurementUnitCreateModal.openModal();
    },

    handleMeasurementUnitCreated(newMeasurementUnit) {
      this.handleItemCreated(newMeasurementUnit);
    },

    editMeasurementUnitModal(measurementUnit) {
      this.selectedItem = { ...measurementUnit };
      this.$nextTick(() => {
        this.$refs.measurementUnitEditModal.openModal();
      });
    },

    handleMeasurementUnitUpdated(updatedMeasurementUnit) {
      this.handleItemUpdated(updatedMeasurementUnit);
    },

    deleteRow(measurementUnit) {
      this.deleteItem(
        measurementUnit,
        this.propMainUrl,
        this.$t("measurementUnits.measurementUnitDeleted"),
        this.$t("measurementUnits.deleteError")
      );
    },
  },
};
</script>

<style scoped>
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

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
