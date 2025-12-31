<template>
  <Dialog
    :header="this.$t('final_product_variants.table')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="table-page">
      <div class="table-wrapper">
        <div class="table-header">
          <h1 class="table-title">{{ $t("final_product_variants.title") }}</h1>
          <div class="table-actions">
            <Button
              :label="$t('final_product_variants.add')"
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
              :placeholder="$t('final_product_variants.search')"
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
            :placeholder="$t('final_product_variants.show')"
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
          <Column
            field="id"
            :header="$t('final_product_variants.id')"
            class="col-identifier"
          >
            <template #body="slotProps">
              <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
            </template>
          </Column>

          <!-- name Column -->
          <Column
            field="name"
            :header="$t('final_product.name')"
            :sortable="true"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              <div>
                <div class="font-medium">
                  {{ slotProps.data.variant?.name || "-" }}
                </div>
                <div class="text-sm text-color-secondary">
                  {{ slotProps.data.variant?.name_ar || "-" }}
                </div>
              </div>
            </template>
          </Column>
          <!-- value Column -->
          <Column
            field="value"
            :header="$t('final_product.value')"
            :sortable="true"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              <div>
                <div class="font-medium">
                  {{ slotProps.data.variant_value?.value || "-" }}
                </div>
                <div class="text-sm text-color-secondary">
                  {{ slotProps.data.variant_value?.value_ar || "-" }}
                </div>
              </div>
            </template>
          </Column>

          <!-- Created At Column -->
          <Column
            field="created_at"
            :header="$t('final_product_variants.createdAt')"
            sortable
            class="col-name"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>

          <Column
            :header="$t('final_product_variants.actions')"
            :exportable="false"
            class="col-actions"
          >
            <template #body="slotProps">
              <div class="table-actions-cell">
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm p-button-danger"
                  @click="deleteRow(slotProps.data)"
                  v-tooltip.top="$t('final_product_variants.delete')"
                />
              </div>
            </template>
          </Column>
        </DataTable>

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
          this.final_product_id = selectedItem.id;
          this.$nextTick(() => {
            this.getData(this.propSearchUrl);
          });
        }
      },
    },
  },

  computed: {
    propSearchUrl() {
      let url = `${moduleUrl.URLS.FINAL_PRODUCT_VARIANT.propSearchUrl}/${this.final_product_id}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      final_product_id: null,
      propMainUrl: moduleUrl.URLS.FINAL_PRODUCT_VARIANT.propMainUrl,
    };
  },

  methods: {
    openCreateModel(item) {
      console.log("itemitemitemitemitemitemitemitemitemitem", item);

      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.createModalForm.openModal();
      });
    },

    handleCreated(newItem) {
      this.handleItemCreated(newItem);
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
