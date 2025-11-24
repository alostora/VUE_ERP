<template>
  <aside
    class="modern-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
  >
    <div class="sidebar-content">
      <!-- Header مع زر الإغلاق -->
      <div class="sidebar-header" v-if="!collapsed">
        <div class="sidebar-brand">
          <i class="pi pi-shield brand-icon"></i>
          <span class="brand-text">ERP System</span>
        </div>

        <!-- زر الإغلاق - يظهر فقط في الموبايل وعندما السايدبار مفتوح -->
        <Button
          v-if="isMobile && !collapsed"
          icon="pi pi-times"
          @click="$emit('toggle')"
          text
          rounded
          class="close-btn"
          v-tooltip="'Close'"
        />
      </div>

      <nav class="sidebar-nav">
        <div v-for="item in items" :key="item.label" class="nav-item-wrapper">
          <router-link
            v-if="item.route"
            v-slot="{ isActive }"
            :to="item.route"
            custom
          >
            <div
              class="nav-item"
              :class="{ active: isActive, collapsed: collapsed }"
              @click="handleNavigation(item.route)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ $t(item.label) }}</span>
              <div class="active-indicator" v-if="isActive && !collapsed"></div>
            </div>
          </router-link>
        </div>
      </nav>

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
  data() {
    return {
      items: [
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
      ],
    };
  },
  methods: {
    handleNavigation(route) {
      this.$router.push(route);
      // Auto-close sidebar on mobile after navigation
      if (this.isMobile) {
        this.$emit("toggle");
      }
    },
  },
};
</script>

<style scoped>
/* Base Styles (Desktop) */
.modern-sidebar {
  width: 280px;
  height: calc(100vh - 60px);
  background: var(--surface-card);
  position: fixed;
  top: 60px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 900;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* RTL Adjustments for Desktop */
.modern-sidebar.rtl {
  right: 0;
  left: unset;
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
}

/* --- Mobile Styles (max-width: 768px) --- */
@media (max-width: 768px) {
  .modern-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 1100;
    box-shadow: none;
    transform: translateX(-100%);
  }

  .modern-sidebar.rtl {
    transform: translateX(100%);
  }

  /* Expanded LTR: Show sidebar */
  .modern-sidebar:not(.collapsed):not(.rtl) {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  /* Expanded RTL: Show sidebar */
  .modern-sidebar:not(.collapsed).rtl {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  /* Force collapsed state to remain hidden */
  .modern-sidebar.collapsed:not(.rtl) {
    transform: translateX(-100%);
  }
  .modern-sidebar.collapsed.rtl {
    transform: translateX(100%);
  }

  .close-btn {
    display: block !important;
    color: var(--text-color-secondary);
  }

  .close-btn:hover {
    color: var(--text-color);
    background: var(--surface-hover);
  }

  .sidebar-header {
    padding: 1rem 1.5rem;
  }

  .sidebar-nav {
    padding: 0 1rem;
  }

  .nav-item {
    padding: 1rem;
    margin: 0.25rem 0;
  }

  .sidebar-footer {
    display: none;
  }
}

/* --- Desktop Collapsed State (min-width: 769px) --- */
@media (min-width: 769px) {
  .modern-sidebar.collapsed {
    width: 70px;
  }

  .modern-sidebar.collapsed .nav-item {
    padding: 0.75rem;
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

  .close-btn {
    display: none !important;
  }
}

/* --- Common Navigation & Footer Styles --- */

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
  color: var(--primary-500);
  font-size: 1.5rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
}

.close-btn {
  display: none;
}

/* باقي الـ styles نفسها بدون تغيير */
/* ... Navigation, Footer, etc. ... */

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
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
}

.rtl .nav-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

.nav-label {
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 1;
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

.sidebar-footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Smooth animations for all elements */
.modern-sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
