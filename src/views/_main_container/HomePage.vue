<template>
  <div class="app-layout min-h-screen">
    <AppHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
      :is-mobile="isMobile"
      :sidebar-collapsed="sidebarCollapsed"
    />

    <div
      v-if="isMobile && !sidebarCollapsed"
      class="mobile-overlay fixed top-0 left-0 w-full h-full bg-black-alpha-40 z-4"
      @click="sidebarCollapsed = true"
    />

    <div class="layout-container flex">
      <AppSidebar
        :collapsed="sidebarCollapsed"
        :sidebar-items="navItems"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <main
        class="main-content"
        :class="contentClasses"
        :style="mainContentStyle"
      >
        <div class="content-wrapper">
          <RouterView />
        </div>
      </main>
    </div>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import AppHeader from "./layouts/MVVMMainHeader.vue";
import AppSidebar from "./layouts/MVVMSidebar.vue";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import sidebarItems from "@/utils/sidebarItems";

export default {
  name: "HomePage",
  components: {
    RouterView,
    AppHeader,
    AppSidebar,
    Toast,
    ConfirmDialog,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentDirection:
        localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
      currentTheme: localStorage.getItem("theme") || "light",
      isMobile: false,
      resizeTimeout: null,
    };
  },
  computed: {
    navItems() {
      return sidebarItems("homePage");
    },
    mainContentStyle() {
      if (this.isMobile) {
        return {
          width: "100%",
          marginLeft: "0",
          marginRight: "0",
        };
      }

      const sidebarWidth = this.sidebarCollapsed ? 70 : 280;

      if (this.currentDirection === "ltr") {
        return {
          width: `calc(100% - ${sidebarWidth}px)`,
          marginLeft: `${sidebarWidth}px`,
          marginRight: "0",
        };
      } else {
        return {
          width: `calc(100% - ${sidebarWidth}px)`,
          marginLeft: "0",
          marginRight: `${sidebarWidth}px`,
        };
      }
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    onLanguageChanged(language) {
      this.currentDirection = language.dir;
      document.documentElement.dir = language.dir;
      document.documentElement.lang = language.code;
    },
    onThemeChanged(theme) {
      document.documentElement.classList.remove("light-mode", "dark-mode");
      document.documentElement.classList.add(`${theme}-mode`);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },
    handleResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(this.checkMobile, 100);
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.handleResize);

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(`${savedTheme}-mode`);

    const savedLang = localStorage.getItem("language") || "en";
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--surface-ground);
}

.layout-container {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface-ground);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.content-wrapper {
  flex: 1;
  padding: 1.5rem;
  min-height: 100%;
  width: 100%;
}

.layout-ltr:not(.mobile-layout) .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-ltr:not(.mobile-layout) .main-content.content-expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

.layout-rtl:not(.mobile-layout) .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-rtl:not(.mobile-layout) .main-content.content-expanded {
  margin-right: 70px;
  width: calc(100% - 70px);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 99;
  animation: fadeIn 0.2s ease;
}

@media (max-width: 768px) {
  .layout-container {
    overflow: visible;
  }

  .main-content {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 !important;
    width: 100% !important;
    z-index: 1;
    overflow-y: auto;
  }

  .content-wrapper {
    padding: 1rem;
    min-height: calc(100vh - 64px - 2rem);
  }

  .sidebar-open .main-content {
    transform: translateX(280px);
  }

  .layout-rtl .sidebar-open .main-content {
    transform: translateX(-280px);
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0.75rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media print {
  .app-header,
  .app-sidebar {
    display: none !important;
  }

  .main-content {
    position: static !important;
    margin: 0 !important;
    width: 100% !important;
    overflow: visible !important;
  }

  .content-wrapper {
    padding: 0;
  }
}
</style>
