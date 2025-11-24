<template>
  <div class="company-layout-wrapper" :class="layoutClasses">
    <!-- Company Header Bar -->
    <div class="company-header-bar" :class="headerClasses">
      <div
        class="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border"
      >
        <div class="flex align-items-center gap-3">
          <Button
            icon="pi pi-bars"
            class="p-button-text"
            @click="toggleSidebar"
          />
          <div class="flex align-items-center gap-2">
            <img
              v-if="company.logo"
              :src="company.logo.file_path"
              :alt="company.name"
              class="company-logo-header"
            />
            <div>
              <h3 class="m-0">{{ company.name }}</h3>
              <p class="m-0 text-color-secondary text-sm">
                {{ currentPageTitle }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex align-items-center gap-2">
          <Button
            icon="pi pi-arrow-left"
            :label="$t('common.back')"
            class="p-button-text"
            @click="goBackToCompanies"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isMobile && !sidebarCollapsed"
      class="company-sidebar-overlay"
      @click="toggleSidebar"
    ></div>

    <div class="company-layout-container">
      <!-- Content Area -->
      <main class="company-main-content" :class="contentClasses">
        <RouterView :company="company" :company_id="company_id" />
      </main>
    </div>

    <!-- Company Sidebar -->
    <CompanySidebar
      :company="company"
      :company_id="company_id"
      :collapsed="sidebarCollapsed"
      :direction="currentDirection"
    />

    <Toast />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import CompanySidebar from "../../model/company/parts/details/CompanySidebar.vue";
import Button from "primevue/button";
import Toast from "primevue/toast";
import general_request from "./constants/general_request";

export default {
  name: "CompanyLayout",
  components: {
    RouterView,
    CompanySidebar,
    Button,
    Toast,
  },
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
      sidebarCollapsed: false,
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
    };
  },
  computed: {
    currentPageTitle() {
      const routeName = this.$route.name;
      const titles = {
        "company-show": this.$t("companies.companyDetails"),
        "company-categories": this.$t("companies.categories"),
      };
      return titles[routeName] || this.$t("companies.companyDetails");
    },
    layoutClasses() {
      const isRTL = this.currentLanguage === "ar";
      const isMainSidebarCollapsed = document
        .querySelector(".layout-wrapper")
        ?.classList.contains("content-expanded");

      return {
        "company-ltr": !isRTL,
        "company-rtl": isRTL,
        "company-main-sidebar-collapsed": isMainSidebarCollapsed,
      };
    },
    headerClasses() {
      return {
        "company-sidebar-collapsed": this.sidebarCollapsed,
      };
    },
    contentClasses() {
      return {
        "company-sidebar-collapsed": this.sidebarCollapsed,
      };
    },
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
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
    if (this.languageChangeListener) {
      this.languageChangeListener();
    }
  },
  methods: {
    async fetchCompany() {
      this.loading = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/${this.company_id}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });
        this.company = response.data.data;
      } catch (error) {
        console.error("Error fetching company:", error);
        this.showToast("error", "Error", "Failed to load company details");
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

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },

    setupLanguageListener() {
      this.languageChangeListener = () => {
        this.currentLanguage = localStorage.getItem("language") || "en";
      };

      window.addEventListener("storage", this.languageChangeListener);
      window.addEventListener("language-changed", this.languageChangeListener);
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
  watch: {
    "$i18n.locale"(newLocale) {
      this.currentLanguage = newLocale;
    },
  },
};
</script>

<style scoped>
.company-layout-wrapper {
  min-height: calc(100vh - 60px);
  background: var(--surface-ground);
  margin-top: 60px;
  transition: all 0.3s ease;
}

/* LTR Layout - English */
.company-ltr.company-layout-wrapper {
  margin-left: 280px;
}

.company-ltr.company-main-sidebar-collapsed.company-layout-wrapper {
  margin-left: 60px;
}

/* RTL Layout - Arabic */
.company-rtl.company-layout-wrapper {
  margin-left: 0;
  margin-right: 280px;
}

.company-rtl.company-main-sidebar-collapsed.company-layout-wrapper {
  margin-right: 60px;
}

.company-header-bar {
  background: var(--surface-section);
  border-bottom: 1px solid var(--surface-border);
  position: fixed;
  top: 60px;
  height: 60px;
  z-index: 900;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

/* LTR Header - English */
.company-ltr .company-header-bar {
  left: 280px;
  right: 280px;
}

.company-ltr.company-main-sidebar-collapsed .company-header-bar {
  left: 60px;
}

.company-ltr .company-header-bar.company-sidebar-collapsed {
  right: 0;
}

/* RTL Header - Arabic - COMPLETELY FIXED */
.company-rtl .company-header-bar {
  left: 280px; /* Start after main sidebar */
  right: 280px; /* End before company sidebar */
}

.company-rtl.company-main-sidebar-collapsed .company-header-bar {
  left: 60px; /* Start after collapsed main sidebar */
  right: 280px; /* End before company sidebar */
}

/* WHEN COMPANY SIDEBAR IS COLLAPSED - FIXED */
.company-rtl .company-header-bar.company-sidebar-collapsed {
  left: 280px; /* ALWAYS respect main sidebar space */
  right: 0; /* Extend to right edge */
}

.company-rtl.company-main-sidebar-collapsed
  .company-header-bar.company-sidebar-collapsed {
  left: 60px; /* ALWAYS respect collapsed main sidebar space */
  right: 0; /* Extend to right edge */
}

.company-logo-header {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.company-layout-container {
  min-height: calc(100vh - 120px);
  padding-top: 60px;
  position: relative;
}

.company-main-content {
  background: var(--surface-ground);
  min-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 1rem;
  transition: all 0.3s ease;
}

/* LTR Content - English */
.company-ltr .company-main-content:not(.company-sidebar-collapsed) {
  margin-right: 280px;
}

.company-ltr .company-main-content.company-sidebar-collapsed {
  margin-right: 0;
}

/* RTL Content - Arabic */
.company-rtl .company-main-content:not(.company-sidebar-collapsed) {
  margin-left: 280px;
  margin-right: 0;
}

.company-rtl .company-main-content.company-sidebar-collapsed {
  margin-left: 0;
  margin-right: 0;
}

.company-sidebar-overlay {
  position: fixed;
  top: 120px;
  left: 0;
  width: 100%;
  height: calc(100vh - 120px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 899;
  backdrop-filter: blur(2px);
}

/* Ensure header alignment */
.company-header-bar > div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* RTL specific adjustments */
.company-rtl .company-header-bar .flex {
  flex-direction: row-reverse;
}

.company-rtl .company-header-bar .flex:first-child {
  flex-direction: row;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .company-layout-wrapper {
    margin-top: 60px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .company-header-bar {
    top: 60px;
    left: 0 !important;
    right: 0 !important;
    z-index: 1100;
  }

  .company-layout-container {
    min-height: calc(100vh - 120px);
    padding-top: 60px;
  }

  .company-main-content {
    width: 100%;
    padding: 0.5rem;
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .company-sidebar-overlay {
    top: 120px;
  }
}
</style>
