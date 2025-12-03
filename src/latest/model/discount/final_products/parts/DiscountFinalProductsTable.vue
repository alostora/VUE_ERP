<template>
  <div class="discount-final-products-table">
    <!-- Action Bar -->
    <div class="flex justify-content-between align-items-center mb-4">
      <h3 class="m-0">{{ $t("discounts.finalProducts") }}</h3>
      <Button
        :label="$t('discounts.addFinalProducts')"
        icon="pi pi-plus"
        @click="openCreateModal"
        class="p-button-primary p-button-sm"
      />
    </div>

    <!-- Search and Filters -->
    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('discounts.searchProducts')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <Select
        v-model="per_page"
        :options="perPageOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('discounts.show')"
        @change="handlePerPageChange"
        class="w-10rem"
      />
    </div>

    <!-- Data Table -->
    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50]"
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
      <Column field="id" :header="$t('discounts.id')" style="min-width: 70px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Product Name Column -->
      <Column :header="$t('discounts.productName')" style="min-width: 200px">
        <template #body="slotProps">
          <div>
            <div class="font-medium">
              {{ slotProps.data.final_product.name }}
            </div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.final_product.name_ar }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Category Column -->
      <Column :header="$t('discounts.category')" style="min-width: 150px">
        <template #body="slotProps">
          <div>
            <div class="font-medium">
              {{ slotProps.data.final_product.category?.name || "-" }}
            </div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.final_product.category?.name_ar || "-" }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('discounts.createdAt')"
        style="min-width: 130px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('discounts.actions')"
        :exportable="false"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-text p-button-sm"
            @click="deleteFinalProduct(slotProps.data)"
            v-tooltip.top="$t('discounts.delete')"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Empty State -->
    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-shopping-bag text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("discounts.noFinalProducts") }}
      </h3>
      <p class="text-color-secondary mb-4">
        {{ $t("discounts.addFirstFinalProduct") }}
      </p>
      <Button
        :label="$t('discounts.addFinalProducts')"
        icon="pi pi-plus"
        @click="openCreateModal"
        class="p-button-primary"
      />
    </div>

    <!-- Create Modal -->
    <DiscountFinalProductCreateModal
      ref="createModal"
      :discount_id="discount_id"
      :company_id="company_id"
      @final-products-added="handleFinalProductsAdded"
    />

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

// Components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

// Modals
import DiscountFinalProductCreateModal from "./DiscountFinalProductCreateModal.vue";

export default {
  name: "DiscountFinalProductsTable",
  components: {
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
    DiscountFinalProductCreateModal,
  },
  directives: {
    tooltip: Tooltip,
  },
  mixins: [useTable(), useCrud()],
  props: {
    company_id: {
      type: String,
      required: true,
    },
    discount_id: {
      type: String,
      required: true,
    },
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/discount-final-products/search/${this.discount_id}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/discount-final-product`;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    openCreateModal() {
      this.$refs.createModal.openModal();
    },

    handleFinalProductsAdded(newProducts) {
      if (Array.isArray(newProducts)) {
        newProducts.forEach((product) => {
          this.tableItems.unshift(product);
        });
        this.meta.total += newProducts.length;
      }

      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("discounts.finalProductsAdded")
      );
    },

    deleteFinalProduct(discountProduct) {
      this.deleteItem(
        discountProduct,
        this.propMainUrl,
        this.$t("final_product_variants.variantDeleted"),
        this.$t("final_product_variants.deleteError")
      );
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

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return dateString;
      }
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
  },
};
</script>

<style scoped>
.discount-final-products-table {
  height: 100%;
  display: flex;
  flex-direction: column;
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

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
  padding: 2rem;
}

:deep(.p-datatable) {
  flex: 1;
}
</style>
