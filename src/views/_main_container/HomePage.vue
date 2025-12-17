<template>
  <div class="app-layout min-h-screen">
    <!-- Header -->
    <AppHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
      :is-mobile="isMobile"
      :sidebar-collapsed="sidebarCollapsed"
    />

    <!-- Mobile Overlay -->
    <div
      v-if="isMobile && !sidebarCollapsed"
      class="mobile-overlay fixed top-0 left-0 w-full h-full bg-black-alpha-40 z-4"
      @click="sidebarCollapsed = true"
    />

    <div class="layout-container flex">
      <!-- Sidebar -->
      <AppSidebar
        :collapsed="sidebarCollapsed"
        :sidebar-items="navItems"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Main Content -->
      <main
        class="main-content flex-1 overflow-auto"
        :class="contentClasses"
        :style="mainContentStyle"
      >
        <div class="mt-1">
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

      // Desktop: Calculate dynamic width based on sidebar state
      const sidebarWidth = this.sidebarCollapsed ? 70 : 280; // px

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
.main-content {
  position: fixed;
  width: 87%;
  flex: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface-ground);
  min-height: 100%;
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
/* 
.app-layout {
  min-height: 100vh;
  background: var(--surface-ground);
}

.layout-container {
  display: flex;
  min-height: calc(100vh - 64px);
  position: relative;
}

.content-wrapper {
  padding: 1.5rem;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 64px - 3rem);
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
 */
@media (max-width: 768px) {
  .mobile-layout {
    overflow-x: hidden;
  }

  .main-content {
    padding: 0;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    transition: transform 0.3s ease;
  }

  .sidebar-open .main-content {
    transform: translateX(280px);
  }

  .layout-rtl .sidebar-open .main-content {
    transform: translateX(-280px);
  }

  .content-wrapper {
    padding: 1rem;
    min-height: calc(100vh - 56px - 2rem);
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
    margin: 0 !important;
    width: 100% !important;
  }

  .content-wrapper {
    padding: 0;
  }
}
</style>
