<template>
  <header class="branch-header">
    <Menubar :model="menuItems">
      <template #start>
        <div class="header-start">
          <Button
            icon="pi pi-bars"
            @click="$emit('toggle-sidebar')"
            text
            rounded
          />
          <div class="branch-info">
            <div class="branch-details">
              <span class="branch-name">{{ branch.name }}</span>
              <span class="branch-page">{{ currentPageTitle }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #end>
        <div class="header-end">
          <Button
            icon="pi pi-arrow-left"
            :label="$t('common.back')"
            class="p-button-text"
            @click="$emit('go-back')"
          />
          <Button
            icon="pi pi-pencil"
            :label="$t('common.edit')"
            class="p-button-outlined"
            @click="$emit('edit-branch')"
          />
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";

export default {
  name: "BranchHeader",
  components: {
    Menubar,
    Button,
  },
  props: {
    branch: {
      type: Object,
      required: true,
    },
    currentPage: {
      type: String,
      default: "company-branch-show",
    },
  },
  emits: ["toggle-sidebar", "go-back", "edit-branch"],
  data() {
    return {
      menuItems: [],
    };
  },
  computed: {
    currentPageTitle() {
      const titles = {
        "company-branch-show":
          this.$t("branches.branchDetails") || "Branch Details",
      };
      return (
        titles[this.currentPage] ||
        this.$t("branches.branchDetails") ||
        "Branch Details"
      );
    },
  },
};
</script>

<style scoped>
.branch-header {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 800;
  height: 70px;
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.branch-details {
  display: flex;
  flex-direction: column;
}

.branch-name {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
}

.branch-page {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  line-height: 1.2;
}

.header-end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.p-menubar) {
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  background: transparent;
  height: 70px;
}

@media (max-width: 768px) {
  .branch-details {
    display: none;
  }

  .header-end .p-button-text {
    display: none;
  }
}
</style>
