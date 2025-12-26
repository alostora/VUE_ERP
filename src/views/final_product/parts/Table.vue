<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("final_products.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('final_products.add')"
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
            :placeholder="$t('final_products.search')"
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
          :placeholder="$t('final_products.show')"
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
          :header="$t('final_products.id')"
          class="col-identifier"
        >
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <!-- Image Column -->
        <Column
          field="main_image"
          :header="$t('final_product.image')"
          style="min-width: 80px"
        >
          <template #body="slotProps">
            <img
              v-if="slotProps.data.main_image"
              :src="slotProps.data.main_image.file.file_path"
              :alt="slotProps.data.name"
              class="img-40 object-cover rounded"
            />
            <div v-else class="no-image-placeholder">
              <i class="pi pi-image text-color-secondary"></i>
            </div>
          </template>
        </Column>

        <!-- Name Column -->
        <Column
          field="name"
          :header="$t('final_product.name')"
          :sortable="true"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div>
              <div class="font-medium">
                {{ slotProps.data.name || slotProps.data.product?.name }}
              </div>
              <div class="text-sm text-color-secondary">
                {{ slotProps.data.name_ar || slotProps.data.product?.name_ar }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Details Column -->
        <Column
          field="details"
          :header="$t('final_product.details')"
          :sortable="true"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div>
              <div class="font-medium">
                {{ slotProps.data.details || slotProps.data.product?.details }}
              </div>
              <div class="text-sm text-color-secondary">
                {{
                  slotProps.data.details_ar ||
                  slotProps.data.product?.details_ar
                }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Category Column -->
        <Column
          field="category"
          :header="$t('final_product.category')"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <img
                v-if="slotProps.data.category?.file"
                :src="slotProps.data.category.file.file_path"
                :alt="slotProps.data.category.name"
                class="img-40 object-cover rounded"
              />
              <span>{{ slotProps.data.category?.name || "-" }}</span>
            </div>
          </template>
        </Column>

        <!-- Product Column -->
        <Column
          field="product"
          :header="$t('final_product.product')"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.product?.name || "-" }}</span>
          </template>
        </Column>

        <!-- Variants Column -->
        <Column
          field="variants"
          :header="$t('final_product.variants')"
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div v-if="slotProps.data.final_product_variant_values?.length">
              <Chip
                v-for="variant in slotProps.data.final_product_variant_values"
                :key="variant.id"
                :label="getVariantLabel(variant)"
                class="mr-1 mb-1 text-xs"
              />
            </div>
            <span v-else>-</span>
          </template>
        </Column>

        <!-- Price Column -->
        <Column
          field="price"
          :header="$t('final_product.price')"
          :sortable="true"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <div class="text-right">
              <div class="font-bold">
                {{ formatCurrency(slotProps.data.price) }}
              </div>
              <div
                v-if="slotProps.data.has_discount"
                class="text-sm text-green-500"
              >
                {{ formatCurrency(slotProps.data.price_after_discount) }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Created At Column -->
        <Column
          field="created_at"
          :header="$t('final_products.createdAt')"
          sortable
          class="col-name"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          :header="$t('final_products.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="openUpdateModel(slotProps.data)"
                v-tooltip.top="$t('final_products.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('final_products.delete')"
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
      let url = `${moduleUrl.URLS.FINAL_PRODUCT.propSearchUrl}/${this.companyId}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      propMainUrl: moduleUrl.URLS.FINAL_PRODUCT.propMainUrl,
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
