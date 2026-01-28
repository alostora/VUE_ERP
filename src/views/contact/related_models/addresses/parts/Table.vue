<template>
  <Dialog
    :header="this.$t('contacts.table')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="table-page">
      <div class="table-wrapper">
        <div class="table-header">
          <h1 class="table-title">{{ $t("contacts.title") }}</h1>
          <div class="table-actions">
            <Button
              :label="$t('contacts.add')"
              icon="pi pi-plus"
              @click="openCreateModel(this.$props.selected_item)"
              class="p-button-primary"
            />
          </div>
        </div>

        <div class="table-filters">
          <div class="search-container flex-1 w-full">
            <InputText
              v-model="query_string"
              :placeholder="$t('contacts.search')"
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
            :placeholder="$t('contacts.show')"
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
          <Column field="address" :header="$t('contacts.address')" />
          <Column field="is_default" :header="$t('contacts.isDefault')">
            <template #body="slotProps">{{
              slotProps.data.is_default ? $t("common.yes") : $t("common.no")
            }}</template>
          </Column>

          <Column
            field="created_at"
            :header="$t('contacts.createdAt')"
            sortable
            class="col-name"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>

          <Column
            :header="$t('contacts.actions')"
            :exportable="false"
            class="col-actions"
          >
            <template #body="slotProps">
              <div class="table-actions-cell">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm p-button-primary"
                  @click="openUpdateModel(slotProps.data)"
                  v-tooltip.top="$t('contacts.edit')"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm p-button-danger"
                  @click="deleteRow(slotProps.data)"
                  v-tooltip.top="$t('contacts.delete')"
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

        <CreateForm
          ref="createModalForm"
          :selected_item="selectedItem"
          @created="handleCreated"
        />

        <Toast />
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
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
    Dialog,
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
    selected_item: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    selected_item: {
      immediate: true,
      deep: true,
      handler(selectedItem) {
        if (selectedItem && selectedItem.id) {
          this.companyId = selectedItem.company_id;
          this.contact_id = selectedItem.id;
          this.$nextTick(() => {
            this.getData(this.propSearchUrl);
          });
        }
      },
    },
  },

  computed: {
    propSearchUrl() {
      let url = `${moduleUrl.URLS.CONTACT_ADDRESS.propSearchUrl}/${this.contact_id}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      propMainUrl: moduleUrl.URLS.CONTACT_ADDRESS.propMainUrl,
    };
  },

  methods: {
    openCreateModel(item) {
      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.createModalForm.openModal();
      });
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
  },
};
</script>

<style scoped></style>
