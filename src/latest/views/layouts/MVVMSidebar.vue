<template>
  <aside
    class="app-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
    :style="{ width: sidebarWidth }"
  >
    <div class="sidebar-container">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <i class="pi pi-shield"></i>
          </div>
          <transition name="fade-slide">
            <span v-if="!collapsed" class="brand-text">ERP System</span>
          </transition>
        </div>

        <!-- Close Button for Mobile -->
        <Button
          v-if="isMobile && !collapsed"
          icon="pi pi-times"
          @click="$emit('toggle')"
          text
          rounded
          severity="secondary"
          size="small"
          class="close-btn"
        />

        <!-- Collapse Toggle for Desktop -->
        <Button
          v-if="!isMobile"
          :icon="collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"
          @click="$emit('toggle')"
          text
          rounded
          severity="secondary"
          size="small"
          class="collapse-btn"
        />
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.label"
          class="nav-item-wrapper"
        >
          <router-link
            v-if="item.route"
            v-slot="{ isActive, navigate }"
            :to="item.route"
            custom
          >
            <div
              class="nav-item"
              :class="{ active: isActive, collapsed: collapsed }"
              @click="navigate"
              @keyup.enter="navigate"
              role="button"
              tabindex="0"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <transition name="fade">
                <span class="nav-label" v-if="!collapsed">{{
                  $t(item.label)
                }}</span>
              </transition>
              <div class="active-indicator" v-if="isActive && !collapsed"></div>
            </div>
          </router-link>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "AppSidebar",
  components: {
    Button,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "ltr",
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle"],
  computed: {
    sidebarWidth() {
      if (this.isMobile) {
        return this.collapsed ? "0px" : "280px";
      }
      return this.collapsed ? "70px" : "280px";
    },
    navItems() {
      return [
        { label: "menu.home", icon: "pi pi-home", route: "/" },
        { label: "menu.users", icon: "pi pi-users", route: "/users" },
        { label: "menu.countries", icon: "pi pi-flag", route: "/countries" },
        {
          label: "menu.governorates",
          icon: "pi pi-map",
          route: "/governorates",
        },
        { label: "menu.cities", icon: "pi pi-building", route: "/cities" },
        {
          label: "menu.companies",
          icon: "pi pi-briefcase",
          route: "/companies",
        },
      ];
    },
  },
};
</script>

<style scoped>
/* Base Sidebar */
.app-sidebar {
  height: calc(100vh - 64px);
  background: var(--surface-card);
  position: fixed;
  top: 64px;
  left: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* RTL Support */
.app-sidebar.rtl {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  background: var(--surface-card);
}

/* Sidebar Header */
.sidebar-header {
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-info));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon i {
  color: white;
  font-size: 1.25rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  white-space: nowrap;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: var(--text-color-secondary);
  text-decoration: none;
  outline: none;
  min-height: 44px;
}

.nav-item:hover {
  background: var(--surface-hover);
  color: var(--text-color);
  transform: translateX(4px);
}

.rtl .nav-item:hover {
  transform: translateX(-4px);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 500;
}

.dark-mode .nav-item.active {
  background: var(--primary-900);
  color: var(--primary-300);
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
  font-size: 1.125rem;
}

.rtl .nav-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

.nav-label {
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 1;
  font-size: 0.9375rem;
}

.active-indicator {
  position: absolute;
  right: 0.5rem;
  width: 4px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 2px;
}

.rtl .active-indicator {
  right: auto;
  left: 0.5rem;
}

/* Close & Collapse Buttons */
.close-btn,
.collapse-btn {
  width: 32px;
  height: 32px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .app-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 1000;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    transform: translateX(-100%);
  }

  .app-sidebar.rtl {
    transform: translateX(100%);
  }

  .app-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .app-sidebar.rtl:not(.collapsed) {
    transform: translateX(0);
  }

  .close-btn {
    display: flex !important;
  }

  .collapse-btn {
    display: none !important;
  }
}

/* Desktop Collapsed State */
@media (min-width: 769px) {
  .app-sidebar.collapsed {
    width: 70px;
  }

  .app-sidebar.collapsed .nav-item {
    padding: 0.75rem;
    justify-content: center;
  }

  .app-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .app-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .app-sidebar.collapsed .active-indicator {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.rtl .fade-slide-enter-from,
.rtl .fade-slide-leave-to {
  transform: translateX(10px);
}
</style>
