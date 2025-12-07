<template>
  <header class="main-header" :class="{ 'mobile-header': isMobile }">
    <Menubar :model="translatedMenuItems" class="header-menubar">
      <template #start>
        <div class="header-start">
          <!-- Menu Toggle Button - Different icon for mobile -->
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
            class="menu-toggle-btn"
            :severity="isMobile ? 'secondary' : 'primary'"
            v-tooltip="
              isMobile
                ? 'Menu'
                : sidebarCollapsed
                ? 'Expand Sidebar'
                : 'Collapse Sidebar'
            "
          />

          <!-- App Title - Hide on very small mobile -->
          <span class="app-title" :class="{ 'hidden-on-small': isMobile }">
            {{ $t("app.title") }}
          </span>

          <!-- Mobile-only Logo -->
          <div v-if="isMobile" class="mobile-logo">
            <i class="pi pi-shield"></i>
          </div>
        </div>
      </template>

      <template #end>
        <div class="header-end" :class="{ 'mobile-end': isMobile }">
          <!-- Search - Collapsible on mobile -->
          <div
            class="search-container"
            :class="{ 'search-expanded': searchExpanded }"
          >
            <transition name="slide-fade">
              <InputText
                v-if="!isMobile || searchExpanded"
                :placeholder="$t('header.search')"
                type="text"
                class="search-input"
                @blur="searchExpanded = false"
              />
            </transition>

            <Button
              :icon="searchExpanded ? 'pi pi-times' : 'pi pi-search'"
              text
              rounded
              @click="toggleSearch"
              class="search-toggle-btn"
              v-tooltip="searchExpanded ? 'Close Search' : 'Search'"
            />
          </div>

          <div class="action-buttons">
            <!-- Theme Toggle -->
            <Button
              @click="toggleTheme"
              :icon="currentTheme.icon"
              :severity="currentTheme.severity"
              text
              rounded
              class="theme-toggle-btn"
              :title="currentTheme.title"
            />

            <!-- Language Toggle -->
            <Button
              @click="toggleLanguage"
              :icon="currentLanguage.icon"
              text
              rounded
              class="language-toggle-btn"
              :title="currentLanguage.label"
            />

            <!-- User Menu -->
            <div class="user-menu-container">
              <Menu ref="userMenu" :model="logoutMenuItem" :popup="true" />

              <Button
                :icon="isMobile ? 'pi pi-user' : 'pi pi-user'"
                rounded
                text
                severity="secondary"
                class="user-menu-btn"
                @click="toggleUserMenu"
                :label="!isMobile ? userInitial : ''"
              />
            </div>
          </div>
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

export default {
  components: {
    Menubar,
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
      searchExpanded: false,
      currentLang: this.$i18n.locale,
      currentTheme:
        localStorage.getItem("theme") === "dark"
          ? {
              mode: "dark",
              icon: "pi pi-moon",
              severity: "secondary",
              title: "Switch to Light Mode",
            }
          : {
              mode: "light",
              icon: "pi pi-sun",
              severity: "warning",
              title: "Switch to Dark Mode",
            },
      languages: [
        { code: "en", label: "English", icon: "pi pi-globe", dir: "ltr" },
        { code: "ar", label: "العربية", icon: "pi pi-globe", dir: "rtl" },
      ],
      menuItems: [
        { label: "menu.home", icon: "pi pi-home" },
        { label: "menu.users", icon: "pi pi-folder" },
        { label: "menu.settings", icon: "pi pi-cog" },
      ],
      logoutMenuItem: [
        {
          label: this.$t("header.logout") || "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            this.logout();
          },
        },
      ],
    };
  },
  computed: {
    userInitial() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.name ? user.name.charAt(0).toUpperCase() : "U";
    },
    currentLanguage() {
      return (
        this.languages.find((lang) => lang.code === this.currentLang) ||
        this.languages[0]
      );
    },
    translatedMenuItems() {
      return this.menuItems.map((item) => ({
        ...item,
        label: this.$t(item.label),
      }));
    },
  },
  methods: {
    toggleSearch() {
      if (this.isMobile) {
        this.searchExpanded = !this.searchExpanded;
      }
    },

    toggleUserMenu(event) {
      this.$refs.userMenu.toggle(event);
    },

    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      this.$toast.add({
        severity: "info",
        summary: "Logged Out",
        detail: "You have been successfully signed out.",
        life: 3000,
      });

      this.$router.push("/login");
    },

    toggleLanguage() {
      this.currentLang = this.currentLang === "en" ? "ar" : "en";
      const newLang = this.currentLanguage;

      this.$i18n.locale = newLang.code;
      localStorage.setItem("language", newLang.code);
      document.documentElement.dir = newLang.dir;
      document.documentElement.lang = newLang.code;

      this.$forceUpdate();
      this.$emit("language-changed", newLang);
    },

    toggleTheme() {
      const newTheme = this.currentTheme.mode === "light" ? "dark" : "light";

      this.currentTheme =
        newTheme === "dark"
          ? {
              mode: "dark",
              icon: "pi pi-moon",
              severity: "secondary",
              title: "Switch to Light Mode",
            }
          : {
              mode: "light",
              icon: "pi pi-sun",
              severity: "warning",
              title: "Switch to Dark Mode",
            };

      localStorage.setItem("theme", newTheme);
      this.applyTheme(newTheme);
      this.$emit("theme-changed", newTheme);
    },

    applyTheme(theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem("theme") || "light";
      this.applyTheme(savedTheme);
    },
  },
  mounted() {
    const langConfig = this.currentLanguage;
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = this.currentLang;

    this.initializeTheme();
  },
};
</script>

<style scoped>
.main-header {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
}

.header-menubar {
  border: none;
  border-radius: 0;
  padding: 0 1rem;
  background: transparent;
  height: 100%;
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.menu-toggle-btn {
  width: 40px;
  height: 40px;
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-color);
  white-space: nowrap;
}

.mobile-logo {
  display: none;
  color: var(--primary-500);
  font-size: 1.5rem;
}

.header-end {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.search-container {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-input {
  transition: all 0.3s ease;
  width: 250px;
}

.search-toggle-btn {
  width: 40px;
  height: 40px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle-btn,
.language-toggle-btn {
  width: 40px;
  height: 40px;
}

.user-menu-container {
  position: relative;
}

.user-menu-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .main-header {
    height: 56px;
  }

  .header-menubar {
    padding: 0 0.75rem;
  }

  .header-start {
    gap: 0.75rem;
  }

  .app-title.hidden-on-small {
    display: none;
  }

  .mobile-logo {
    display: block;
  }

  .menu-toggle-btn {
    width: 36px;
    height: 36px;
  }

  .header-end.mobile-end {
    gap: 0.5rem;
  }

  .search-container {
    order: 2;
  }

  .search-input {
    width: 200px;
  }

  .search-toggle-btn {
    width: 36px;
    height: 36px;
  }

  .theme-toggle-btn,
  .language-toggle-btn {
    width: 36px;
    height: 36px;
  }

  .user-menu-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .action-buttons {
    gap: 0.25rem;
  }
}

/* Very Small Mobile */
@media (max-width: 480px) {
  .header-menubar {
    padding: 0 0.5rem;
  }

  .search-input {
    width: 160px;
  }

  .app-title {
    font-size: 1.1rem;
  }
}

/* Search Animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

/* RTL Support */
[dir="rtl"] .slide-fade-enter-from,
[dir="rtl"] .slide-fade-leave-to {
  transform: translateX(10px);
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .menu-toggle-btn,
  .search-toggle-btn,
  .theme-toggle-btn,
  .language-toggle-btn,
  .user-menu-btn {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
