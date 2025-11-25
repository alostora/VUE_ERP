<template>
  <div class="category-table-page">
    <div class="mb-4">
      <Button
        :label="$t('categories.addCategory')"
        icon="pi pi-plus"
        @click="createCategory"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('categories.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <Select
        v-model="per_page"
        :options="perPageOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('categories.show')"
        @change="getData(propSearchUrl)"
        class="w-10rem"
      />
    </div>

    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      :loading="loading"
      :lazy="true"
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <Column field="id" :header="$t('categories.id')" style="min-width: 100px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column
        field="file"
        :header="$t('categories.image')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <img
            v-if="slotProps.data.file"
            :src="slotProps.data.file.file_path"
            :alt="slotProps.data.name"
            class="category-image"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <Column
        field="name"
        :header="$t('categories.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <Column
        field="name_ar"
        :header="$t('categories.nameAr')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name_ar }}</span>
        </template>
      </Column>

      <Column
        field="created_at"
        :header="$t('categories.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <Column
        :header="$t('categories.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editCategoryModal(slotProps.data)"
              v-tooltip.top="$t('categories.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('categories.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <CategoryEditModal
      ref="categoryEditModal"
      :category="selectedItem"
      :company_id="effectiveCompanyId"
      @category-updated="handleCategoryUpdated"
    />

    <CategoryCreateModal
      ref="categoryCreateModal"
      :company_id="effectiveCompanyId"
      @category-created="handleCategoryCreated"
    />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import CategoryCreateModal from "./CategoryCreateModal.vue";
import CategoryEditModal from "./CategoryEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CategoryTable",

  components: {
    CategoryCreateModal,
    CategoryEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  mixins: [useTable(), useCrud()],

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      console.log("🏢 Effective Company ID:", companyId);
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        return "";
      }
      return `${general_request.BASE_URL}/admin/company/categories/${this.effectiveCompanyId}?paginate=true`;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/category`;
    },
  },

  mounted() {
    if (this.effectiveCompanyId) {
      this.getData();
    } else {
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        if (newCompanyId) {
          this.getData();
        }
      },
    },
  },

  methods: {
    createCategory() {
      this.$refs.categoryCreateModal.openModal();
    },

    handleCategoryCreated(newCategory) {
      this.handleItemCreated(newCategory);
    },

    editCategoryModal(category) {
      this.selectedItem = { ...category };
      this.$nextTick(() => {
        this.$refs.categoryEditModal.openModal();
      });
    },

    handleCategoryUpdated(updatedCategory) {
      this.handleItemUpdated(updatedCategory);
    },

    deleteRow(category) {
      this.deleteItem(
        category,
        this.propMainUrl,
        this.$t("categories.categoryDeleted"),
        this.$t("categories.deleteError")
      );
    },
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  display: inline-block;
}

.search-input {
  padding-left: 2.5rem;
  width: 20rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  pointer-events: none;
}

.category-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
