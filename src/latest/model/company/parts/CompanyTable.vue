<template>
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("companies.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('companies.addCompany')"
        icon="pi pi-plus"
        @click="createCompany"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('companies.search')"
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
        :placeholder="$t('companies.show')"
        @change="getData(propSearchUrl)"
        class="w-10rem"
      />
    </div>

    <!-- Data Table -->
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
      class="p-datatable-sm table-scroll-container"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- ID Column -->
      <Column field="id" :header="$t('companies.id')" style="min-width: 100px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Logo Column -->
      <Column
        field="logo"
        :header="$t('companies.logo')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <img
            v-if="slotProps.data.logo"
            :src="slotProps.data.logo.file_path"
            :alt="slotProps.data.name"
            class="img-40 object-cover rounded"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('companies.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <!-- Phone Column -->
      <Column
        field="phone"
        :header="$t('companies.phone')"
        style="min-width: 130px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.phone }}</span>
        </template>
      </Column>

      <!-- Email Column -->
      <Column
        field="email"
        :header="$t('companies.email')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.email }}</span>
        </template>
      </Column>

      <!-- Client Column -->
      <Column
        field="client"
        :header="$t('companies.client')"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.client?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Country Column -->
      <Column
        field="country"
        :header="$t('companies.country')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.country?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Currency Column -->
      <Column
        field="currency"
        :header="$t('companies.currency')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.currency?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('companies.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editCompanyModal(slotProps.data)"
              v-tooltip.top="$t('companies.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('companies.delete')"
            />
            <Button
              icon="pi pi-folder"
              class="p-button-text p-button-sm p-button-info"
              @click="viewCategories(slotProps.data)"
              v-tooltip.top="$t('companies.viewCategories')"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm p-button-info"
              @click="viewCompany(slotProps.data)"
              v-tooltip.top="$t('companies.viewCompany')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <CompanyEditModal
      ref="companyEditModal"
      :company="selectedItem"
      @company-updated="handleCompanyUpdated"
    />

    <CompanyCreateModal
      ref="companyCreateModal"
      @company-created="handleCompanyCreated"
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

import CompanyCreateModal from "./CompanyCreateModal.vue";
import CompanyEditModal from "./CompanyEditModal.vue";
import ScrollableTable from "@/components/ScrollableTable.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyTable",

  components: {
    CompanyCreateModal,
    CompanyEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
    ScrollableTable,
  },

  directives: {
    tooltip: Tooltip,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      // API URLs
      propSearchUrl:
        general_request.BASE_URL + "/admin/companies/search?paginate=true",
      propMainUrl: general_request.BASE_URL + "/admin/company",
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    /**
     * Open create company modal
     */
    createCompany() {
      this.$refs.companyCreateModal.openModal();
    },

    /**
     * Handle company created event
     */
    handleCompanyCreated(newCompany) {
      this.handleItemCreated(newCompany);
    },

    /**
     * Open edit company modal
     */
    editCompanyModal(company) {
      this.selectedItem = { ...company };
      this.$nextTick(() => {
        this.$refs.companyEditModal.openModal();
      });
    },

    /**
     * Handle company updated event
     */
    handleCompanyUpdated(updatedCompany) {
      this.handleItemUpdated(updatedCompany);
    },

    /**
     * Delete company
     */
    deleteRow(company) {
      this.deleteItem(
        company,
        this.propMainUrl,
        this.$t("companies.companyDeleted"),
        this.$t("companies.deleteError")
      );
    },

    viewCategories(company) {
      this.$router.push({
        name: "company-categories",
        params: { company_id: company.id },
      });
    },

    viewCompany(company) {
      this.$router.push({
        name: "company-show",
        params: { company_id: company.id },
      });
    },
  },
};
</script>

<style scoped></style>
