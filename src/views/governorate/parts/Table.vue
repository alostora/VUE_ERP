<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("countries.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('countries.addCountry')"
            icon="pi pi-plus"
            @click="openCreateModel"
            class="p-button-primary"
          />
        </div>
      </div>

      <div
        class="table-filters flex flex-col md:flex-row gap-2 items-stretch md:items-center"
      >
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('countries.search')"
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
          :placeholder="$t('countries.show')"
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
        <Column field="id" :header="$t('countries.id')" class="col-identifier">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column
          field="name"
          :header="$t('countries.name')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="name_ar"
          :header="$t('countries.name_ar')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name_ar }}</span>
          </template>
        </Column>

        <Column
          field="phone_code"
          :header="$t('countries.phone_code')"
          sortable
          class="col-phone"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.phone_code }}</span>
          </template>
        </Column>

        <Column
          field="prefix"
          :header="$t('countries.prefix')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.prefix }}</span>
          </template>
        </Column>

        <Column :header="$t('countries.governorates')" class="col-actions">
          <template #body="slotProps">
            <div class="table-actions-cell">
              <Button
                :label="$t('countries.viewGovernorates')"
                icon="pi pi-list"
                class="p-button-text p-button-sm p-button-info"
                @click="viewGovernorates(slotProps.data)"
                v-tooltip.top="$t('countries.viewGovernoratesTooltip')"
              />
            </div>
          </template>
        </Column>

        <Column
          :header="$t('countries.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="openUpdateModel(slotProps.data)"
                v-tooltip.top="$t('countries.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('countries.delete')"
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

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import general_request from "@/utils/general_request";
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "Table",

  mixins: [useTable(), useCrud(), customFunctions],

  components: {
    CreateForm,
    UpdateForm,
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

  data() {
    return {
      propSearchUrl:
        general_request.BASE_URL + "/admin/countries/search?paginate=true",
      propMainUrl: general_request.BASE_URL + "/admin/country",
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
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
        this.$t("countries.countryDeleted"),
        this.$t("countries.deleteError")
      );
    },
  },
};
</script>

<style scoped></style>
