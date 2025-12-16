<template>
  <div class="details-show-page" :class="layoutClasses">
    <div class="details-header">
      <DetailsHeader
        :company="company"
        :current-page="$route.name"
        @toggle-sidebar="toggleDetailsSidebar"
        @go-back="goBackToCompanies"
        @edit-company="editCompany"
      />
    </div>

    <div class="layout-container">
      <div
        class="details-sidebar"
        :class="{ collapsed: detailsSidebarCollapsed }"
      >
        <DetailsSidebar
          :company="company"
          :collapsed="detailsSidebarCollapsed"
          :position="currentDirection"
          :is-mobile="isMobile"
          @toggle="toggleDetailsSidebar"
        />
      </div>

      <main
        class="details-content"
        :class="{ 'sidebar-collapsed': detailsSidebarCollapsed }"
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

        <div v-else-if="company.id" class="main-content-wrapper mt-8">
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

import DetailsHeader from "../layouts/DetailsHeader.vue";
import DetailsSidebar from "../layouts/DetailsSidebar.vue";
import UpdateForm from "./UpdateForm.vue";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";

export default {
  name: "CompanyShow",
  components: {
    RouterView,
    DetailsHeader,
    DetailsSidebar,
    UpdateForm,
    Button,
    ProgressSpinner,
    Message,
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
      detailsSidebarCollapsed: false,
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
      this.detailsSidebarCollapsed = !this.detailsSidebarCollapsed;
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
        this.detailsSidebarCollapsed = true;
      }
    },

    setupLanguageListener() {
      this.languageUnwatch = this.$watch("$i18n.locale", (newLocale) => {
        this.currentLanguage = newLocale;
      });
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
  min-height: calc(100vh - 64px);
  background: var(--surface-ground);
}

.details-header {
  background: var(--surface-card);
  align-items: center;
  position: fixed;
  z-index: 1;
  width: 100%;
}

.layout-container {
  display: flex;
  height: calc(100vh - 124px);
}

.details-sidebar {
  top: 124px;
  width: 280px;
  flex-shrink: 0;
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  height: calc(100vh - 124px);
}

/* 
     .details-sidebar {
     top: 124px; 
     width: 280px;
     flex-shrink: 0;
     background: var(--surface-card);
     border-right: 1px solid var(--surface-border);
     transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
     top: 124px; 
     height: calc(100vh - 124px);
     position: fixed;
     z-index: 900;
     }
*/

.details-sidebar.collapsed {
  width: 70px;
}

.details-rtl .details-sidebar {
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.details-content {
  flex: 1;
  height: calc(100vh - 124px);
  padding: 1.5rem;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.details-ltr .details-content {
  margin-left: 0px;
}

.details-ltr .details-content.sidebar-collapsed {
  margin-left: 10px;
}

.details-rtl .details-content {
  margin-right: 0px;
}

.details-rtl .details-content.sidebar-collapsed {
  margin-right: 10px;
}

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
    min-height: calc(100vh - 56px);
  }

  .layout-container {
    min-height: calc(100vh - 106px);
  }

  .details-sidebar {
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(-100%);
    width: 280px !important;
    height: calc(100vh - 0px);
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
    height: calc(100vh - 106px);
  }

  .main-content-wrapper {
    padding: 0;
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 769px) {
  .details-sidebar {
    width: 240px;
  }

  .details-sidebar.collapsed {
    width: 70px;
  }

  .details-ltr .details-content {
    margin-left: 240px;
  }

  .details-ltr .details-content.sidebar-collapsed {
    margin-left: 70px;
  }

  .details-rtl .details-content {
    margin-right: 240px;
  }

  .details-rtl .details-content.sidebar-collapsed {
    margin-right: 70px;
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
</style>
