<template>
  <aside
    class="modern-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile, 'sidebar-open': isMobile && !collapsed }]"
    :style="{ width: sidebarWidth }"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="sidebar-brand" v-if="!collapsed || isMobile">
          <i class="pi pi-shield brand-icon"></i>
          <span class="brand-text" v-if="!collapsed">ERP System</span>
        </div>

        <!-- Close Button for Mobile -->
        <Button
          v-if="isMobile && !collapsed"
          icon="pi pi-times"
          @click="$emit('toggle')"
          text
          rounded
          severity="secondary"
          class="close-btn"
          v-tooltip="'Close'"
        />
        
        <!-- Collapse Button for Desktop -->
        <Button
          v-if="!isMobile"
          :icon="collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"
          @click="$emit('toggle')"
          text
          rounded
          severity="secondary"
          class="collapse-btn"
          v-tooltip="collapsed ? 'Expand' : 'Collapse'"
        />
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div v-for="item in items" :key="item.label" class="nav-item-wrapper">
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
              role="button"
              tabindex="0"
              @keyup.enter="navigate"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <transition name="fade">
                <span class="nav-label" v-if="!collapsed">{{ $t(item.label) }}</span>
              </transition>
              <div class="active-indicator" v-if="isActive && !collapsed"></div>
            </div>
          </router-link>
        </div>
      </nav>

      <!-- Footer - Hide on mobile -->
      <div class="sidebar-footer" v-if="!collapsed && !isMobile">
        <div class="user-section">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="large"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">John Doe</div>
            <div class="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import Avatar from "primevue/avatar";
import Button from "primevue/button";

export default {
  components: {
    Avatar,
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
        return this.collapsed ? '0px' : '280px';
      }
      return this.collapsed ? '70px' : '280px';
    }
  },
  data() {
    return {
      items: [
        { label: "menu.home", icon: "pi pi-home", route: "/" },
        { label: "menu.users", icon: "pi pi-users", route: "/users" },
        { label: "menu.countries", icon: "pi pi-flag", route: "/countries" },
        { label: "menu.governorates", icon: "pi pi-map", route: "/governorates" },
        { label: "menu.cities", icon: "pi pi-building", route: "/cities" },
        { label: "menu.companies", icon: "pi pi-briefcase", route: "/companies" },
      ],
    };
  },
  methods: {
    handleNavigation(route) {
      this.$router.push(route);
      if (this.isMobile) {
        this.$emit("toggle");
      }
    },
  },
};
</script>

<style scoped>
.modern-sidebar {
  height: calc(100vh - 64px);
  background: var(--surface-card);
  position: fixed;
  top: 64px;
  left: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 900;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* RTL Support */
.modern-sidebar.rtl {
  left: unset;
  right: 0;
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  background: var(--surface-card);
  position: relative;
  z-index: 1101;
  overflow-y: auto;
  scrollbar-width: thin;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: var(--surface-ground);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 2px;
}

/* Sidebar Header */
.sidebar-header {
  padding: 0 1.25rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.brand-icon {
  color: var(--primary-500);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.brand-text {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-btn,
.collapse-btn {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
}

.nav-item-wrapper {
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
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

.nav-item:focus-visible {
  box-shadow: 0 0 0 2px var(--primary-color);
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
  background: var(--primary-500);
  border-radius: 2px;
}

.rtl .active-indicator {
  right: auto;
  left: 0.5rem;
}

/* Footer */
.sidebar-footer {
  padding: 1rem 1.25rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
  flex-shrink: 0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Specific Styles */
@media (max-width: 992px) {
  .modern-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 1100;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    transform: translateX(-100%);
  }

  .modern-sidebar.rtl {
    transform: translateX(100%);
  }

  .modern-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .modern-sidebar.rtl:not(.collapsed) {
    transform: translateX(0);
  }

  .sidebar-header {
    padding-top: 1rem;
    min-height: 56px;
  }

  .close-btn {
    display: flex !important;
  }
  
  .collapse-btn {
    display: none !important;
  }
}

/* Desktop Collapsed State */
@media (min-width: 993px) {
  .modern-sidebar.collapsed {
    width: 70px;
  }

  .modern-sidebar.collapsed .nav-item {
    padding: 0.875rem;
    justify-content: center;
  }

  .modern-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .modern-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .modern-sidebar.collapsed .active-indicator {
    display: none;
  }

  .modern-sidebar.collapsed .sidebar-footer {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
}

/* Animation for label fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.rtl .fade-enter-from,
.rtl .fade-leave-to {
  transform: translateX(10px);
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .nav-item {
    min-height: 48px;
    padding: 1rem;
  }
  
  .nav-item:hover {
    transform: none;
  }
}
</style>