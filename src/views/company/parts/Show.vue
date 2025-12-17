<template>
  <div class="details-show-page" :class="layoutClasses">
    <div class="details-header">
      <MVVMMainHeader
        :company="company"
        :current-page="$route.name"
        @toggle-sidebar="toggleDetailsSidebar"
        @go-back="goBackToCompanies"
        @edit-company="editCompany"
      />
    </div>

    <div class="layout-container">
      <div class="details-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <AppSidebar
          :collapsed="sidebarCollapsed"
          :sidebar-items="navItems"
          :position="currentDirection"
          :is-mobile="isMobile"
          @toggle="toggleAppSidebar"
        />
      </div>

      <main
        class="details-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <div v-if="loading" class="loading-container">
          <ProgressSpinner />
          <p class="mt-2">{{ $t("common.loading") }}</p>
        </div>

        <div v-else-if="error" class="error-container">
          <Message severity="error" class="mb-3">
            {{ error }}
          </Message>
          <Button
            :label="$t('common.retry')"
            icon="pi pi-refresh"
            @click="fetchCompany"
          />
        </div>

        <div v-else-if="company.id" class="main-content-wrapper mt-1">
          <RouterView :company="company" :company_id="company_id" />
        </div>
      </main>
    </div>

    <!-- Update Form Modal -->
    <UpdateForm
      ref="updateModalForm"
      :selected_item="selectedItem"
      @updated="handleUpdated"
    />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import customFunctions from "../custom_functions/customFunctions";
import general_request from "@/utils/general_request";

import MVVMMainHeader from "@/views/_main_container/layouts/MVVMMainHeader.vue";
import UpdateForm from "./UpdateForm.vue";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";

import AppSidebar from "@/views/_main_container/layouts/MVVMSidebar.vue";
import sidebarItems from "@/utils/sidebarItems";

export default {
  name: "CompanyShow",
  components: {
    RouterView,
    MVVMMainHeader,
    UpdateForm,
    Button,
    ProgressSpinner,
    Message,
    AppSidebar,
  },

  mixins: [useTable(), useCrud(), customFunctions],

  props: {
    company_id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      company: {},
      loading: false,
      error: "",
      sidebarCollapsed: false,
      sidebarCollapsed: false,
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
      selectedItem: null,
    };
  },

  computed: {
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
    },

    layoutClasses() {
      return {
        "details-ltr": this.currentDirection === "ltr",
        "details-rtl": this.currentDirection === "rtl",
        "details-mobile": this.isMobile,
      };
    },

    navItems() {
      const items = sidebarItems("company", this.company_id);
      return items || [];
    },
  },

  watch: {
    $route: {
      handler() {
        // Reset scroll when changing routes
        const content = document.querySelector(".details-content");
        if (content) {
          content.scrollTop = 0;
        }
      },
    },
  },

  mounted() {
    console.log("CompanyShow component mounted");
    console.log("Company ID:", this.company_id);
    console.log("Route params:", this.$route.params);

    this.fetchCompany();
    this.checkMobile();
    this.setupLanguageListener();
    window.addEventListener("resize", this.checkMobile);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
    if (this.languageUnwatch) {
      this.languageUnwatch();
    }
  },

  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
          this.selectedItem = this.company;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },

    toggleDetailsSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    goBackToCompanies() {
      this.$router.push("/companies");
    },

    editCompany() {
      this.$refs.updateModalForm.openModal();
    },

    handleUpdated() {
      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("companies.companyUpdated")
      );
      this.fetchCompany();
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },

    setupLanguageListener() {
      this.languageUnwatch = this.$watch("$i18n.locale", (newLocale) => {
        this.currentLanguage = newLocale;
      });
    },

    toggleAppSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
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
.details-show-page {
  min-height: 100vh;
  background: var(--surface-ground);
  display: flex;
  flex-direction: column;
}

.details-header {
  background: var(--surface-card);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 64px);
  position: relative;
}

.details-sidebar {
  width: 280px;
  flex-shrink: 0;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  z-index: 50;
  transition: width 0.3s ease;
  overflow: hidden;
}

.details-sidebar.collapsed {
  width: 66px;
}

/* Make AppSidebar fill its container */
.details-sidebar :deep(.app-sidebar) {
  height: 100% !important;
  width: 100% !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  border-right: 1px solid var(--surface-border);
}

.details-rtl .details-sidebar {
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.details-rtl .details-sidebar :deep(.app-sidebar) {
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.details-content {
  flex: 1;
  height: calc(100vh - 64px);
  padding: 1.5rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  background: var(--surface-ground);
}

/* LTR Layout */

.main-content-wrapper {
  width: 100%;
  margin: 0 auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}

.error-container {
  padding: 2rem;
}

@media (max-width: 768px) {
  .details-show-page {
    min-height: 100vh;
  }

  .details-header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 56px;
  }

  .layout-container {
    min-height: 100vh;
    margin-top: 56px;
  }

  .details-sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    width: 280px !important;
    height: calc(100vh - 56px);
    transition: transform 0.3s ease;
  }

  .details-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .details-rtl .details-sidebar {
    left: auto;
    right: 0;
    transform: translateX(100%);
  }

  .details-rtl .details-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .details-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 1rem;
    height: calc(100vh - 56px);
  }

  /* Add overlay when sidebar is open */
  .details-sidebar:not(.collapsed) + .details-content::before {
    content: "";
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }

  .main-content-wrapper {
    padding: 0;
  }
  
  .details-header {
    margin-top: 4rem; /* يعادل mt-8 (8 * 0.25rem = 2rem) */
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 769px) {
  .details-sidebar {
    width: 240px;
  }

  .details-sidebar.collapsed {
    width: 0px;
  }

  .details-ltr .details-content:not(.sidebar-collapsed) {
    margin-left: 0px;
  }

  .details-ltr .details-content.sidebar-collapsed {
    margin-left: 0px;
  }

  .details-rtl .details-content:not(.sidebar-collapsed) {
    margin-right: 0px;
  }

  .details-rtl .details-content.sidebar-collapsed {
    margin-right: 0px;
  }
}

/* Small Mobile */
@media (max-width: 576px) {
  .details-content {
    padding: 0.75rem;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Debug styles */
.debug-border {
  border: 2px solid red !important;
}
</style>
