<template>
  <aside
    class="branch-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <div class="sidebar-header" v-if="!collapsed">
        <div class="sidebar-brand">
          <i class="pi pi-map-marker brand-icon"></i>
          <span class="brand-text">{{ branch.name }}</span>
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

      <div class="sidebar-footer" v-if="!collapsed && !isMobile"></div>
    </div>
  </aside>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "BranchSidebar",
  components: {
    Button,
  },
  props: {
    branch: {
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
          label: "branches.branchDetails",
          icon: "pi pi-map",
          route: `/company/${this.$route.params.company_id}/branches/${this.$route.params.branch_id}`,
        },
        {
          label: "warehouses.warehouses",
          icon: "pi pi-building",
          route: `/company/${this.$route.params.company_id}/branches/${this.$route.params.branch_id}/warehouses`,
        },
        {
          label: "employees.employees",
          icon: "pi pi-building",
          route: `/company/${this.$route.params.company_id}/branches/${this.$route.params.branch_id}/employees`,
        },
        {
          label: "branches.backToList",
          icon: "pi pi-arrow-left",
          route: `/company/${this.$route.params.company_id}/branches`,
        },
      ],
    };
  },
  computed: {
    companyId() {
      return this.$route.params.company_id;
    },
    branchId() {
      return this.$route.params.branch_id;
    },
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
};
</script>

<style scoped>
.branch-sidebar {
  width: 280px;
  height: calc(100vh - 70px);
  background: var(--surface-card);
  position: absolute;
  top: 70px;
  left: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 700;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.branch-sidebar.rtl {
  left: auto;
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
  z-index: 701;
}

@media (max-width: 768px) {
  .branch-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 900;
    box-shadow: none;
    transform: translateX(-100%);
  }

  .branch-sidebar.rtl {
    transform: translateX(100%);
  }

  .branch-sidebar:not(.collapsed):not(.rtl) {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .branch-sidebar:not(.collapsed).rtl {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .branch-sidebar.collapsed:not(.rtl) {
    transform: translateX(-100%);
  }
  .branch-sidebar.collapsed.rtl {
    transform: translateX(100%);
  }

  .close-btn {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .branch-sidebar.collapsed {
    width: 70px;
  }

  .branch-sidebar.collapsed .nav-item {
    padding: 0.75rem;
    justify-content: center;
  }

  .branch-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .branch-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .branch-sidebar.collapsed .active-indicator {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
}

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

.sidebar-footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

.branch-sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
