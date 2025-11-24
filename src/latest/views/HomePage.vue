<template>
  <div class="layout-wrapper" :class="[currentDirection, currentTheme]">
    <MVVMMainHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
    />
    
    <!-- Overlay للخلفية في الموبايل -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="layout-container">
      <MVVMSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />
      <main
        class="main-content"
        :class="{ 'content-expanded': sidebarCollapsed }"
      >
        <RouterView :company="company" :company_id="company_id" />
        <MVVMFooter />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
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
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    onLanguageChanged(language) {
      this.currentDirection = language.dir;
    },
    onThemeChanged(theme) {
      this.currentTheme = theme;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      // إغلاق السايدبار تلقائياً في الموبايل
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Initialize theme class
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: all 0.3s ease;
  min-height: 100%;
}

/* LTR - Sidebar on left */
.layout-wrapper.ltr .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.ltr .main-content.content-expanded {
  margin-left: 60px;
  width: calc(100% - 60px);
}

/* RTL - Sidebar on right */
.layout-wrapper.rtl .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.rtl .main-content.content-expanded {
  margin-right: 60px;
  width: calc(100% - 60px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout-wrapper.ltr .main-content,
  .layout-wrapper.rtl .main-content {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .layout-wrapper.ltr .main-content.content-expanded,
  .layout-wrapper.rtl .main-content.content-expanded {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  /* Overlay Styles */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
    backdrop-filter: blur(2px);
  }
}
</style>