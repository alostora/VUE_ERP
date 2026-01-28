<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("taxes.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('taxes.add')"
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

        <Column
          :header="$t('taxes.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
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
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="openUpdateModel(slotProps.data)"
                v-tooltip.top="$t('taxes.edit')"
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
      let url = `${moduleUrl.URLS.TAX.propSearchUrl}/${this.companyId}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      propMainUrl: moduleUrl.URLS.TAX.propMainUrl,
      propSetActiveUrl: moduleUrl.URLS.TAX.propSetActiveUrl,
      propSetInactiveUrl: moduleUrl.URLS.TAX.propSetInactiveUrl,
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
        this.$t("common.failedToDeleteItem"),
      );
    },

    /**
     * Set tax as active
     */
    async setActive(tax) {
      this.loading = true;
      this.error = "";

      await this.updateItem(tax.id, {}, this.propSetActiveUrl);

      this.tableItems = this.tableItems.map((item) => ({
        ...item,
        is_active: item.id === tax.id,
      }));
    },

    async setInactive(tax) {
      this.loading = true;
      this.error = "";

      await this.updateItem(tax.id, {}, this.propSetActiveUrl);

      this.tableItems = this.tableItems.map((item) => ({
        ...item,
        is_active: item.id === tax.id ? false : item.is_active,
      }));
    },
  },
};
</script>

<style scoped></style>
