<template>
  <div class="branch-show-wrapper" :class="layoutClasses">
    <div class="branch-layout-container">
      <!-- Branch Header -->
      <BranchHeader
        :branch="branch"
        :current-page="$route.name"
        @toggle-sidebar="toggleSidebar"
        @go-back="goBackToBranches"
        @edit-branch="editBranch"
      />

      <!-- Branch Sidebar -->
      <BranchSidebar
        :branch="branch"
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :isMobile="isMobile"
        @toggle="toggleSidebar"
      />

      <!-- Mobile Overlay -->
      <div
        v-if="isMobile && !sidebarCollapsed"
        class="branch-sidebar-overlay"
        @click="toggleSidebar"
      ></div>
      <!-- Main Content -->

      <main
        class="branch-main-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        
        <div class="branch-show-page">
          <!-- Nested routes if needed -->
          <RouterView :branch="branch" :branch_id="branch_id" />
        </div>
      </main>
    </div>

    <PosModal ref="posModal" :company-id="companyId" :branch-id="branchId" />
    <Toast />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import general_request from "../../../views/layouts/constants/general_request";

import BranchHeader from "../layouts/BranchHeader.vue";
import BranchSidebar from "../layouts/BranchSidebar.vue";
import BranchEditModal from "./BranchEditModal.vue";
import PosModal from "./pos/PosModal.vue";

export default {
  name: "BranchShow",
  components: {
    RouterView,
    BranchHeader,
    BranchSidebar,
    BranchEditModal,
    PosModal,
  },
  props: {
    branch_id: {
      type: String,
      required: false, // will fallback to route param
    },
    company_id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      branch: {},
      company: {},
      loading: false,
      error: "",
      sidebarCollapsed: false,
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
      hasPosAccess: true, // Set to true to always show, false to hide
    };
  },
  computed: {
    companyId() {
      return this.$route.params.company_id;
    },
    branchId() {
      return this.$route.params.branch_id;
    },
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
    },
    layoutClasses() {
      return {
        "branch-ltr": this.currentDirection === "ltr",
        "branch-rtl": this.currentDirection === "rtl",
        "mobile-view": this.isMobile,
      };
    },
  },
  mounted() {
    this.fetchBranch();
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
    async fetchBranch() {
      this.loading = true;
      this.error = "";

      try {
        const branchId = this.branch_id || this.$route.params.branch_id;
        if (!branchId) {
          throw new Error("Branch ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/branch/${branchId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.branch = response.data.data;
          this.company = response.data.data.company || {};
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching branch:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadBranch") ||
          "Failed to load branch";
      } finally {
        this.loading = false;
      }
    },

    cleanFilePath(path) {
      if (!path) return "";
      try {
        // Some API values include backticks/spaces; strip them
        return String(path)
          .replace(/[`'\"]/g, "")
          .trim();
      } catch (e) {
        return path;
      }
    },

    formatDate(value) {
      if (!value) return "-";
      try {
        const d = new Date(value);
        return d.toLocaleString();
      } catch (e) {
        return value;
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    goBackToBranches() {
      const companyId = this.company_id || this.$route.params.company_id;
      if (companyId) {
        this.$router.push(`/company/${companyId}/branches`);
      } else {
        this.$router.push(`/company/branches`);
      }
    },

    editBranch() {
      this.$refs.branchEditModal &&
        this.$refs.branchEditModal.openModal &&
        this.$refs.branchEditModal.openModal();
    },

    handleBranchUpdated(updatedBranch) {
      this.branch = { ...this.branch, ...updatedBranch };
      this.showToast(
        "success",
        this.$t("common.success") || "Success",
        this.$t("branches.branchUpdated") || "Branch updated"
      );
      this.fetchBranch();
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
        this.$toast.add({ severity, summary, detail, life: 3000 });
      }
    },

    openPosModal() {
      if (this.$refs.posModal) {
        this.$refs.posModal.openModal();
      }
    },
  },
};
</script>

<style scoped>
.branch-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}

.branch-layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.branch-main-content {
  min-height: calc(100vh - 70px);
  margin-left: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  background: var(--surface-ground);
  margin-top: 70px;
  position: relative;
  z-index: 1;
}

.branch-main-content.sidebar-collapsed {
  margin-left: 70px;
}

.branch-rtl .branch-main-content {
  margin-left: 0;
  margin-right: 280px;
}

.branch-rtl .branch-main-content.sidebar-collapsed {
  margin-right: 70px;
}

.branch-show-page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  transition: all 0.3s ease;
}

.branch-sidebar-overlay {
  position: absolute;
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

.branch-content {
  animation: fadeIn 0.3s ease;
}

/* Company Hero styles */
.company-hero {
  position: relative;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.company-hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
}

.company-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.15));
}

.company-hero-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  z-index: 2;
}

.company-logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.company-titles .company-name {
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.company-info-grid {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1rem;
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

@media (max-width: 768px) {
  .branch-layout-container {
    overflow: visible;
  }

  .branch-main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    margin-top: 70px;
  }

  .branch-sidebar-overlay {
    top: 70px;
    z-index: 899;
  }
}
</style>
