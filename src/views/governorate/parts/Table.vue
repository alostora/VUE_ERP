<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("governorates.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('governorates.addGovernorate')"
            icon="pi pi-plus"
            @click="openCreateModel"
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
            :placeholder="$t('governorates.search')"
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
          :placeholder="$t('governorates.show')"
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
        <Column
          field="id"
          :header="$t('governorates.id')"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column
          field="name"
          :header="$t('governorates.name')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="name_ar"
          :header="$t('governorates.name_ar')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.name_ar }}</span>
          </template>
        </Column>

        <Column
          field="prefix"
          :header="$t('governorates.prefix')"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <span class="font-mono">{{ slotProps.data.prefix || "-" }}</span>
          </template>
        </Column>

        <!-- Show country column only when showing all governorates -->
        <Column
          v-if="!country_id"
          field="country"
          :header="$t('governorates.country')"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.country?.name || "-" }}</span>
          </template>
        </Column>

        <!-- Cities Column -->
        <Column :header="$t('governorates.cities')" style="min-width: 150px">
          <template #body="slotProps">
            <Button
              :label="$t('governorates.viewCities')"
              icon="pi pi-building"
              class="p-button-text p-button-sm p-button-info"
              @click="viewCities(slotProps.data)"
              v-tooltip.top="$t('governorates.viewCitiesTooltip')"
            />
          </template>
        </Column>

        <Column
          :header="$t('governorates.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="openUpdateModel(slotProps.data)"
                v-tooltip.top="$t('governorates.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('governorates.delete')"
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
import moduleUrl from "@/constants/moduleUrl";
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "Table",

  mixins: [useTable(), useCrud(), customFunctions],

  props: {
    country_id: {
      type: String,
      default: null,
    },
  },

  directives: {
    tooltip: Tooltip,
  },

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
  computed: {
    propSearchUrl() {
      let url = `${moduleUrl.URLS.GOVERNORATE.propSearchUrl}?paginate=true`;
      if (this.country_id) {
        url += `&country_id=${this.country_id}`;
      }
      return url;
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.GOVERNORATE.propMainUrl,
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
        this.$t("common.itemDeleted"),
        this.$t("common.failedToDeleteItem")
      );
    },
  },
};
</script>

<style scoped></style>
