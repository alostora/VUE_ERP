<!-- في MVVMMainHeader.vue -->
<template>
  <header class="app-header" :class="{ 'mobile-header': isMobile }">
    <div class="header-container">
      <!-- Left Section -->
      <div class="header-left">
        <Button
          :icon="
            isMobile
              ? 'pi pi-bars'
              : sidebarCollapsed
              ? 'pi pi-bars'
              : 'pi pi-align-justify'
          "
          @click="$emit('toggle-sidebar')"
          text
          rounded
          class="menu-toggle"
        />

        <div class="app-brand">
          <div class="app-title">{{ $t("app.title") }}</div>
        </div>
      </div>

      <!-- Center Section -->
      <div class="header-center">
        <div class="search-container">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="searchQuery"
            :placeholder="$t('common.search')"
            type="text"
            class="search-input"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

export default {
  name: "AppHeader",
  components: {
    Button,
    InputText,
    Avatar,
    Menu,
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-sidebar"],
  data() {
    return {
      searchQuery: "",
      showUserMenu: false,
    };
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style scoped>
/* Base Header */
.app-header {
  height: 64px;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  gap: 1rem;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.menu-toggle {
  width: 40px;
  height: 40px;
}

.app-brand {
  display: flex;
  align-items: center;
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-color);
}

/* Center Section */
.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  pointer-events: none;
}

.rtl .search-icon {
  left: auto;
  right: 0.75rem;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
}

.rtl .search-input {
  padding-left: 0.75rem;
  padding-right: 2.5rem;
}

/* Menu Styling */
:deep(.p-menu) {
  min-width: 200px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.menu-header) {
  opacity: 1 !important;
  cursor: default;
}

:deep(.menu-header:hover) {
  background: transparent !important;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .app-header.mobile-header {
    height: 56px;
  }

  .header-container {
    padding: 0 1rem;
  }

  .app-title {
    display: none;
  }

  .search-container {
    max-width: 200px;
  }

  .user-name {
    display: none;
  }

  .theme-toggle,
  .language-toggle {
    width: 36px;
    height: 36px;
  }

  .menu-toggle {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .search-container {
    display: none;
  }
}
</style>
