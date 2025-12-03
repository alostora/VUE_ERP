<template>
  <div class="final-product-table-page">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("final_product.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('final_product.addFinalProduct')"
        icon="pi pi-plus"
        @click="createFinalProduct"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <!-- Search Input -->
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('final_product.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <!-- Category Filter -->
      <Select
        v-model="selectedCategory"
        :options="categories"
        option-label="name"
        option-value="id"
        :placeholder="$t('final_product.selectCategory')"
        :loading="loadingCategories"
        :disabled="loadingCategories"
        @change="onCategoryChange"
        class="w-15rem"
        show-clear
        clear-icon="pi pi-times"
      />

      <!-- Product Filter -->
      <Select
        v-model="selectedProduct"
        :options="filteredProducts"
        option-label="name"
        option-value="id"
        :placeholder="$t('final_product.selectProduct')"
        :loading="loadingProducts"
        :disabled="loadingProducts"
        @change="onProductChange"
        class="w-15rem"
        show-clear
        clear-icon="pi pi-times"
      />

      <!-- Items Per Page -->
      <Select
        v-model="per_page"
        :options="perPageOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('final_product.show')"
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
      <Column
        field="id"
        :header="$t('final_product.id')"
        style="min-width: 80px"
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
            class="product-image"
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
              class="category-image"
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
        :header="$t('final_product.createdAt')"
        :sortable="true"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <!-- Actions Column -->
      <Column
        :header="$t('final_product.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editFinalProductModal(slotProps.data)"
              v-tooltip.top="$t('final_product.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('final_product.delete')"
            />
            <Button
              icon="pi pi-palette"
              class="p-button-text p-button-sm p-button-info"
              @click="openVariantsModal(slotProps.data)"
              v-tooltip.top="'Manage Variants'"
            />
            <!-- Add Images Button -->
            <Button
              icon="pi pi-images"
              class="p-button-text p-button-sm p-button-help"
              @click="openImagesModal(slotProps.data)"
              v-tooltip.top="'Manage Images'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Empty State -->
    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-inbox text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("final_product.noFinalProducts") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("final_product.createFirstFinalProduct") }}
      </p>
      <Button
        :label="$t('final_product.addFinalProduct')"
        icon="pi pi-plus"
        @click="createFinalProduct"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Final Product Modal -->
    <FinalProductCreateModal
      ref="finalProductCreateModal"
      :company_id="effectiveCompanyId"
      @final-product-created="handleFinalProductCreated"
    />

    <!-- Edit Final Product Modal -->
    <FinalProductEditModal
      ref="finalProductEditModal"
      :final-product="selectedItem"
      :company_id="effectiveCompanyId"
      @final-product-updated="handleFinalProductUpdated"
    />

    <!-- Variants Modal -->
    <FinalProductVariantTableModal
      ref="variantsModal"
      :company_id="effectiveCompanyId"
      :final_product_id="selectedFinalProductId"
      :final_product_name="selectedFinalProductName"
    />

    <FinalProductImageTableModal
      ref="imagesModal"
      :company_id="effectiveCompanyId"
      :final_product_id="selectedFinalProductId"
      :final_product_name="selectedFinalProductName"
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
import Chip from "primevue/chip";

import FinalProductCreateModal from "./FinalProductCreateModal.vue";
import FinalProductEditModal from "./FinalProductEditModal.vue";
import FinalProductVariantTableModal from "../variants/parts/FinalProductVariantTableModal.vue";
import FinalProductImageTableModal from "../images/parts/FinalProductImageTableModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductTable",

  components: {
    FinalProductCreateModal,
    FinalProductEditModal,
    FinalProductVariantTableModal,
    FinalProductImageTableModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
    Chip,
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
      selectedProduct: null,
      categories: [],
      allProducts: [],
      loadingCategories: false,
      loadingProducts: false,
      searchTimeout: null,
      selectedFinalProductId: null,
      selectedFinalProductName: null,
    };
  },

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        console.error("No company ID found!");
        return "";
      }

      let url = `${general_request.BASE_URL}/admin/company/product/company-final-products/search/${this.effectiveCompanyId}?paginate=true`;

      const params = [];
      if (this.selectedCategory) {
        params.push(`category_id=${this.selectedCategory}`);
      }
      if (this.selectedProduct) {
        params.push(`product_id=${this.selectedProduct}`);
      }
      if (this.query_string) {
        params.push(`query_string=${encodeURIComponent(this.query_string)}`);
      }

      if (params.length > 0) {
        url += `&${params.join("&")}`;
      }

      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product`;
    },

    filteredProducts() {
      if (this.selectedCategory) {
        return this.allProducts.filter(
          (product) => product.category_id === this.selectedCategory
        );
      }
      return this.allProducts;
    },
  },

  mounted() {
    if (this.effectiveCompanyId) {
      this.loadCategories();
      this.loadAllProducts();
      this.getData();
    } else {
      console.error("No company ID found!");
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        if (newCompanyId) {
          this.loadCategories();
          this.loadAllProducts();
          this.getData();
        }
      },
    },
  },

  methods: {
    getVariantLabel(variant) {
      return `${variant.variant.name}: ${variant.variant_value.value}`;
    },

    async loadCategories() {
      this.loadingCategories = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/categories/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.categories = response.data.data || [];
      } catch (error) {
        console.error("Error loading categories:", error);
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product.loadingCategoriesError")
        );
      } finally {
        this.loadingCategories = false;
      }
    },

    async loadAllProducts() {
      this.loadingProducts = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/products/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.allProducts = response.data.data || [];
        console.log("📦 Loaded all products:", this.allProducts.length);
      } catch (error) {
        console.error("Error loading products:", error);
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product.loadingProductsError")
        );
      } finally {
        this.loadingProducts = false;
      }
    },

    onCategoryChange() {
      this.selectedProduct = null;
      this.meta.current_page = 1;
      this.getData();
    },

    onProductChange() {
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

    createFinalProduct() {
      this.$refs.finalProductCreateModal.openModal();
    },

    handleFinalProductCreated(newFinalProduct) {
      this.handleItemCreated(newFinalProduct);
    },

    editFinalProductModal(finalProduct) {
      this.selectedItem = { ...finalProduct };
      this.$nextTick(() => {
        this.$refs.finalProductEditModal.openModal();
      });
    },

    handleFinalProductUpdated(updatedFinalProduct) {
      this.handleItemUpdated(updatedFinalProduct);
    },

    deleteRow(finalProduct) {
      this.deleteItem(
        finalProduct,
        this.propMainUrl,
        this.$t("final_product.finalProductDeleted"),
        this.$t("final_product.deleteError")
      );
    },

    openVariantsModal(finalProduct) {
      this.selectedFinalProductId = finalProduct.id;
      this.selectedFinalProductName = finalProduct.name;
      this.$refs.variantsModal.openModal();
    },

    openImagesModal(finalProduct) {
      this.selectedFinalProductId = finalProduct.id;
      this.selectedFinalProductName = finalProduct.name;
      // this.$refs.imagesModal.openModal();
    },

    formatCurrency(amount) {
      if (!amount) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },

    openImagesModal(finalProduct) {
      this.selectedFinalProductId = finalProduct.id;
      this.selectedFinalProductName = finalProduct.name;
      this.$refs.imagesModal.openModal();
    },
  },
};
</script>

<style scoped>
.final-product-table-page {
  padding: 1rem;
}

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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.no-image-placeholder {
  width: 50px;
  height: 50px;
  background: var(--surface-ground);
  border: 1px dashed var(--surface-border);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--surface-border);
}

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
