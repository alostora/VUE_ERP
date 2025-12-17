<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("categories.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('categories.addCategory')"
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
            :placeholder="$t('categories.search')"
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
          :placeholder="$t('categories.show')"
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
        <Column field="id" :header="$t('categories.id')" class="col-identifier">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column field="file" :header="$t('categories.image')" class="col-image">
          <template #body="slotProps">
            <img
              v-if="slotProps.data.file"
              :src="slotProps.data.file.file_path"
              :alt="slotProps.data.name"
              class="img-40 object-cover rounded"
            />
            <span v-else>-</span>
          </template>
        </Column>

        <Column
          field="name"
          :header="$t('categories.name')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="name_ar"
          :header="$t('categories.nameAr')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name_ar }}</span>
          </template>
        </Column>

        <Column
          field="created_at"
          :header="$t('categories.createdAt')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          :header="$t('categories.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editCategoryModal(slotProps.data)"
                v-tooltip.top="$t('categories.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('categories.delete')"
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
      let url = `${moduleUrl.URLS.CATEGORY.propSearchUrl}/${this.companyId}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      propMainUrl: moduleUrl.URLS.CATEGORY.propMainUrl,
    };
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
