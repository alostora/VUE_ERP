<!-- في MVVMMainHeader.vue -->
<template>
  <header class="app-header" :class="{ 'mobile-header': isMobile }">
    <div class="header-container">
      <!-- Left Section -->
      <div class="header-left">
        <Button
          :icon="
            isMobile
              ? 'pi pi-bars'
              : sidebarCollapsed
              ? 'pi pi-bars'
              : 'pi pi-align-justify'
          "
          @click="$emit('toggle-sidebar')"
          text
          rounded
          class="menu-toggle"
        />

        <div class="app-brand">
          <div class="app-title">{{ $t("app.title") }}</div>
        </div>
      </div>

      <!-- Center Section -->
      <div class="header-center">
        <div class="search-container">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="searchQuery"
            :placeholder="$t('common.search')"
            type="text"
            class="search-input"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Theme Toggle -->
        <Button
          @click="toggleTheme"
          :icon="themeIcon"
          :severity="themeSeverity"
          text
          rounded
          class="theme-toggle"
          :title="themeTitle"
        />

        <!-- Language Toggle -->
        <Button
          @click="toggleLanguage"
          :icon="'pi pi-globe'"
          text
          rounded
          class="language-toggle"
          :title="languageTitle"
        />

        <!-- User Menu with Logout -->
        <div class="user-menu-container">
          <Menu ref="userMenu" :model="userMenuItems" :popup="true" />

          <div class="user-menu" @click="toggleUserMenu">
            <Avatar
              icon="pi pi-user"
              shape="circle"
              size="large"
              class="user-avatar"
            />
            <span class="user-name" v-if="!isMobile">{{ userName }}</span>
            <i class="pi pi-chevron-down user-arrow"></i>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

export default {
  name: "AppHeader",
  components: {
    Button,
    InputText,
    Avatar,
    Menu,
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-sidebar", "language-changed", "theme-changed"],
  data() {
    return {
      searchQuery: "",
      currentTheme: localStorage.getItem("theme") || "light",
      currentLanguage: localStorage.getItem("language") || "en",
      showUserMenu: false,
    };
  },
  computed: {
    themeIcon() {
      return this.currentTheme === "dark" ? "pi pi-moon" : "pi pi-sun";
    },
    themeSeverity() {
      return this.currentTheme === "dark" ? "secondary" : "warning";
    },
    themeTitle() {
      return this.currentTheme === "dark"
        ? this.$t("common.switchToLight")
        : this.$t("common.switchToDark");
    },
    languageTitle() {
      return this.currentLanguage === "en"
        ? "التبديل إلى العربية"
        : "Switch to English";
    },
    userName() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.name || "Admin";
    },
    userMenuItems() {
      return [
        {
          label: this.userName,
          icon: "pi pi-user",
          disabled: true,
          class: "menu-header",
        },
        {
          separator: true,
        },
        {
          label: this.$t("common.profile"),
          icon: "pi pi-user-edit",
          command: () => this.$router.push("/profile"),
        },
        {
          label: this.$t("common.settings"),
          icon: "pi pi-cog",
          command: () => this.$router.push("/settings"),
        },
        {
          separator: true,
        },
        {
          label: this.$t("common.logout"),
          icon: "pi pi-sign-out",
          command: () => this.logout(),
        },
      ];
    },
  },
  methods: {
    toggleTheme() {
      const newTheme = this.currentTheme === "light" ? "dark" : "light";
      this.currentTheme = newTheme;
      localStorage.setItem("theme", newTheme);
      this.applyTheme(newTheme);
      this.$emit("theme-changed", newTheme);

      // Show toast notification
      this.showToast(
        "success",
        this.$t("common.themeChanged"),
        this.$t("common.switchedTo") +
          " " +
          (newTheme === "dark"
            ? this.$t("common.darkMode")
            : this.$t("common.lightMode"))
      );
    },

    toggleLanguage() {
      const newLang = this.currentLanguage === "en" ? "ar" : "en";
      this.currentLanguage = newLang;
      localStorage.setItem("language", newLang);

      // Update i18n
      this.$i18n.locale = newLang;

      // Update HTML attributes for RTL
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLang;

      this.$emit("language-changed", {
        code: newLang,
        dir: newLang === "ar" ? "rtl" : "ltr",
      });

      // Force re-render
      this.$forceUpdate();

      // Show toast notification
      this.showToast(
        "success",
        this.$t("common.languageChanged"),
        this.$t("common.switchedTo") +
          " " +
          (newLang === "en" ? "English" : "العربية")
      );
    },

    toggleUserMenu(event) {
      this.$refs.userMenu.toggle(event);
    },

    applyTheme(theme) {
      // Remove existing theme classes
      document.documentElement.classList.remove("light-mode", "dark-mode");
      // Add new theme class
      document.documentElement.classList.add(theme + "-mode");

      // Force PrimeVue theme update
      const event = new CustomEvent("theme-change", { detail: theme });
      document.dispatchEvent(event);
    },

    logout() {
      this.$confirm.require({
        message: this.$t("common.confirmLogout"),
        header: this.$t("common.logout"),
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");

          this.showToast(
            "info",
            this.$t("common.loggedOut"),
            this.$t("common.logoutSuccess")
          );

          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
        },
        reject: () => {
          this.showToast(
            "info",
            this.$t("common.cancelled"),
            this.$t("common.logoutCancelled")
          );
        },
      });
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity,
          summary,
          detail,
          life: 3000,
        });
      }
    },
  },
  mounted() {
    // Apply initial theme
    const savedTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(savedTheme);

    // Apply initial language
    const savedLang = localStorage.getItem("language") || "en";
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  },
};
</script>

<style scoped>
/* Base Header */
.app-header {
  height: 64px;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  gap: 1rem;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.menu-toggle {
  width: 40px;
  height: 40px;
}

.app-brand {
  display: flex;
  align-items: center;
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-color);
}

/* Center Section */
.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  pointer-events: none;
}

.rtl .search-icon {
  left: auto;
  right: 0.75rem;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
}

.rtl .search-input {
  padding-left: 0.75rem;
  padding-right: 2.5rem;
}

/* Right Section */
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.theme-toggle,
.language-toggle {
  width: 40px;
  height: 40px;
}

.user-menu-container {
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.user-menu:hover {
  background: var(--surface-hover);
}

.user-avatar {
  background: var(--surface-ground);
  color: var(--text-color-secondary);
}

.user-name {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.875rem;
}

.user-arrow {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

/* Menu Styling */
:deep(.p-menu) {
  min-width: 200px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.menu-header) {
  opacity: 1 !important;
  cursor: default;
}

:deep(.menu-header:hover) {
  background: transparent !important;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .app-header.mobile-header {
    height: 56px;
  }

  .header-container {
    padding: 0 1rem;
  }

  .app-title {
    display: none;
  }

  .search-container {
    max-width: 200px;
  }

  .user-name {
    display: none;
  }

  .theme-toggle,
  .language-toggle {
    width: 36px;
    height: 36px;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .search-container {
    display: none;
  }
}
</style>
