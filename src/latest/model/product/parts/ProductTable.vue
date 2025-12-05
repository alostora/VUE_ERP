<template>
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("products.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('products.addProduct')"
        icon="pi pi-plus"
        @click="createProduct"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <!-- Search Input -->
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('products.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <!-- Category Filter -->
      <Select
        v-model="selectedCategory"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        :placeholder="$t('products.filterByCategory')"
        :loading="loadingCategories"
        :disabled="loadingCategories"
        @change="onCategoryChange"
        class="w-15rem"
        showClear
        clearIcon="pi pi-times"
      />

      <!-- Items Per Page -->
      <Select
        v-model="per_page"
        :options="perPageOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('products.show')"
        @change="handlePerPageChange"
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
      class="p-datatable-sm table-scroll-container"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- ID Column -->
      <Column field="id" :header="$t('products.id')" style="min-width: 80px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('products.name')"
        sortable
        style="min-width: 120px"
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

      <!-- Category Column -->
      <Column
        field="category"
        :header="$t('products.category')"
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

      <!-- Purchases Unit Column -->
      <Column
        field="purchases_measurement_unit"
        :header="$t('products.purchasesUnit')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{
            slotProps.data.purchases_measurement_unit?.name || "-"
          }}</span>
        </template>
      </Column>

      <!-- Sales Unit Column -->
      <Column
        field="sales_measurement_unit"
        :header="$t('products.salesUnit')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.sales_measurement_unit?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Details Column -->
      <Column
        field="details"
        :header="$t('products.details')"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <div>
            <div class="text-color-secondary">
              {{ slotProps.data.details || "-" }}
            </div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.details_ar || "" }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('products.createdAt')"
        sortable
        style="min-width: 120px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('products.actions')"
        :exportable="false"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editProductModal(slotProps.data)"
              v-tooltip.top="$t('products.editProduct')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('products.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Empty State -->
    <div v-if="!loading && tableItems.length === 0" class="text-center py-6">
      <i class="pi pi-inbox text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">{{ $t("products.noProducts") }}</h3>
      <p class="text-color-secondary">
        {{ $t("products.createFirstProduct") }}
      </p>
      <Button
        :label="$t('products.addProduct')"
        icon="pi pi-plus"
        @click="createProduct"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Product Modal -->
    <ProductCreateModal
      ref="productCreateModal"
      :company_id="effectiveCompanyId"
      @product-created="handleProductCreated"
    />

    <!-- Edit Product Modal -->
    <ProductEditModal
      ref="productEditModal"
      :product="selectedItem"
      :company_id="effectiveCompanyId"
      @product-updated="handleProductUpdated"
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

import ProductCreateModal from "./ProductCreateModal.vue";
import ProductEditModal from "./ProductEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "ProductTable",

  components: {
    ProductCreateModal,
    ProductEditModal,
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

  data() {
    return {
      selectedCategory: null,
      categories: [],
      loadingCategories: false,
    };
  },

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        return "";
      }

      let url = `${general_request.BASE_URL}/admin/company/products/search/${this.effectiveCompanyId}?paginate=true`;

      // Add search query if exists
      if (this.query_string) {
        url += `&query_string=${encodeURIComponent(this.query_string)}`;
      }

      // Add category filter if selected
      if (this.selectedCategory) {
        url += `&category_id=${this.selectedCategory}`;
      }

      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product`;
    },
  },

  mounted() {
    if (this.effectiveCompanyId) {
      this.loadCategories();
      this.getData();
    } else {
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        if (newCompanyId) {
          this.loadCategories();
          this.getData();
        }
      },
    },
  },

  methods: {
    async loadCategories() {
      this.loadingCategories = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/categories/search/${this.effectiveCompanyId}`;

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        this.categories = response.data.data || [];
      } catch (error) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("products.fetchError")
        );
      } finally {
        this.loadingCategories = false;
      }
    },

    onCategoryChange() {
      this.meta.current_page = 1;
      this.getData();
    },

    handleSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.meta.current_page = 1;
        this.getData();
      }, 500);
    },

    handlePageChange(event) {
      this.per_page = event.rows;
      this.meta.current_page = event.page + 1;
      this.getData();
    },

    handlePerPageChange() {
      this.meta.current_page = 1;
      this.getData();
    },

    createProduct() {
      this.$refs.productCreateModal.openModal();
    },

    handleProductCreated(newProduct) {
      this.handleItemCreated(newProduct);
    },

    editProductModal(product) {
      this.selectedItem = { ...product };
      this.$nextTick(() => {
        this.$refs.productEditModal.openModal();
      });
    },

    handleProductUpdated(updatedProduct) {
      this.handleItemUpdated(updatedProduct);
    },

    deleteRow(product) {
      this.deleteItem(
        product,
        this.propMainUrl,
        this.$t("products.productDeleted"),
        this.$t("products.deleteError")
      );
    },
  },
};
</script>

<style scoped></style>
