<!-- src/latest/model/discount/parts/DiscountTable.vue -->
<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("discounts.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('discounts.addDiscount')"
            icon="pi pi-plus"
            @click="createDiscount"
            class="p-button-primary"
          />
        </div>
      </div>

      <!-- Filters Section -->
      <div
        class="table-filters"
      >
        <!-- Search -->
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('discounts.search')"
            @input="handleSearchInput"
            class="search-input w-20rem"
          />
          <i class="pi pi-search search-icon" />
        </div>
        <!-- Type Filter -->
        <Select
          v-model="selectedType"
          :options="discountTypes"
          option-label="name"
          option-value="id"
          :placeholder="$t('discounts.selectType')"
          :loading="loadingTypes"
          :disabled="loadingTypes"
          @change="onTypeChange"
          class="w-15rem"
          show-clear
        />

        <!-- Date Range -->
        <div class="search-container flex-1 w-full">
          <Calendar
            v-model="dateFrom"
            :placeholder="$t('discounts.dateFrom')"
            dateFormat="yy-mm-dd"
            class="w-12rem"
            show-icon
          />
          <Calendar
            v-model="dateTo"
            :placeholder="$t('discounts.dateTo')"
            dateFormat="yy-mm-dd"
            class="w-12rem"
            show-icon
          />
          <Button
            v-if="dateFrom || dateTo"
            icon="pi pi-times"
            class="p-button-text p-button-secondary"
            @click="clearDateFilter"
            v-tooltip="'Clear date filter'"
          />
        </div>

        <!-- Per Page -->
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
        <!-- ID -->
        <Column field="id" :header="$t('discounts.id')" style="min-width: 70px">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <!-- Name -->
        <Column
          field="name"
          :header="$t('discounts.name')"
          :sortable="true"
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

        <!-- Type -->
        <Column
          field="type"
          :header="$t('discounts.type')"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.type.name"
              :severity="getTypeSeverity(slotProps.data.type.prefix)"
            />
          </template>
        </Column>

        <!-- Value -->
        <Column
          field="value"
          :header="$t('discounts.value')"
          :sortable="true"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <div class="text-right font-bold">
              {{ formatValue(slotProps.data) }}
            </div>
          </template>
        </Column>

        <!-- Date Range -->
        <Column :header="$t('discounts.dateRange')" style="min-width: 180px">
          <template #body="slotProps">
            <div class="text-sm">
              <div>{{ formatDate(slotProps.data.date_from) }}</div>
              <div class="text-color-secondary">to</div>
              <div>{{ formatDate(slotProps.data.date_to) }}</div>
            </div>
          </template>
        </Column>

        <!-- Created At -->
        <Column
          field="created_at"
          :header="$t('discounts.createdAt')"
          :sortable="true"
          style="min-width: 130px"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <!-- Actions -->
        <Column
          :header="$t('discounts.actions')"
          :exportable="false"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editDiscountModal(slotProps.data)"
                v-tooltip.top="$t('discounts.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('discounts.delete')"
              />
            </div>
            <!-- View Related Branches Button -->
            <Button
              icon="pi pi-sitemap"
              class="p-button-text p-button-sm p-button-azure"
              @click="openBranchesModal(slotProps.data)"
              v-tooltip.top="$t('discounts.viewBranches')"
            />

            <!-- View Related Products Button -->
            <Button
              icon="pi pi-shopping-bag"
              class="p-button-text p-button-sm p-button-info"
              @click="openFinalProductsModal(slotProps.data)"
              v-tooltip.top="$t('discounts.viewRelatedProducts')"
            />
          </template>
        </Column>
      </DataTable>

      <!-- Empty State -->
      <div v-if="!loading && tableItems.length === 0" class="text-center py-6">
        <i class="pi pi-percentage text-6xl text-color-secondary mb-3"></i>
        <h3 class="text-color-secondary">{{ $t("discounts.noDiscounts") }}</h3>
        <p class="text-color-secondary">
          {{ $t("discounts.createFirstDiscount") }}
        </p>
        <Button
          :label="$t('discounts.addDiscount')"
          icon="pi pi-plus"
          @click="createDiscount"
          class="p-button-primary mt-3"
        />
      </div>

      <!-- Modals -->
      <DiscountCreateModal
        ref="discountCreateModal"
        :company_id="effectiveCompanyId"
        @discount-created="handleDiscountCreated"
      />

      <DiscountEditModal
        ref="discountEditModal"
        :discount="selectedItem"
        :company_id="effectiveCompanyId"
        @discount-updated="handleDiscountUpdated"
      />

      <!-- Add Final Products Modal -->
      <DiscountFinalProductsTableModal
        ref="finalProductsModal"
        :company_id="effectiveCompanyId"
        :discount_id="selectedDiscountForProducts"
        :discount_name="selectedDiscountName"
      />

      <DiscountBranchesTableModal
        ref="branchesModal"
        :company_id="effectiveCompanyId"
        :discount_id="selectedDiscountForBranches"
        :discount_name="selectedDiscountNameForBranches"
      />

      <Toast />
      <ConfirmDialog />
    </div>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";
import Tag from "primevue/tag";

import DiscountCreateModal from "./DiscountCreateModal.vue";
import DiscountEditModal from "./DiscountEditModal.vue";
import DiscountBranchesTableModal from "../branches/parts/DiscountBranchesTableModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";
import DiscountFinalProductsTableModal from "../final_products/parts/DiscountFinalProductsTableModal.vue";

export default {
  name: "DiscountTable",

  components: {
    DiscountCreateModal,
    DiscountEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Calendar,
    Toast,
    ConfirmDialog,
    Tag,
    DiscountFinalProductsTableModal,
    DiscountBranchesTableModal,
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
      selectedType: null,
      dateFrom: null,
      dateTo: null,
      discountTypes: [],
      loadingTypes: false,
      dateFilterTimeout: null,
      selectedDiscountForProducts: null,
      selectedDiscountName: "",
      selectedDiscountForBranches: null,
      selectedDiscountNameForBranches: "",
    };
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) return "";

      let url = `${general_request.BASE_URL}/admin/company/discounts/search/${this.effectiveCompanyId}?paginate=true`;
      const params = [];

      if (this.query_string)
        params.push(`query_string=${encodeURIComponent(this.query_string)}`);
      if (this.selectedType) params.push(`type_id=${this.selectedType}`);
      if (this.dateFrom)
        params.push(`date_from=${this.formatDateForAPI(this.dateFrom)}`);
      if (this.dateTo)
        params.push(`date_to=${this.formatDateForAPI(this.dateTo)}`);

      if (params.length > 0) url += `&${params.join("&")}`;
      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/discount`;
    },
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        if (newCompanyId) {
          this.loadDiscountTypes();
          this.getData();
        }
      },
    },
    dateFrom() {
      this.handleDateFilterChange();
    },
    dateTo() {
      this.handleDateFilterChange();
    },
  },

  mounted() {
    if (this.effectiveCompanyId) {
      this.loadDiscountTypes();
      this.getData();
    }
  },

  methods: {
    getTypeSeverity(prefix) {
      return prefix === "PERCENTAGE" ? "success" : "info";
    },

    formatValue(discount) {
      return discount.type.prefix === "PERCENTAGE"
        ? `${discount.value}%`
        : `$${parseFloat(discount.value).toFixed(2)}`;
    },

    formatDateForAPI(date) {
      return date ? new Date(date).toISOString().split("T")[0] : "";
    },

    handleDateFilterChange() {
      clearTimeout(this.dateFilterTimeout);
      this.dateFilterTimeout = setTimeout(() => {
        this.meta.current_page = 1;
        this.getData();
      }, 500);
    },

    clearDateFilter() {
      this.dateFrom = null;
      this.dateTo = null;
    },

    async loadDiscountTypes() {
      this.loadingTypes = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/16`,
          { headers: general_request.headers }
        );
        this.discountTypes = response.data.data || [];
      } catch (error) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("discounts.loadingTypesError")
        );
      } finally {
        this.loadingTypes = false;
      }
    },

    onTypeChange() {
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

    createDiscount() {
      this.$refs.discountCreateModal.openModal();
    },

    handleDiscountCreated(newDiscount) {
      this.handleItemCreated(newDiscount);
    },

    editDiscountModal(discount) {
      this.selectedItem = { ...discount };
      this.$nextTick(() => {
        this.$refs.discountEditModal.openModal();
      });
    },

    handleDiscountUpdated(updatedDiscount) {
      this.handleItemUpdated(updatedDiscount);
    },

    deleteRow(discount) {
      this.deleteItem(
        discount,
        this.propMainUrl,
        this.$t("discounts.discountDeleted"),
        this.$t("discounts.deleteError")
      );
    },
    openFinalProductsModal(discount) {
      this.selectedDiscountForProducts = discount.id;
      this.selectedDiscountName = discount.name;
      this.$nextTick(() => {
        this.$refs.finalProductsModal.openModal();
      });
    },
    openBranchesModal(discount) {
      this.selectedDiscountForBranches = discount.id;
      this.selectedDiscountNameForBranches = discount.name;
      this.$nextTick(() => {
        if (
          this.$refs.branchesModal &&
          typeof this.$refs.branchesModal.openModal === "function"
        ) {
          this.$refs.branchesModal.openModal();
        }
      });
    },
  },
};
</script>

<style scoped></style>
