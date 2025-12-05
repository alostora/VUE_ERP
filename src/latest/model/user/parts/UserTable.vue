<template>
  <!-- نفس الـ template تماماً بدون تغيير -->
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("users.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('users.addUser')"
        icon="pi pi-plus"
        @click="createUser"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('users.search')"
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
        :placeholder="$t('users.show')"
        @change="getData(propSearchUrl)"
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
      class="p-datatable-sm table-scroll-container"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- كل الأعمدة بنفس الطريقة -->
      <!-- ID Column -->
      <Column field="id" :header="$t('users.id')" style="min-width: 200px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('users.name')"
        sortable
        style="min-width: 150px"
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
        style="min-width: 200px"
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
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Status Column -->
      <Column
        field="account_type"
        :header="$t('users.accountType')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          {{
            $i18n.locale === "ar"
              ? slotProps.data.account_type?.name_ar
              : slotProps.data.account_type?.name
          }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('users.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editUserModal(slotProps.data)"
              v-tooltip.top="$t('users.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('users.delete')"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm p-button-success"
              @click="viewUserDetails(slotProps.data)"
              v-tooltip.top="$t('users.viewDetails')"
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

    <UserCreateModal ref="userCreateModal" @user-created="handleUserCreated" />

    <Toast />
    <ConfirmDialog />
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
// From: src/latest/model/country/parts/CountryTable.vue
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

    /**
     * View user details
     */
    viewUserDetails(user) {
      this.showToast(
        "info",
        "User Details",
        `Viewing details for ${user.name}`
      );
    },
  },
};
</script>

<style scoped></style>
