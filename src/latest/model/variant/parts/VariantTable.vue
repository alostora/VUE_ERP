<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <h1 class="table-title">{{ $t("variants.title") }}</h1>
        <div class="table-actions">
          <Button
            :label="$t('variants.addVariant')"
            icon="pi pi-plus"
            @click="createVariant"
            class="p-button-primary mr-2"
          />
          <Button
            :label="$t('variants.addVariants')"
            icon="pi pi-plus-circle"
            @click="createMultipleVariants"
            class="p-button-secondary"
          />
        </div>
      </div>

      <div
        class="table-filters"
      >
        <div class="search-container flex-1 w-full">
          <InputText
            v-model="query_string"
            :placeholder="$t('variants.search')"
            @input="handleSearchInput"
            class="search-input w-20rem"
          />
          <i class="pi pi-search search-icon" />
        </div>

        <!-- Per page select -->
        <div class="flex items-center gap-2">
          <Select
            v-model="per_page"
            :options="perPageOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('variants.show')"
            @change="getData(propSearchUrl)"
            class="w-10rem"
          />
        </div>
      </div>

      <DataTable
        :value="tableItems"
        :paginator="true"
        :rows="per_page"
        :totalRecords="meta.total"
        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
        :loading="loading"
        :lazy="true"
        resizableColumns
        columnResizeMode="fit"
        showGridlines
        tableStyle="min-width: 50rem"
        class="table-content"
        :class="{ 'responsive-table': true }"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        @page="handlePageChange"
      >
        <Column field="id" :header="$t('variants.id')" style="min-width: 100px">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column
          field="name"
          :header="$t('variants.name')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="name_ar"
          :header="$t('variants.name_ar')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.name_ar }}</span>
          </template>
        </Column>

        <Column
          field="created_at"
          :header="$t('variants.createdAt')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          :header="$t('variants.actions')"
          :exportable="false"
          style="min-width: 250px"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editVariantModal(slotProps.data)"
                v-tooltip.top="$t('variants.editVariant')"
              />
              <Button
                icon="pi pi-list"
                class="p-button-text p-button-sm p-button-info"
                @click="viewVariantValues(slotProps.data)"
                v-tooltip.top="$t('variants.viewValues')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('variants.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Single Variant Modal -->
      <VariantEditModal
        ref="variantEditModal"
        :variant="selectedItem"
        :company_id="effectiveCompanyId"
        @variant-updated="handleVariantUpdated"
      />

      <!-- Multiple Variants Modal -->
      <VariantCreateModal
        ref="variantCreateModal"
        :company_id="effectiveCompanyId"
        @variants-created="handleVariantsCreated"
      />

      <!-- Variant Values Modal -->
      <VariantValuesModal
        ref="variantValuesModal"
        :variant="selectedVariant"
        :company_id="effectiveCompanyId"
        @variant-values-updated="handleVariantValuesUpdated"
      />

      <Toast />
      <ConfirmDialog />
    </div>
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

import VariantCreateModal from "./VariantCreateModal.vue";
import VariantEditModal from "./VariantEditModal.vue";
import VariantValuesModal from "./VariantValuesModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "VariantTable",

  components: {
    VariantCreateModal,
    VariantEditModal,
    VariantValuesModal,
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

  data() {
    return {
      selectedVariant: null,
    };
  },

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        return "";
      }
      return `${general_request.BASE_URL}/admin/company/variants/search/${this.effectiveCompanyId}?paginate=true`;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/variant`;
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
    createVariant() {
      this.$refs.variantCreateModal.openModal(true);
    },

    createMultipleVariants() {
      this.$refs.variantCreateModal.openModal(false);
    },

    handleVariantsCreated(newVariants) {
      if (Array.isArray(newVariants)) {
        newVariants.forEach((variant) => {
          this.handleItemCreated(variant);
        });
      } else {
        this.handleItemCreated(newVariants);
      }
    },

    editVariantModal(variant) {
      this.selectedItem = { ...variant };
      this.$nextTick(() => {
        this.$refs.variantEditModal.openModal();
      });
    },

    handleVariantUpdated(updatedVariant) {
      this.handleItemUpdated(updatedVariant);
    },

    viewVariantValues(variant) {
      this.selectedVariant = { ...variant };
      this.$nextTick(() => {
        this.$refs.variantValuesModal.openModal();
      });
    },

    handleVariantValuesUpdated() {
      // Refresh the table data when variant values are updated
      this.getData();
    },

    deleteRow(variant) {
      this.deleteItem(
        variant,
        this.propMainUrl,
        this.$t("variants.variantDeleted"),
        this.$t("variants.deleteError")
      );
    },
  },
};
</script>

<style scoped></style>
