<template>
  <div class="pos-products-panel">
    <!-- Search and Filter Bar -->
    <div class="products-filter-bar mb-3 p-3 surface-50 border-round">
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
              <i class="pi pi-search"></i>
            </span>
            <InputText
              v-model="search"
              :placeholder="$t('pos.searchProducts')"
              @input="handleSearch"
              class="w-full"
            />
            <Button
              v-if="search"
              icon="pi pi-times"
              @click="clearSearch"
              class="p-button-text"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
              <i class="pi pi-filter"></i>
            </span>
            <Dropdown
              v-model="selectedCategoryId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('pos.allCategories')"
              @change="handleCategoryChange"
              class="w-full"
              showClear
            />
          </div>
        </div>
      </div>

      <!-- Barcode Input -->
      <div class="mt-2">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-barcode"></i>
          </span>
          <InputText
            v-model="barcode"
            :placeholder="$t('pos.scanBarcode')"
            @keyup.enter="searchByBarcode"
            class="w-full"
          />
          <Button
            :label="$t('pos.scan')"
            @click="searchByBarcode"
            class="p-button-primary"
          />
        </div>
      </div>
    </div>

    <!-- Categories Quick Filter -->
    <div class="categories-scroll mb-3">
      <div class="flex flex-wrap gap-2">
        <Button
          :label="$t('pos.all')"
          :severity="!selectedCategoryId ? 'primary' : 'secondary'"
          @click="selectCategory(null)"
          class="p-button-sm"
        />
        <Button
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :severity="
            selectedCategoryId === category.id ? 'primary' : 'secondary'
          "
          @click="selectCategory(category.id)"
          class="p-button-sm"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="products-grid">
      <div class="grid">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-6 md:col-4 lg:col-3 xl:col-2"
        >
          <PosProductCard
            :product="product"
            @add-to-cart="$emit('add-to-cart', product)"
            @view-details="showProductDetails(product)"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="pagination mt-3 flex justify-content-center"
      >
        <Paginator
          v-model="currentPage"
          :rows="productsPerPage"
          :totalRecords="filteredProducts.length"
          :rowsPerPageOptions="[12, 24, 48, 96]"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-6">
      <i class="pi pi-box text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("pos.noProductsFound") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("pos.tryDifferentSearch") }}
      </p>
    </div>

    <!-- Product Details Modal -->
    <Dialog
      v-model:visible="showDetailsModal"
      :header="selectedProduct?.name"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div v-if="selectedProduct" class="product-details">
        <div class="text-center mb-3">
          <img
            v-if="selectedProduct.main_image?.file?.file_path"
            :src="selectedProduct.main_image.file.file_path"
            :alt="selectedProduct.name"
            class="product-detail-image border-round"
          />
          <div v-else class="no-image-placeholder">
            <i class="pi pi-image text-6xl text-color-secondary"></i>
          </div>
        </div>

        <div class="grid">
          <div class="col-12">
            <h3>{{ selectedProduct.name }}</h3>
            <p class="text-color-secondary">{{ selectedProduct.name_ar }}</p>
          </div>

          <div class="col-6">
            <strong>{{ $t("pos.price") }}:</strong>
            <div class="flex align-items-center gap-2 mt-1">
              <span
                v-if="selectedProduct.has_discount"
                class="original-price text-line-through text-color-secondary"
              >
                {{ formatCurrency(selectedProduct.price) }}
              </span>
              <span
                :class="[
                  'current-price',
                  { 'text-green-500 font-bold': selectedProduct.has_discount },
                ]"
              >
                {{
                  formatCurrency(
                    selectedProduct.price_after_discount ||
                      selectedProduct.price
                  )
                }}
              </span>
              <Tag
                v-if="selectedProduct.has_discount"
                :value="`-${selectedProduct.discount_value}%`"
                severity="danger"
                class="ml-2"
              />
            </div>
          </div>

          <div class="col-6">
            <strong>{{ $t("pos.stock") }}:</strong>
            <div class="mt-1">
              <Tag
                :value="selectedProduct.stock || 'N/A'"
                :severity="getStockSeverity(selectedProduct.stock)"
              />
            </div>
          </div>

          <div class="col-12 mt-2">
            <strong>{{ $t("pos.category") }}:</strong>
            <p>{{ selectedProduct.category?.name }}</p>
          </div>

          <div v-if="selectedProduct.details" class="col-12 mt-2">
            <strong>{{ $t("pos.description") }}:</strong>
            <p>{{ selectedProduct.details }}</p>
          </div>

          <div
            v-if="selectedProduct.final_product_variant_values?.length > 0"
            class="col-12 mt-2"
          >
            <strong>{{ $t("pos.variants") }}:</strong>
            <div class="flex flex-wrap gap-2 mt-1">
              <Chip
                v-for="variant in selectedProduct.final_product_variant_values"
                :key="variant.id"
                :label="`${variant.variant?.name}: ${variant.variant_value?.value}`"
                class="mr-2 mb-2"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          :label="$t('pos.addToCart')"
          icon="pi pi-cart-plus"
          @click="addSelectedToCart"
          class="p-button-primary"
        />
        <Button
          :label="$t('common.close')"
          @click="showDetailsModal = false"
          class="p-button-text"
        />
      </template>
    </Dialog>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("pos.loadingProducts") }}</p>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Chip from "primevue/chip";
import Paginator from "primevue/paginator";
import ProgressSpinner from "primevue/progressspinner";

import PosProductCard from "./PosProductCard.vue";
import PosService from "./PosService.js";

export default {
  name: "PosProductsPanel",
  components: {
    InputText,
    Button,
    Dropdown,
    Dialog,
    Tag,
    Chip,
    Paginator,
    ProgressSpinner,
    PosProductCard,
  },
  props: {
    companyId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
    selectedCategory: {
      type: String,
      default: null,
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // Products
      products: [],
      filteredProducts: [],
      selectedProduct: null,

      // Categories
      categories: [],
      selectedCategoryId: null,

      // Search
      search: "",
      barcode: "",

      // Pagination
      currentPage: 1,
      productsPerPage: 12,

      // Modals
      showDetailsModal: false,

      // Loading
      loading: false,

      // Service
      posService: null,
    };
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
  },
  watch: {
    selectedCategory: {
      immediate: true,
      handler(newVal) {
        this.selectedCategoryId = newVal;
      },
    },
    searchQuery: {
      immediate: true,
      handler(newVal) {
        this.search = newVal;
      },
    },
  },
  created() {
    this.posService = new PosService(this.companyId, this.branchId);
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // Load categories
        // TODO: Replace with real API
        this.categories = this.posService.getDummyCategories();

        // Load products
        // TODO: Replace with real API
        this.products = this.posService.getDummyProducts();
        this.filteredProducts = [...this.products];
      } catch (error) {
        console.error("Error loading products:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.loadError"),
          detail: this.$t("pos.failedToLoadProducts"),
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    filterProducts() {
      let filtered = [...this.products];

      // Filter by category
      if (this.selectedCategoryId) {
        filtered = filtered.filter(
          (product) => product.category?.id === this.selectedCategoryId
        );
      }

      // Filter by search
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.name_ar?.toLowerCase().includes(searchLower) ||
            product.details?.toLowerCase().includes(searchLower)
        );
      }

      this.filteredProducts = filtered;
      this.currentPage = 1; // Reset to first page on filter change
    },

    handleSearch() {
      this.filterProducts();
      this.$emit("search", this.search);
    },

    clearSearch() {
      this.search = "";
      this.filterProducts();
      this.$emit("search", "");
    },

    handleCategoryChange() {
      this.filterProducts();
      this.$emit("category-change", this.selectedCategoryId);
    },

    selectCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.handleCategoryChange();
    },

    searchByBarcode() {
      if (!this.barcode.trim()) return;

      // TODO: Implement barcode search with API
      console.log("Searching by barcode:", this.barcode);

      // For now, simulate search
      const product = this.products.find(
        (p) =>
          p.id.toLowerCase().includes(this.barcode.toLowerCase()) ||
          p.name.toLowerCase().includes(this.barcode.toLowerCase())
      );

      if (product) {
        this.showProductDetails(product);
      } else {
        this.$toast.add({
          severity: "warn",
          summary: this.$t("pos.productNotFound"),
          detail: this.$t("pos.noProductWithBarcode"),
          life: 3000,
        });
      }

      this.barcode = "";
    },

    showProductDetails(product) {
      this.selectedProduct = product;
      this.showDetailsModal = true;
    },

    addSelectedToCart() {
      if (this.selectedProduct) {
        this.$emit("add-to-cart", this.selectedProduct);
        this.showDetailsModal = false;
      }
    },

    onPageChange(event) {
      this.currentPage = event.page + 1;
    },

    formatCurrency(amount) {
      // TODO: Use actual currency from company settings
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    getStockSeverity(stock) {
      if (!stock || stock <= 0) return "danger";
      if (stock <= 10) return "warning";
      return "success";
    },
  },
};
</script>

<style scoped>
.pos-products-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.products-filter-bar {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.categories-scroll {
  overflow-x: auto;
  padding-bottom: 5px;
}

.categories-scroll::-webkit-scrollbar {
  height: 4px;
}

.categories-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.categories-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.products-grid {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.products-grid::-webkit-scrollbar {
  width: 6px;
}

.products-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.products-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.product-detail-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
}

.no-image-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  margin: 0 auto;
}

.original-price {
  font-size: 0.9rem;
  color: #6c757d;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #28a745;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

:deep(.p-button.p-button-sm) {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}
</style>
