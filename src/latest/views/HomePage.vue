<template>
  <div
    class="layout-wrapper"
    :class="[currentDirection, currentTheme, { 'mobile-view': isMobile }]"
  >
    <MVVMMainHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
      :is-mobile="isMobile"
      :sidebar-collapsed="sidebarCollapsed"
    />

    <!-- Enhanced Mobile Overlay -->
    <div
      v-if="isMobile && !sidebarCollapsed"
      class="sidebar-overlay"
      @click="toggleSidebar"
      @touchmove.prevent
    ></div>

    <div
      class="layout-container"
      :class="{ 'sidebar-open': isMobile && !sidebarCollapsed }"
    >
      <MVVMSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />

      <main
        class="main-content"
        :class="{
          'content-expanded': sidebarCollapsed && !isMobile,
          'mobile-content': isMobile,
          'sidebar-open': isMobile && !sidebarCollapsed,
        }"
      >
        <RouterView :company="company" :company_id="company_id" />
        <MVVMFooter />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import MVVMMainHeader from "./layouts/MVVMMainHeader.vue";
import MVVMSidebar from "./layouts/MVVMSidebar.vue";
import MVVMContent from "./layouts/MVVMContent.vue";
import MVVMFooter from "./layouts/MVVMFooter.vue";

export default {
  components: {
    RouterView,
    MVVMMainHeader,
    MVVMSidebar,
    MVVMContent,
    MVVMFooter,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentDirection:
        localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
      currentTheme: localStorage.getItem("theme") || "light",
      isMobile: false,
      windowWidth: 0,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;

      // Prevent body scrolling when sidebar is open on mobile
      if (this.isMobile) {
        if (!this.sidebarCollapsed) {
          document.body.style.overflow = "hidden";
          document.body.style.position = "fixed";
          document.body.style.width = "100%";
        } else {
          document.body.style.overflow = "";
          document.body.style.position = "";
          document.body.style.width = "";
        }
      }
    },

    onLanguageChanged(language) {
      this.currentDirection = language.dir;
    },

    onThemeChanged(theme) {
      this.currentTheme = theme;
    },

    checkMobile() {
      const width = window.innerWidth;
      const previousMobileState = this.isMobile;

      // Check for mobile (including tablets in portrait)
      this.isMobile = width <= 992; // Changed from 768 to 992 for better tablet support

      // Auto-close sidebar on mobile
      if (this.isMobile && !this.sidebarCollapsed) {
        this.sidebarCollapsed = true;
      }

      // Reset body styles if switching from mobile to desktop
      if (previousMobileState && !this.isMobile) {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }

      this.windowWidth = width;
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
    window.addEventListener("orientationchange", this.handleResize);

    // Initialize theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("orientationchange", this.handleResize);

    // Clean up body styles
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  },
};
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--surface-ground);
  transition: all 0.3s ease;
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 64px);
  position: relative;
  transition: all 0.3s ease;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100%;
  background: var(--surface-ground);
  overflow-x: hidden;
}

/* Desktop - LTR (Sidebar on left) */
.layout-wrapper.ltr:not(.mobile-view) .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.ltr:not(.mobile-view) .main-content.content-expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Desktop - RTL (Sidebar on right) */
.layout-wrapper.rtl:not(.mobile-view) .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.rtl:not(.mobile-view) .main-content.content-expanded {
  margin-right: 70px;
  width: calc(100% - 70px);
}

/* Mobile & Tablet Styles (up to 992px) */
@media (max-width: 992px) {
  .layout-wrapper.mobile-view {
    overflow-x: hidden;
  }

  .layout-container {
    position: relative;
  }

  .main-content {
    padding: 1rem;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    transition: transform 0.3s ease;
  }

  /* When sidebar is open, shift content */
  .layout-container.sidebar-open .main-content {
    transform: translateX(280px);
  }

  .layout-wrapper.rtl .layout-container.sidebar-open .main-content {
    transform: translateX(-280px);
  }

  /* Sidebar Overlay */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 899;
    animation: fadeIn 0.2s ease;
  }

  .layout-wrapper.rtl .sidebar-overlay {
    left: unset;
    right: 0;
  }
}

/* Small Mobile (up to 576px) */
@media (max-width: 576px) {
  .main-content {
    padding: 0.75rem;
  }

  .layout-container.sidebar-open .main-content {
    transform: translateX(280px);
  }
}

/* Animation for overlay */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Prevent horizontal scroll on mobile */
@media (max-width: 992px) {
  body {
    overflow-x: hidden;
  }
}
</style>
