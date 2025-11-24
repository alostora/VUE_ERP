<template>
  <div class="company-show-wrapper" :class="layoutClasses">
    <!-- نحط كل حاجة في container واحد -->
    <div class="company-layout-container">
      <!-- Company Header -->
      <CompanyHeader
        :company="company"
        :current-page="$route.name"
        @toggle-sidebar="toggleSidebar"
        @go-back="goBackToCompanies"
        @edit-company="editCompany"
      />

      <!-- Company Sidebar -->
      <CompanySidebar
        :company="company"
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />

      <!-- Mobile Overlay -->
      <div
        v-if="isMobile && !sidebarCollapsed"
        class="company-sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- Main Content -->
      <main
        class="company-main-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <div class="company-show-page">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex justify-content-center align-items-center py-6"
          >
            <ProgressSpinner />
            <p class="ml-3">{{ $t("common.loading") }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <Message severity="error" class="mb-3">
              {{ error }}
            </Message>
            <Button
              :label="$t('common.retry')"
              icon="pi pi-refresh"
              @click="fetchCompany"
            />
          </div>

          <!-- Company Content -->
          <div v-else-if="company.id" class="company-content">
            <CompanyStatistics :company="company" />
            <Divider />
            <CompanyDetails :company="company" />
          </div>
        </div>
      </main>
    </div>

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

// Import Company Layouts
import CompanyHeader from "../layouts/CompanyHeader.vue";
import CompanySidebar from "../layouts/CompanySidebar.vue";

// Import Components
import CompanyDetails from "../parts/details/CompanyDetails.vue";
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Divider from "primevue/divider";

export default {
  name: "CompanyShow",
  components: {
    CompanyHeader,
    CompanySidebar,
    CompanyDetails,
    CompanyStatistics,
    Button,
    ProgressSpinner,
    Message,
    Toast,
    Divider,
  },
  mixins: [useTable()],
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
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
    };
  },
  computed: {
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
    },
    layoutClasses() {
      return {
        "company-ltr": this.currentDirection === "ltr",
        "company-rtl": this.currentDirection === "rtl",
        "mobile-view": this.isMobile,
      };
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
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    goBackToCompanies() {
      this.$router.push("/companies");
    },

    editCompany() {
      this.showToast(
        "info",
        this.$t("common.info"),
        this.$t("companies.editFunctionalityComing")
      );
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
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}

/* الـ container الجديد علشان نحصر كل حاجة */
.company-layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* مهم جداً علشان نحصر المحتوى */
}

.company-main-content {
  min-height: calc(100vh - 70px);
  margin-left: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  background: var(--surface-ground);
  margin-top: 70px;
  position: relative;
  z-index: 1;
}

/* When sidebar is collapsed */
.company-main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* RTL Support */
.company-rtl .company-main-content {
  margin-left: 0;
  margin-right: 280px;
}

.company-rtl .company-main-content.sidebar-collapsed {
  margin-right: 70px;
}

.company-show-page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  transition: all 0.3s ease;
}

.company-sidebar-overlay {
  position: absolute; /* غيرنا لـ absolute علشان يفضل داخل الـ container */
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 699;
  backdrop-filter: blur(2px);
}

.error-state {
  text-align: center;
  padding: 2rem;
}

.company-content {
  animation: fadeIn 0.3s ease;
}

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

/* Mobile responsive */
@media (max-width: 768px) {
  .company-layout-container {
    overflow: visible; /* في الموبايل بنسمح بالـ overlay */
  }
  
  .company-main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    margin-top: 70px;
  }

  .company-sidebar-overlay {
    top: 70px;
    z-index: 899;
  }
}
</style>