<template>
  <aside
    class="company-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <div class="sidebar-header" v-if="!collapsed">
        <div class="sidebar-brand">
          <i class="pi pi-building brand-icon"></i>
          <span class="brand-text">{{ company.name }}</span>
        </div>

        <!-- Close button for mobile -->
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
        <div class="company-stats">
          <div class="stat-item">
            <i class="pi pi-folder stat-icon"></i>
            <span class="stat-value">12</span>
            <span class="stat-label">{{ $t("companies.categories") }}</span>
          </div>
          <div class="stat-item">
            <i class="pi pi-shopping-bag stat-icon"></i>
            <span class="stat-value">156</span>
            <span class="stat-label">{{ $t("companies.products") }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "CompanySidebar",
  components: {
    Button,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
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
        {
          label: "companies.companyDetails",
          icon: "pi pi-building",
          route: `/company/${this.$route.params.company_id}/show`,
        },
        {
          label: "companies.categories",
          icon: "pi pi-folder",
          route: `/company/${this.$route.params.company_id}/categories`,
        },
        {
          label: "companies.products",
          icon: "pi pi-shopping-bag",
          route: "#",
          disabled: true,
        },
        {
          label: "companies.branches",
          icon: "pi pi-map-marker",
          route: "#",
          disabled: true,
        },
        {
          label: "companies.employees",
          icon: "pi pi-users",
          route: "#",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    handleNavigation(route) {
      if (route && route !== "#") {
        this.$router.push(route);
        if (this.isMobile) {
          this.$emit("toggle");
        }
      }
    },
  },
  created() {
    // Update routes with current company_id
    this.items = this.items.map((item) => ({
      ...item,
      route:
        item.route === "#"
          ? "#"
          : `/company/${this.$route.params.company_id}${
              item.route.includes("/show")
                ? "/show"
                : item.route.includes("/categories")
                ? "/categories"
                : ""
            }`,
    }));
  },
};
</script>

<style scoped>
/* Base Styles */
.company-sidebar {
  width: 280px;
  height: calc(100vh - 70px);
  background: var(--surface-card);
  position: absolute; /* غيرنا من fixed لـ absolute */
  top: 70px;
  left: 0; /* علشان الانجليزي */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 700;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* RTL Support */
.company-sidebar.rtl {
  left: auto;
  right: 0; /* علشان العربي */
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
  z-index: 701;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .company-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 900;
    box-shadow: none;
    transform: translateX(-100%);
  }

  .company-sidebar.rtl {
    transform: translateX(100%);
  }

  .company-sidebar:not(.collapsed):not(.rtl) {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .company-sidebar:not(.collapsed).rtl {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .company-sidebar.collapsed:not(.rtl) {
    transform: translateX(-100%);
  }
  .company-sidebar.collapsed.rtl {
    transform: translateX(100%);
  }

  .close-btn {
    display: block !important;
  }
}

/* Desktop Collapsed State */
@media (min-width: 769px) {
  .company-sidebar.collapsed {
    width: 70px;
  }

  .company-sidebar.collapsed .nav-item {
    padding: 0.75rem;
    justify-content: center;
  }

  .company-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .company-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .company-sidebar.collapsed .active-indicator {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
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
  color: var(--primary-500);
  font-size: 1.5rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* Navigation */
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

.nav-item:hover:not(.disabled) {
  background: var(--surface-hover);
  color: var(--text-color);
  transform: translateX(4px);
}

.rtl .nav-item:hover:not(.disabled) {
  transform: translateX(-4px);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 500;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Footer with Stats */
.sidebar-footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

.company-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: var(--surface-ground);
}

.stat-icon {
  color: var(--primary-500);
  font-size: 1rem;
}

.stat-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  margin-left: auto;
}

/* Smooth animations */
.company-sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
