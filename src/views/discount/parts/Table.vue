<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("discounts.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('discounts.add')"
            icon="pi pi-plus"
            @click="openCreateModel"
            class="p-button-primary"
          />
        </div>
      </div>

      <div class="table-filters">
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('discounts.search')"
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
          :placeholder="$t('discounts.show')"
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
        <!-- ID -->
        <Column field="id" :header="$t('discounts.id')" style="min-width: 70px">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <!-- Name -->
        <Column
          field="name"
          :header="$t('discounts.name')"
          :sortable="true"
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

        <!-- Type -->
        <Column
          field="type"
          :header="$t('discounts.type')"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.type.name"
              :severity="getTypeSeverity(slotProps.data.type.prefix)"
            />
          </template>
        </Column>

        <!-- Value -->
        <Column
          field="value"
          :header="$t('discounts.value')"
          :sortable="true"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <div class="text-right font-bold">
              {{ formatValue(slotProps.data) }}
            </div>
          </template>
        </Column>

        <!-- Date Range -->
        <Column :header="$t('discounts.dateRange')" style="min-width: 180px">
          <template #body="slotProps">
            <div class="text-sm">
              <div>{{ formatDate(slotProps.data.date_from) }}</div>
              <div class="text-color-secondary">to</div>
              <div>{{ formatDate(slotProps.data.date_to) }}</div>
            </div>
          </template>
        </Column>

        <Column
          field="created_at"
          :header="$t('discounts.createdAt')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          :header="$t('discounts.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
              <!-- View Related Branches Button -->
              <Button
                icon="pi pi-sitemap"
                class="p-button-text p-button-sm p-button-azure"
                @click="openBranchModal(slotProps.data)"
                v-tooltip.top="$t('discounts.viewBranches')"
              />

              <!-- View Related Products Button -->
              <Button
                icon="pi pi-shopping-bag"
                class="p-button-text p-button-sm p-button-info"
                @click="openFinalProductModal(slotProps.data)"
                v-tooltip.top="$t('discounts.viewRelatedProducts')"
              />
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="openUpdateModel(slotProps.data)"
                v-tooltip.top="$t('discounts.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('discounts.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <UpdateForm
        ref="updateModalForm"
        :selected_item="selectedItem"
        @updated="handleUpdated"
      />

      <CreateForm ref="createModalForm" @created="handleCreated" />

      <BranchTable ref="branchTable" :selected_item="selectedItem" />
      <FinalProductTable
        ref="finalProductTable"
        :selected_item="selectedItem"
      />

      <Toast />
    </div>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import CreateForm from "./CreateForm.vue";
import UpdateForm from "./UpdateForm.vue";
import BranchTable from "../related_models/branches/parts/Table.vue";
import FinalProductTable from "../related_models/final_products/parts/Table.vue";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import useSelectionItems from "@/utils/useSelectionItems";
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "Table",

  mixins: [useTable(), useCrud(), customFunctions, useSelectionItems],

  components: {
    CreateForm,
    UpdateForm,
    BranchTable,
    FinalProductTable,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    ProgressSpinner,
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

  watch: {
    "$route.params.company_id": {
      immediate: true,
      deep: true,
      handler(company_id) {
        if (company_id) {
          this.companyId = company_id;
          this.getData(this.propSearchUrl);
        }
      },
    },
  },

  computed: {
    propSearchUrl() {
      let url = `${moduleUrl.URLS.DISCOUNT.propSearchUrl}/${this.companyId}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      propMainUrl: moduleUrl.URLS.DISCOUNT.propMainUrl,
    };
  },

  methods: {
    getTypeSeverity(prefix) {
      return prefix === "PERCENTAGE" ? "success" : "info";
    },

    formatValue(discount) {
      return discount.type.prefix === "PERCENTAGE"
        ? `${discount.value}%`
        : `$${parseFloat(discount.value).toFixed(2)}`;
    },

    openCreateModel() {
      this.$refs.createModalForm.openModal();
    },

    openUpdateModel(item) {
      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.updateModalForm.openModal();
      });
    },

    handleCreated(newItem) {
      this.handleItemCreated(newItem);
    },

    handleUpdated(updatedItem) {
      this.handleItemUpdated(updatedItem);
    },

    deleteRow(item) {
      this.deleteItem(
        item,
        this.propMainUrl,
        this.$t("common.itemDeleted"),
        this.$t("common.failedToDeleteItem"),
      );
    },

    openBranchModal(item) {
      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.branchTable.openModal();
      });
    },

    openFinalProductModal(item) {
      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.finalProductTable.openModal();
      });
    },
  },
};
</script>

<style scoped></style>
