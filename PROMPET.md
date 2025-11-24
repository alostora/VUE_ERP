do you remember another chat between us or only this?


________________________________________________________

ok let me remember you what we were doing

________________________________________________________

we made ERP project

that contacin uers with its account types admin,root,client,employee

and country,governorate,city

then we have client company for company we finished

now i need to make category then products ...... etc

now i will provide you with our project structure to complete working on category ok  i will give you user structure as example ok?

i need you make samilar as same as the structure i will provide you

no diffrance please 

just wait
________________________________________________________

this is main.js

import './assets/main.css'; // Add this import
import { createApp } from 'vue';
import Home from './Home.vue';
import router from './router';
import axios from "axios";
import store from "./store/store";
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';
import i18n from './i18n/index';
import 'primeflex/primeflex.css'

import ConfirmationService from 'primevue/confirmationservice';



const app = createApp(Home);

app.config.globalProperties.$http = axios;

// Initialize theme
const initializeTheme = () => {
     const savedTheme = localStorage.getItem('theme') || 'light';
     if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark-mode');
     } else {
          document.documentElement.classList.add('light-mode');
     }
};

initializeTheme();

app
     .use(router)
     .use(store)
     .use(ToastService)
     .use(i18n)
     .use(PrimeVue, {
          ripple: true,
          unstyled: false,
          inputVariant: "outlined",
          theme: {
               preset: Aura,
               options: {
                    darkModeSelector: '.dark-mode' // This enables PrimeVue's built-in dark mode
               }
          }
     })
     .use(ConfirmationService);

app.mount('#app');

just wait

________________________________________________________________________


now this is HomePage.vue

<template>
  <RouterView />
</template>

<script>
export default {
  data() {
    return {
      token: "",
      error_message: "",
    };
  },
  methods: {
    checkIfAuth() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    },
  },

  beforeCreate() {},

  created() {
    this.checkIfAuth();
  },
};
</script>
 just wait

 _______________________________________________________________________________



 then this index.js inside the router filder

import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../latest/views/HomePage.vue";
import LoginPage from "../latest/views/LoginPage.vue";
import user_routes from "../latest/model/user/routes/user-routes";
import country_routes from "../latest/model/country/routes/country-routes";

import MVVMContent from "../latest/views/layouts/MVVMContent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { requiresAuth: true }, // Protected route
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: MVVMContent
        },
        // Assuming user_routes and country_routes also have requiresAuth: true set inside them
        ...user_routes,
        ...country_routes,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { requiresAuth: false } // Unprotected route
    },
  ],
});

// --- ADDED NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // Check if the route the user is navigating to requires authentication
  if (to.meta.requiresAuth) {
    // Check if the authentication token exists in local storage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Token exists, user is authenticated. Proceed to the desired route.
      next();
    } else {
      // Token does NOT exist. Redirect to the login page.
      // We pass the intended destination path as a query parameter ('redirect')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // Route does not require authentication (e.g., /login). Proceed as normal.
    next();
  }
});
// ------------------------------

export default router;

 just wait

 _______________________________________________________________________________

 now inside src/latest/views 
this is HomePage.vue

<template>
  <div class="layout-wrapper" :class="[currentDirection, currentTheme]">
    <MVVMMainHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
    />
    
    <!-- Overlay للخلفية في الموبايل -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="layout-container">
      <MVVMSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />
      <main
        class="main-content"
        :class="{ 'content-expanded': sidebarCollapsed }"
      >
        <RouterView />
        <MVVMFooter />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import MVVMMainHeader from "./layouts/MVVMMainHeader.vue";
import MVVMSidebar from "./layouts/MVVMSidebar.vue";
import MVVMContent from "./layouts/MVVMContent.vue";
import MVVMFooter from "./layouts/MVVMFooter.vue";

export default {
  components: {
    RouterView,
    MVVMMainHeader,
    MVVMSidebar,
    MVVMContent,
    MVVMFooter,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentDirection:
        localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
      currentTheme: localStorage.getItem("theme") || "light",
      isMobile: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    onLanguageChanged(language) {
      this.currentDirection = language.dir;
    },
    onThemeChanged(theme) {
      this.currentTheme = theme;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      // إغلاق السايدبار تلقائياً في الموبايل
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Initialize theme class
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: all 0.3s ease;
  min-height: 100%;
}

/* LTR - Sidebar on left */
.layout-wrapper.ltr .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.ltr .main-content.content-expanded {
  margin-left: 60px;
  width: calc(100% - 60px);
}

/* RTL - Sidebar on right */
.layout-wrapper.rtl .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.rtl .main-content.content-expanded {
  margin-right: 60px;
  width: calc(100% - 60px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout-wrapper.ltr .main-content,
  .layout-wrapper.rtl .main-content {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .layout-wrapper.ltr .main-content.content-expanded,
  .layout-wrapper.rtl .main-content.content-expanded {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  /* Overlay Styles */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
    backdrop-filter: blur(2px);
  }
}
</style>

just wait


 _______________________________________________________________________________

 inside views/layouts

we have
MVVMContent.vue
MVVMFooter.vue
MVVMMainHeader.vue
MVVMSidebar.vue


inside views/layouts/constants

general_request.js
and its content is
const general_request = {
  BASE_URL: import.meta.env.VITE_HOST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export default general_request;



then inside views/layouts/constants/composables
useCrud.js
its content is 
import general_request from "../general_request";

export function useCrud() {
     return {
          data() {
               return {
                    selectedItem: null
               }
          },

          methods: {
               async deleteItem(item, baseUrl, successMessage, errorMessage) {
                    this.$confirm.require({
                         message: `Delete ${item.name || item.title || 'this item'}?`,
                         header: 'Confirmation',
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", "Success", successMessage);
                              } catch (error) {
                                   console.error("Error deleting item:", error);
                                   this.showToast("error", "Error", errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", "Success", "Item created successfully");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", "Success", "Item updated successfully");
               }
          }
     }
}

and useTable.js and its content is

import general_request from "../general_request";

export function useTable() {
     return {
          data() {
               return {
                    tableItems: [],
                    loading: false,
                    meta: { total: 0, current_page: 1 },
                    links: {},
                    per_page: 10,
                    query_string: '',
                    sortField: null,
                    sortOrder: null,
                    selectedItem: null,
                    perPageOptions: [
                         { label: '5', value: 5 },
                         { label: '10', value: 10 },
                         { label: '25', value: 25 },
                         { label: '50', value: 50 },
                         { label: '100', value: 100 }
                    ],
                    searchTimeout: null
               }
          },

          computed: {
               axiosParams() {
                    return {
                         per_page: this.per_page,
                         query_string: this.query_string,
                         page: this.meta.current_page || 1,
                    }
               },

               sortedTableItems() {
                    if (!this.sortField || this.sortOrder === 0) {
                         return this.tableItems;
                    }

                    return [...this.tableItems].sort((a, b) => {
                         let valueA = a[this.sortField];
                         let valueB = b[this.sortField];

                         // Handle nested objects (like account_type.name)
                         if (this.sortField.includes('.')) {
                              const fields = this.sortField.split('.');
                              valueA = fields.reduce((obj, field) => obj?.[field], a);
                              valueB = fields.reduce((obj, field) => obj?.[field], b);
                         }

                         if (valueA == null) valueA = '';
                         if (valueB == null) valueB = '';

                         valueA = String(valueA).toLowerCase();
                         valueB = String(valueB).toLowerCase();

                         let comparison = 0;
                         if (valueA > valueB) {
                              comparison = 1;
                         } else if (valueA < valueB) {
                              comparison = -1;
                         }

                         return this.sortOrder === 1 ? comparison : comparison * -1;
                    });
               }
          },

          methods: {
               // Data fetching methods
               async getData(url = this.propSearchUrl) {
                    await this.fetchData(url);
               },

               async fetchData(url, customErrorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.get(url, {
                              params: this.axiosParams,
                              headers: general_request.headers,
                         });

                         this.tableItems = response.data.data || [];
                         this.links = response.data.links || {};
                         this.meta = response.data.meta || { total: 0 };
                    } catch (error) {
                         console.error("Error fetching data:", error);
                         const errorMessage = customErrorMessage || this.$t("errors.fetchError");
                         this.showToast("error", this.$t("common.error"), errorMessage);
                    } finally {
                         this.loading = false;
                    }
               },

               // Search and pagination methods
               handleSearchInput() {
                    this.onSearchInput(this.getData);
               },

               onSearchInput(callback) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                         this.meta.current_page = 1;
                         callback();
                    }, 500);
               },

               handlePageChange(event) {
                    this.onPageChange(event, this.getData);
               },

               onPageChange(event, callback) {
                    this.per_page = event.rows;
                    this.meta.current_page = event.page + 1;
                    callback();
               },

               // Sorting method
               onSort(event) {
                    this.sortField = event.sortField;
                    this.sortOrder = event.sortOrder;
               },

               // CRUD operations
               async deleteItem(item, baseUrl, successMessage, customErrorMessage = null) {
                    this.$confirm.require({
                         message: `هل أنت متأكد من حذف ${item.name || item.title || 'هذا العنصر'}؟`,
                         header: this.$t("common.confirmation"),
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", this.$t("common.success"), successMessage);
                              } catch (error) {
                                   console.error("Error deleting item:", error);
                                   const errorMessage = customErrorMessage || this.$t("errors.deleteError");
                                   this.showToast("error", this.$t("common.error"), errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", this.$t("common.success"), "تم الإنشاء بنجاح");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", this.$t("common.success"), "تم التحديث بنجاح");
               },

               // Utility methods
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

               // Navigation helper
               navigateToPage(url, fetchCallback) {
                    if (url && !this.loading) {
                         fetchCallback(url);
                    }
               },

               // Reset form data
               resetFormData() {
                    return {
                         id: "",
                         name: "",
                         name_ar: "",
                         email: "",
                         phone: "",
                         password: "",
                         address: "",
                         user_account_type_id: "",
                         phone_code: "",
                         prefix: "",
                         flag: ""
                    };
               }
          }
     }
}

just wait

________________________________________________________________________________________

then inside src/latest/model

user folder and country folder

now i will send all user componetents as example country is the same structure
[
   parts ->>>foldert
    routes ->>> folder
]

just wait i will provide you parts files
and routes files

____________________________________________________________________________


lets have parts files

UserTable.vue
and this is its content

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
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
      @sort="onSort"
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

<style scoped>
/* نفس الـ styles */
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

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>

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
    console.log("Users component mounted");
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
      console.log("View user details:", user);
      this.showToast(
        "info",
        "User Details",
        `Viewing details for ${user.name}`
      );
    },
  },
};
</script>
___________________


then UserCreateModal.vue
and this is its content

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
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
      @sort="onSort"
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

<style scoped>
/* نفس الـ styles */
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

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>

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
    console.log("Users component mounted");
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
      console.log("View user details:", user);
      this.showToast(
        "info",
        "User Details",
        `Viewing details for ${user.name}`
      );
    },
  },
};
</script>


__________________________


then UserCreateForm.vue and this is its content
<template>
  <div class="user-create-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("users.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('users.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="field mb-3">
        <label for="email" class="font-bold block mb-2">
          {{ $t("users.email") }} *
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
          :placeholder="$t('users.emailPlaceholder')"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("users.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
          :placeholder="$t('users.phonePlaceholder')"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Account Type Select -->
      <div class="field mb-3">
        <label for="accountType" class="font-bold block mb-2">
          {{ $t("users.accountType") }} *
        </label>
        <Select
          id="accountType"
          v-model="selectedAccountType"
          :options="accountTypes"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.user_account_type_id }"
          :placeholder="
            loadingAccountTypes
              ? $t('users.loadingAccountTypes')
              : $t('users.selectAccountType')
          "
          class="w-full"
          :loading="loadingAccountTypes"
          :disabled="loadingAccountTypes"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }} *
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="true"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
          toggleMask
          :inputStyle="{ width: '100%' }"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- Password Confirmation Field -->
      <div class="field mb-3">
        <label for="password_confirmation" class="font-bold block mb-2">
          {{ $t("users.confirmPassword") }} *
        </label>
        <Password
          id="password_confirmation"
          v-model="formData.password_confirmation"
          :feedback="false"
          :class="{ 'p-invalid': errors.password_confirmation }"
          class="w-full"
          :placeholder="$t('users.confirmPasswordPlaceholder')"
          toggleMask
        />
        <small v-if="errors.password_confirmation" class="p-error">
          {{ errors.password_confirmation }}
        </small>
      </div>

      <!-- Address Field -->
      <div class="field mb-4">
        <label for="address" class="font-bold block mb-2">
          {{ $t("users.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('users.addressPlaceholder')"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>
<script>
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserCreateForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  data() {
    return {
      loading: false,
      loadingAccountTypes: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      },
      errors: {},
    };
  },
  watch: {
    selectedAccountType: {
      handler(newValue) {
        this.formData.user_account_type_id = newValue;
      },
    },
  },
  mounted() {
    this.loadAccountTypes();
  },
  methods: {
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
      this.loadingAccountTypes = true;
      try {
        const response = await this.$http.get(
          general_request.BASE_URL + "/system-lookups/1",
          {
            params: { per_page: 100 },
            headers: general_request.headers,
          }
        );
        this.accountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading account types:", error);
        this.error = this.$t("users.loadAccountTypesError");
      } finally {
        this.loadingAccountTypes = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t("accountTypeRequired");
      }

      if (!this.formData.password) {
        this.errors.password = this.$t("passwordRequired");
      } else if (this.formData.password.length < 6) {
        this.errors.password = this.$t("passwordMinLength");
      }

      if (!this.formData.password_confirmation) {
        this.errors.password_confirmation = this.$t("confirmPasswordRequired");
      } else if (
        this.formData.password !== this.formData.password_confirmation
      ) {
        this.errors.password_confirmation = this.$t("passwordsDoNotMatch");
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/user`;

        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
          password: this.formData.password,
          password_confirmation: this.formData.password_confirmation,
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("user-created", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("users.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("users.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("user account type id")) {
          this.errors.user_account_type_id = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        } else if (message.includes("password")) {
          this.errors.password = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
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
.user-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-select) {
  width: 100%;
}
</style>

_______________________________________

then UserEditModal.vue and its content
<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <!-- User Edit Form -->
    <UserEditForm
      :user="user"
      @user-updated="handleUserUpdated"
      @cancel="closeModal"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import UserEditForm from "./UserEditForm.vue";

export default {
  name: "UserEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    UserEditForm,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  computed: {
    headerText() {
      return this.user?.id
        ? this.$t("users.editUser")
        : this.$t("users.createUser");
    },
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleUserUpdated(updatedUser) {
      this.$emit("user-updated", updatedUser);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
_______________________________________________


at last this is UserEditForm.vue and this is its content

<template>
  <div class="user-edit-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("users.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="field mb-3">
        <label for="email" class="font-bold block mb-2">
          {{ $t("users.email") }} *
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("users.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Account Type Select -->
      <div class="field mb-3">
        <label for="accountType" class="font-bold block mb-2">
          {{ $t("users.accountType") }} *
        </label>
        <Select
          id="accountType"
          v-model="selectedAccountType"
          :options="accountTypes"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.user_account_type_id }"
          :placeholder="$t('users.selectAccountType')"
          class="w-full"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field (optional for edit) -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }}
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="false"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- Address Field -->
      <div class="field mb-4">
        <label for="address" class="font-bold block mb-2">
          {{ $t("users.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="submitButtonText"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserEditForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      },
      errors: {},
    };
  },
  computed: {
    submitButtonText() {
      return this.formData.id
        ? this.$t("common.update")
        : this.$t("common.create");
    },
    isEditMode() {
      return !!this.formData.id;
    },
  },
  watch: {
    user: {
      immediate: true,
      deep: true,
      handler(newUser) {
        if (newUser && newUser.id) {
          this.populateForm(newUser);
        } else {
          this.resetForm();
        }
      },
    },
    selectedAccountType: {
      handler(newValue) {
        this.formData.user_account_type_id = newValue;
      },
    },
  },
  mounted() {
    this.loadAccountTypes();
  },
  methods: {
    populateForm(user) {
      this.formData = {
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Never pre-fill password
        address: user.address || "",
        user_account_type_id: user.account_type?.id || "",
      };

      // Set the selected account type ID directly
      this.selectedAccountType = user.account_type?.id || null;
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
      try {
        const response = await this.$http.get(
          general_request.BASE_URL + "/system-lookups/1",
          {
            params: { per_page: 100 },
            headers: general_request.headers,
          }
        );
        this.accountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading account types:", error);
        this.error = this.$t("users.loadAccountTypesError");
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("validation.emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("validation.emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t(
          "validation.accountTypeRequired"
        );
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = this.isEditMode
          ? `${general_request.BASE_URL}/admin/user/${this.formData.id}`
          : `${general_request.BASE_URL}/admin/user`;

        const method = this.isEditMode ? "patch" : "post";

        // Prepare payload - only include password if provided
        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
        };

        // Only include password if provided (for updates)
        if (this.formData.password) {
          payload.password = this.formData.password;
        }

        console.log("Updating user with payload:", payload);

        const response = await this.$http[method](url, payload, {
          headers: general_request.headers,
        });

        console.log("User updated successfully:", response.data);
        this.$emit("user-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      // Clear previous errors
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        // Handle different error response formats
        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      // Handle 400 Bad Request errors
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");

          // Map common error messages to specific fields
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      // Fallback to main message
      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      // Handle 422 Validation errors (Laravel standard)
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);

        // Also show the first error as a general message
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      if (responseData.message) {
        this.error = responseData.message;
      } else {
        this.error = this.$t("users.updateError");
      }
    },

    handleNetworkError(error) {
      if (error.message) {
        this.error = error.message;
      } else {
        this.error = this.$t("users.networkError");
      }
    },

    mapCommonErrorsToFields(errorMessages) {
      // Map common error messages to specific form fields
      errorMessages.forEach((message) => {
        if (message.includes("user account type id")) {
          this.errors.user_account_type_id = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        } else if (message.includes("password")) {
          this.errors.password = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        }
        // Add more mappings as needed
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};

      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];

        if (Array.isArray(fieldErrors)) {
          // Take the first error message for each field
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });

      return formattedErrors;
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
.user-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password input) {
  width: 100%;
}
</style>


_________________________________________________________________________________


user-routes.js and this is its content

import UserTable from "../parts/UserTable.vue";

const user_routes = [
  {
    // path: "/users/:propSearchUrl/:propMainUrl",
    path: "/users/",
    name: "users",
    component: UserTable,
    props: true,
  }
];

export default user_routes;


_________________________________________________________________________________

now i will provide you with translate structure and then we will start ok
_________________________________________________________________________________


in src/i18n
index.js

import { createI18n } from 'vue-i18n'

// Import English translations
import enUsers from './locales/en/users'
import enCountries from './locales/en/country'
import enCommon from './locales/en/common'
import enAuth from './locales/en/auth'
import enValidation from './locales/en/validation'
import enErrors from './locales/en/errors'

// Import Arabic translations
import arUsers from './locales/ar/users'
import arCountries from './locales/ar/country'
import arCommon from './locales/ar/common'
import arAuth from './locales/ar/auth'
import arValidation from './locales/ar/validation'
import arErrors from './locales/ar/errors'

const messages = {
     en: {
          ...enCommon,
          ...enAuth,
          ...enValidation,
          errors: enErrors,
          users: enUsers,
          countries: enCountries
     },
     ar: {
          ...arCommon,
          ...arAuth,
          ...arValidation,
          errors: arErrors,
          users: arUsers,
          countries: arCountries
     }
}

const i18n = createI18n({
     legacy: false,
     locale: localStorage.getItem('language') || 'en',
     fallbackLocale: 'en',
     messages
})

export default i18n


_________________________________________________________________________

now as we finished users and country and governorate and city and company we neet to make category that will contain products

i will provide its backend request and its routes to make complete operation same provided structure above ok?

