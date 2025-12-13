<template>
  <div class="app-layout" :class="layoutClasses">
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
      class="mobile-overlay"
      @click="toggleSidebar"
    ></div>

    <div class="layout-container">
      <!-- Sidebar -->
      <AppSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />

      <!-- Main Content -->
      <main class="main-content" :class="contentClasses">
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
    layoutClasses() {
      return {
        "layout-ltr": this.currentDirection === "ltr",
        "layout-rtl": this.currentDirection === "rtl",
        "mobile-layout": this.isMobile,
      };
    },
    contentClasses() {
      return {
        "content-expanded": this.sidebarCollapsed && !this.isMobile,
        "mobile-content": this.isMobile,
        "sidebar-open": this.isMobile && !this.sidebarCollapsed,
      };
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;

      // Prevent body scrolling when sidebar is open on mobile
      if (this.isMobile) {
        if (!this.sidebarCollapsed) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    },

    onLanguageChanged(language) {
      this.currentDirection = language.dir;
      document.documentElement.dir = language.dir;
      document.documentElement.lang = language.code;

      // Update i18n locale
      this.$i18n.locale = language.code;
    },

    onThemeChanged(theme) {
      this.currentTheme = theme;
      document.documentElement.classList.remove("light-mode", "dark-mode");
      document.documentElement.classList.add(theme + "-mode");
    },

    checkMobile() {
      const width = window.innerWidth;
      this.isMobile = width <= 768;

      // Auto-collapse sidebar on mobile
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },

    handleResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.checkMobile();
      }, 100);
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.handleResize);

    // Set initial theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");

    // Set initial language direction
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
/* Base Layout */
.app-layout {
  min-height: 100vh;
  background: var(--surface-ground);
}

.layout-container {
  display: flex;
  min-height: calc(100vh - 64px);
  position: relative;
}

/* Main Content */
.main-content {
  flex: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface-ground);
  min-height: 100%;
}

/* Desktop - LTR */
.layout-ltr:not(.mobile-layout) .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-ltr:not(.mobile-layout) .main-content.content-expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Desktop - RTL */
.layout-rtl:not(.mobile-layout) .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-rtl:not(.mobile-layout) .main-content.content-expanded {
  margin-right: 70px;
  width: calc(100% - 70px);
}

/* Content Wrapper */
.content-wrapper {
  padding: 1.5rem;
  /*  max-width: 1600px; */
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 64px - 3rem); /* Viewport - header - padding */
}

/* Mobile Overlay */
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

/* Mobile & Tablet Styles */
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

  /* When sidebar is open, shift content */
  .sidebar-open .main-content {
    transform: translateX(280px);
  }

  .layout-rtl .sidebar-open .main-content {
    transform: translateX(-280px);
  }

  .content-wrapper {
    padding: 1rem;
    min-height: calc(100vh - 56px - 2rem); /* Mobile header - padding */
  }
}

/* Small Mobile */
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

/* Print Styles */
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
