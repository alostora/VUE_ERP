<template>
  <header class="main-header">
    <Menubar :model="translatedMenuItems">
      <template #start>
        <div class="header-start">
          <Button
            icon="pi pi-bars"
            @click="$emit('toggle-sidebar')"
            text
            rounded
          />
          <span class="app-title">{{ $t("app.title") }}</span>
        </div>
      </template>

      <template #end>
        <div class="header-end">
          <div class="search-container">
            <InputText :placeholder="$t('header.search')" type="text" />
            <Button icon="pi pi-search" text />
          </div>

          <div class="action-buttons">
            <Button
              @click="toggleTheme"
              :icon="currentTheme.icon"
              :severity="currentTheme.severity"
              text
              rounded
              :title="currentTheme.title"
            />

            <Button
              @click="toggleLanguage"
              :icon="currentLanguage.icon"
              text
              rounded
              :title="currentLanguage.label"
            />

            <div class="user-menu-container">
              <Menu ref="userMenu" :model="logoutMenuItem" :popup="true" />

              <Button
                icon="pi pi-user"
                rounded
                text
                severity="secondary"
                class="p-button-lg"
                @click="toggleUserMenu"
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
  emits: ["toggle-sidebar", "language-changed", "theme-changed"],
  data() {
    return {
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

    isMobile() {
      return window.innerWidth <= 768;
    },
  },
  mounted() {
    const langConfig = this.currentLanguage;
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = this.currentLang;

    if (this.isMobile()) {
      this.$emit("toggle-sidebar");
    }

    this.initializeTheme();
  },
};
</script>

<style scoped>
.main-header {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.header-end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-container {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Allow search to take space on desktop */
}

.action-buttons {
  /* Group theme, language, and user menu buttons */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-menu-container {
  /* This ensures the Menu component anchors correctly relative to the button */
  position: relative;
}

/* Adjust Avatar button size for better clickability */
.user-menu-container .p-button-lg {
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.p-menubar) {
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  background: transparent;
}

/* Theme transition for smooth mode switching */
:deep(*) {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* --- 📱 Mobile View Adjustments (Maximum Width 768px) --- */
@media (max-width: 768px) {
    
    /* 1. Hide the Search Input Text to save space */
    .search-container :deep(.p-inputtext) {
        display: none;
    }

    /* 2. Remove the search container's ability to grow */
    .search-container {
        flex-grow: 0; 
        /* Add some padding next to the search icon */
        padding-left: 0.5rem; 
        padding-right: 0.5rem;
    }
    
    /* 3. Ensure the main header elements don't wrap and fit */
    .header-start, .header-end {
        flex-shrink: 0;
    }
}
</style>