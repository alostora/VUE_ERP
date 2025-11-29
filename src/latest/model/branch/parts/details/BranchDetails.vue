<template>
  <div class="branch-show-wrapper" :class="layoutClasses">
    <div class="branch-layout-container">
      <main
        class="branch-main-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <div class="branch-show-page">
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
              @click="fetchBranch"
            />
          </div>

          <!-- Branch Content -->
          <div v-else-if="branch.id" class="branch-content">
            <!-- Company Hero Banner -->
            <section
              class="company-hero"
              v-if="company && (company.cover || company.logo)"
            >
              <div
                class="company-hero-bg"
                :style="
                  company?.cover?.file_path
                    ? {
                        backgroundImage:
                          'url(' + cleanFilePath(company.cover.file_path) + ')',
                      }
                    : {}
                "
              ></div>
              <div class="company-hero-overlay"></div>
              <div class="company-hero-content">
                <img
                  v-if="company?.logo?.file_path"
                  :src="cleanFilePath(company.logo.file_path)"
                  alt="Company Logo"
                  class="company-logo"
                />
                <div class="company-titles">
                  <h3 class="company-name mb-1">{{ company?.name }}</h3>
                  <div
                    v-if="company?.name_ar"
                    class="text-sm text-color-secondary"
                  >
                    {{ company.name_ar }}
                  </div>
                </div>
              </div>
            </section>

            <!-- Branch Title follows table pattern -->
            <h2 class="mb-1">{{ branch.name }}</h2>
            <div
              v-if="branch.name_ar"
              class="text-sm text-color-secondary mb-3"
            >
              {{ branch.name_ar }}
            </div>

            <Divider />
            <div class="grid">
              <div class="col-12 md:col-6">
                <strong>{{ $t("branches.companyId") || "Company ID" }}:</strong>
                {{ branch.company_id }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("branches.phone") || "Phone" }}:</strong>
                {{ branch.phone || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("branches.address") || "Address" }}:</strong>
                {{ branch.address || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong
                  >{{ $t("branches.addressAr") || "Address (Arabic)" }}:</strong
                >
                {{ branch.address_ar || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("common.createdAt") || "Created At" }}:</strong>
                {{ formatDate(branch.created_at) }}
              </div>
            </div>

            <!-- Company Info Summary -->
            <Divider />
            <div class="grid company-info-grid">
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.phone") || "Phone" }}:</strong>
                {{ company?.phone || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.email") || "Email" }}:</strong>
                {{ company?.email || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.address") || "Address" }}:</strong>
                {{ company?.address || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.country") || "Country" }}:</strong>
                {{ company?.country?.name || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong
                  >{{ $t("companies.governorate") || "Governorate" }}:</strong
                >
                {{ company?.governorate?.name || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.city") || "City" }}:</strong>
                {{ company?.city?.name || "-" }}
              </div>
              <div class="col-12 md:col-6">
                <strong>{{ $t("companies.currency") || "Currency" }}:</strong>
                {{ company?.currency?.name || "-" }}
              </div>
            </div>
            <div class="mt-3">
              <Button
                :label="$t('common.edit') || 'Edit'"
                icon="pi pi-pencil"
                class="p-button-sm"
                @click="editBranch"
              />
              <Button
                :label="$t('common.back') || 'Back'"
                icon="pi pi-arrow-left"
                class="p-button-text p-button-sm ml-2"
                @click="goBackToBranches"
              />
            </div>
          </div>

          <!-- Nested routes if needed -->
          <RouterView :branch="branch" :branch_id="branch_id" />
        </div>
      </main>
    </div>

    <!-- Edit Branch Modal -->
    <BranchEditModal
      ref="branchEditModal"
      :branch="branch"
      @branch-updated="handleBranchUpdated"
    />

    <Toast />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import general_request from "../../../../views/layouts/constants/general_request";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Divider from "primevue/divider";

export default {
  name: "BranchDetails",
  components: {
    RouterView,
    Button,
    ProgressSpinner,
    Message,
    Toast,
    Divider,
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
    };
  },
  computed: {
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  background: var(--surface-ground);
  position: relative;
  z-index: 1;
}

.branch-main-content.sidebar-collapsed {
  margin-left: 70px;
}

.branch-rtl .branch-main-content {
  margin-left: 0;
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
