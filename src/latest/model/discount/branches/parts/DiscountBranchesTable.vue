<template>
  <div class="discount-branches-table">
    <div class="flex justify-content-between align-items-center mb-4">
      <h3 class="m-0">{{ $t("discounts.branches") }}</h3>
      <Button
        :label="$t('discounts.addBranches')"
        icon="pi pi-plus"
        @click="$emit('open-create-modal')"
        class="p-button-primary p-button-sm"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('discounts.searchBranches')"
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

    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5,10,25,50]"
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
      <Column field="id" :header="$t('discounts.id')" style="min-width:70px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column :header="$t('discounts.branchName')" style="min-width:200px">
        <template #body="slotProps">
          <div>
            <div class="font-medium">{{ slotProps.data.branch?.name || '-' }}</div>
            <div class="text-sm text-color-secondary">{{ slotProps.data.branch?.name_ar || '-' }}</div>
          </div>
        </template>
      </Column>

      <Column field="created_at" :header="$t('discounts.createdAt')" style="min-width:130px">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <Column :header="$t('discounts.actions')" :exportable="false" style="min-width:100px">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-text p-button-sm"
            @click="deleteDiscountBranch(slotProps.data)"
            v-tooltip.top="$t('discounts.delete')"
          />
        </template>
      </Column>
    </DataTable>

    <div v-if="!loading && tableItems.length === 0" class="empty-state text-center py-6">
      <i class="pi pi-sitemap text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">{{ $t('discounts.noBranches') }}</h3>
      <p class="text-color-secondary mb-4">{{ $t('discounts.addBranchesHint') }}</p>
    </div>

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

// PrimeVue components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";

export default {
  name: "DiscountBranchesTable",
  components: {
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
  },
  directives: {
    tooltip: Tooltip,
  },
  mixins: [useTable(), useCrud()],
  props: {
    company_id: { type: String, required: true },
    discount_id: { type: String, required: true },
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/discount-branches/search/${this.discount_id}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/discount-branch`;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    deleteDiscountBranch(item) {
      this.deleteItem(
        item,
        this.propMainUrl,
        this.$t("discounts.branchDeleted"),
        this.$t("discounts.branchDeleteError")
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
  },
};
</script>

<style scoped>
.discount-branches-table {
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
