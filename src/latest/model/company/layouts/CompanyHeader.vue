<template>
  <header class="company-header">
    <Menubar :model="menuItems">
      <template #start>
        <div class="header-start">
          <Button
            icon="pi pi-bars"
            @click="$emit('toggle-sidebar')"
            text
            rounded
          />
          <div class="company-info">
            <img
              v-if="company.logo"
              :src="company.logo.file_path"
              :alt="company.name"
              class="company-logo"
            />
            <div class="company-details">
              <span class="company-name">{{ company.name }}</span>
              <span class="company-page">{{ currentPageTitle }}</span>
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
            @click="$emit('edit-company')"
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
  name: "CompanyHeader",
  components: {
    Menubar,
    Button,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
    currentPage: {
      type: String,
      default: "company-show",
    },
  },
  emits: ["toggle-sidebar", "go-back", "edit-company"],
  data() {
    return {
      menuItems: [], // Empty menu for company header
    };
  },
  computed: {
    currentPageTitle() {
      const titles = {
        "company-show": this.$t("companies.companyDetails"),
        "company-categories": this.$t("companies.categories"),
        "company-products": this.$t("companies.products"),
        "company-branches": this.$t("companies.branches"),
      };
      return titles[this.currentPage] || this.$t("companies.companyDetails");
    },
  },
};
</script>

<style scoped>
.company-header {
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

.company-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--surface-border);
}

.company-details {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
}

.company-page {
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

/* Mobile responsive */
@media (max-width: 768px) {
  .company-details {
    display: none;
  }

  .header-end .p-button-text {
    display: none;
  }

  .header-end {
    gap: 0.25rem;
  }

  .company-logo {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 576px) {
  .company-logo {
    display: none;
  }

  .header-start {
    gap: 0.5rem;
  }
}
</style>
