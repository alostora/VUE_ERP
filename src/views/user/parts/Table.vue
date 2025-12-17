<template>
  <div class="page-container-fluid">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("users.title") }}</h1>
        <div class="table-actions">
          <button class="table-action-primary" @click="openCreateModel">
            <i class="pi pi-plus"></i>
            {{ $t("users.addUser") }}
          </button>
        </div>
      </div>

      <!-- Table Filters -->
      <div class="table-filters">
        <div class="search-container">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="query_string"
            :placeholder="$t('users.search')"
            @input="handleSearchInput"
            class="search-input"
          />
        </div>

        <Select
          v-model="per_page"
          :options="perPageOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('users.show')"
          @change="getData(propSearchUrl)"
          class="table-filter-select"
        />

        <button class="table-filter-clear" @click="clearFilters">
          <i class="pi pi-filter-slash"></i>
          {{ $t("common.clearFilters") }}
        </button>
      </div>

      <!-- Table Content -->
      <div class="table-content responsive-table">
        <DataTable
          :value="tableItems"
          :paginator="true"
          :rows="per_page"
          :totalRecords="meta.total"
          :rowsPerPageOptions="[5, 10, 25, 50, 100]"
          :loading="loading"
          :lazy="true"
          showGridlines
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          class="data-table"
          @page="handlePageChange"
        >
          <!-- ID Column -->
          <Column field="id" :header="$t('users.id')" class="col-identifier">
            <template #body="slotProps">
              <span class="text-muted">{{ slotProps.index + 1 }}</span>
            </template>
          </Column>

          <!-- Name Column -->
          <Column
            field="name"
            :header="$t('users.name')"
            sortable
            class="col-name"
          >
            <template #body="slotProps">
              <div class="d-flex align-items-center gap-2">
                <div class="card-avatar">
                  {{ slotProps.data.name.charAt(0) }}
                </div>
                <span class="font-medium">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>

          <!-- Email Column -->
          <Column
            field="email"
            :header="$t('users.email')"
            sortable
            class="col-email"
          >
            <template #body="slotProps">
              <span>{{ slotProps.data.email }}</span>
            </template>
          </Column>

          <!-- Created At Column -->
          <Column
            field="created_at"
            :header="$t('users.createdAt')"
            sortable
            class="col-date hide-on-mobile"
          >
            <template #body="slotProps">
              <span class="text-muted">{{
                formatDate(slotProps.data.created_at)
              }}</span>
            </template>
          </Column>

          <!-- Status Column -->
          <Column
            field="account_type"
            :header="$t('users.accountType')"
            class="col-status"
          >
            <template #body="slotProps">
              <span class="status-badge status-active">
                {{ accountTypeText(slotProps.data.account_type) }}
              </span>
            </template>
          </Column>

          <!-- Actions Column -->
          <Column :header="$t('countries.actions')" class="col-actions">
            <template #body="slotProps">
              <div class="table-actions-cell">
                <button
                  class="table-action-btn table-action-edit"
                  @click="openUpdateModel(slotProps.data)"
                  v-tooltip="$t('countries.edit')"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                  class="table-action-btn table-action-delete"
                  @click="deleteRow(slotProps.data)"
                  v-tooltip="$t('countries.delete')"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </template>
          </Column>

          <!-- Empty State -->
          <template #empty>
            <div class="table-empty">
              <i class="pi pi-users empty-icon"></i>
              <h3 class="empty-title">{{ $t("common.noData") }}</h3>
              <p class="empty-description">
                {{ $t("users.noUsersFound") }}
              </p>
              <button class="empty-action" @click="openCreateModel">
                <i class="pi pi-plus"></i>
                {{ $t("users.addUser") }}
              </button>
            </div>
          </template>

          <!-- Loading State -->
          <template #loading>
            <div class="table-loading">
              <div class="loading-spinner"></div>
              <p class="loading-text">{{ $t("common.loading") }}</p>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Pagination -->
      <div class="table-pagination">
        <div class="pagination-info">
          Showing {{ (meta.current_page - 1) * per_page + 1 }} to
          {{ Math.min(meta.current_page * per_page, meta.total) }} of
          {{ meta.total }} entries
        </div>
        <div class="pagination-controls">
          <!-- Pagination will be rendered by DataTable -->
        </div>
      </div>

      <!-- Mobile View (Hidden on desktop) -->
      <div class="table-mobile-view">
        <div class="table-card" v-for="user in tableItems" :key="user.id">
          <div class="card-header">
            <div class="card-avatar">
              {{ user.name.charAt(0) }}
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ user.name }}</h3>
              <p class="card-subtitle">{{ user.email }}</p>
            </div>
            <div class="card-status">
              <span class="status-badge status-active">
                {{ accountTypeText(user.account_type) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-field">
              <span class="card-label">{{ $t("users.id") }}:</span>
              <span class="card-value">{{ user.id }}</span>
            </div>
            <div class="card-field">
              <span class="card-label">{{ $t("users.createdAt") }}:</span>
              <span class="card-value">{{ formatDate(user.created_at) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button
              class="table-action-btn table-action-edit"
              @click="openUpdateModel(user)"
            >
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="table-action-btn table-action-delete"
              @click="deleteRow(user)"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UpdateForm
      ref="updateModalForm"
      :selected_item="selectedItem"
      @updated="handleUpdated"
    />

    <CreateForm ref="createModalForm" @created="handleCreated" />

    <Toast />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";

import CreateForm from "./CreateForm.vue";
import UpdateForm from "./UpdateForm.vue";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";

export default {
  name: "UsersTable",

  mixins: [useTable(), useCrud()],

  components: {
    CreateForm,
    UpdateForm,
    DataTable,
    Column,
    InputText,
    Select,
    Toast,
  },

  directives: {
    tooltip: Tooltip,
  },

  computed: {
    propSearchUrl() {
      return `${moduleUrl.URLS.USER.propSearchUrl}?paginate=true`;
    },
    perPageOptions() {
      return [
        { label: "5 " + this.$t("users.perPage"), value: 5 },
        { label: "10 " + this.$t("users.perPage"), value: 10 },
        { label: "25 " + this.$t("users.perPage"), value: 25 },
        { label: "50 " + this.$t("users.perPage"), value: 50 },
        { label: "100 " + this.$t("users.perPage"), value: 100 },
      ];
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.USER.propMainUrl,
    };
  },

  mounted() {
    this.getData();
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

    clearFilters() {
      this.query_string = "";
      this.getData();
    },

    accountTypeText(accountType) {
      return this.$i18n.locale === "ar"
        ? accountType?.name_ar
        : accountType?.name;
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
/* All styling is in global-tables.css and global-forms.css */
/* No custom CSS needed! */

/* Just some utility classes for PrimeVue integration */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  white-space: nowrap;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  vertical-align: middle;
}

:deep(.p-datatable .p-sortable-column) {
  cursor: pointer;
}

:deep(.p-datatable .p-sortable-column:hover) {
  background-color: var(--surface-hover);
}

/* Ensure mobile view is hidden on desktop */
@media (min-width: 769px) {
  .table-mobile-view {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .table-content {
    display: none;
  }

  .table-mobile-view {
    display: block;
    padding: 1rem;
  }
}

/* Pagination styling override for consistency */
:deep(.p-paginator) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  min-width: 2rem;
  height: 2rem;
  margin: 0 0.1rem;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--primary-color-text);
}
</style>
