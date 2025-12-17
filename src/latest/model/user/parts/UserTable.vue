<template>
  <!-- نفس الـ template تماماً بدون تغيير -->
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("users.title") }}</h1>
        <div class="table-actions">
          <Button @click="createUser" class="table-action-primary">
            <i class="pi pi-plus"></i> {{ $t("users.addUser") }}
          </Button>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="table-filters"
      >
        <!-- Search -->
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('users.search')"
            @input="handleSearchInput"
            class="search-input"
          />
          <i class="pi pi-search search-icon" />
        </div>

        <!-- Per page select -->
        <div class="flex items-center gap-2">
          <Select
            v-model="per_page"
            :options="perPageOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('users.show')"
            @change="getData(propSearchUrl)"
            class="w-full md:w-32"
          />
        </div>
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
        <!-- كل الأعمدة بنفس الطريقة -->
        <!-- ID Column -->
        <Column field="id" :header="$t('users.id')" class="col-identifier">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
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
            <span class="font-medium">{{ slotProps.data.name }}</span>
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
            {{ formatDate(slotProps.data.created_at) }}
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
              {{
                $i18n.locale === "ar"
                  ? slotProps.data.account_type?.name_ar
                  : slotProps.data.account_type?.name
              }}
            </span>
          </template>
        </Column>

        <!-- Actions Column -->
        <Column
          :header="$t('users.actions')"
          :exportable="false"
          class="col-actions"
        >
          <template #body="slotProps">
            <div class="table-actions-cell">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-success"
                @click="editUserModal(slotProps.data)"
                v-tooltip.top="$t('users.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('users.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <UserEditModal
        ref="userEditModal"
        :user="selectedItem"
        @user-updated="handleUserUpdated"
      />

      <UserCreateModal
        ref="userCreateModal"
        @user-created="handleUserCreated"
      />

      <Toast />
      <ConfirmDialog />
    </div>
  </div>
</template>

<script>
// Import PrimeVue components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

// Import your custom components
import UserCreateModal from "./UserCreateModal.vue";
import UserEditModal from "./UserEditModal.vue";

// Import composables
// Import composables
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";

// Import utilities
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UsersPage",

  components: {
    UserCreateModal,
    UserEditModal,
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

  mixins: [useTable(), useCrud()],

  data() {
    return {
      // API URLs
      propSearchUrl: general_request.BASE_URL + "/admin/users/search",
      propMainUrl: general_request.BASE_URL + "/admin/user",
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    /**
     * Open create user modal
     */
    createUser() {
      this.$refs.userCreateModal.openModal();
    },

    /**
     * Handle user created event
     */
    handleUserCreated(newUser) {
      this.handleItemCreated(newUser);
    },

    /**
     * Open edit user modal
     */
    editUserModal(user) {
      this.selectedItem = { ...user };
      this.$nextTick(() => {
        this.$refs.userEditModal.openModal();
      });
    },

    /**
     * Handle user updated event
     */
    handleUserUpdated(updatedUser) {
      this.handleItemUpdated(updatedUser);
    },

    /**
     * Delete user
     */
    deleteRow(user) {
      this.deleteItem(
        user,
        this.propMainUrl,
        this.$t("users.userDeleted"),
        this.$t("users.deleteError")
      );
    },
  },
};
</script>

<style scoped></style>
