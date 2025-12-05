<template>
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("countries.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('countries.addCountry')"
        icon="pi pi-plus"
        @click="createCountry"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('countries.search')"
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
        :placeholder="$t('countries.show')"
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
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageSelect"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- ID Column -->
      <Column field="id" :header="$t('countries.id')" style="min-width: 100px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('countries.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <!-- Name Arabic Column -->
      <Column
        field="name_ar"
        :header="$t('countries.name_ar')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name_ar }}</span>
        </template>
      </Column>

      <!-- Phone Code Column -->
      <Column
        field="phone_code"
        :header="$t('countries.phone_code')"
        sortable
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.phone_code }}</span>
        </template>
      </Column>

      <!-- Prefix Column -->
      <Column
        field="prefix"
        :header="$t('countries.prefix')"
        sortable
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.prefix }}</span>
        </template>
      </Column>

      <!-- Flag Column -->
      <Column
        field="flag"
        :header="$t('countries.flag')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <img
            v-if="slotProps.data.flag"
            :src="slotProps.data.flag"
            :alt="slotProps.data.name"
            class="img-40 object-cover rounded"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Governorates Column -->
      <Column :header="$t('countries.governorates')" style="min-width: 150px">
        <template #body="slotProps">
          <Button
            :label="$t('countries.viewGovernorates')"
            icon="pi pi-list"
            class="p-button-text p-button-sm p-button-info"
            @click="viewGovernorates(slotProps.data)"
            v-tooltip.top="$t('countries.viewGovernoratesTooltip')"
          />
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('countries.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editCountryModal(slotProps.data)"
              v-tooltip.top="$t('countries.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('countries.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <CountryEditModal
      ref="countryEditModal"
      :country="selectedItem"
      @country-updated="handleCountryUpdated"
    />

    <CountryCreateModal
      ref="countryCreateModal"
      @country-created="handleCountryCreated"
    />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
// Import PrimeVue components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

// Import your custom components
import CountryCreateModal from "./CountryCreateModal.vue";
import CountryEditModal from "./CountryEditModal.vue";

// Import composables
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";

// Import utilities
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CountriesPage",

  components: {
    CountryCreateModal,
    CountryEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    ProgressSpinner,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      // API URLs
      propSearchUrl:
        general_request.BASE_URL + "/admin/countries/search?paginate=true",
      propMainUrl: general_request.BASE_URL + "/admin/country",
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    /**
     * Open create country modal
     */
    createCountry() {
      this.$refs.countryCreateModal.openModal();
    },

    /**
     * Handle country created event
     */
    handleCountryCreated(newCountry) {
      this.handleItemCreated(newCountry);
    },

    /**
     * Open edit country modal
     */
    editCountryModal(country) {
      this.selectedItem = { ...country };
      this.$nextTick(() => {
        this.$refs.countryEditModal.openModal();
      });
    },

    /**
     * Handle country updated event
     */
    handleCountryUpdated(updatedCountry) {
      this.handleItemUpdated(updatedCountry);
    },

    /**
     * Delete country
     */
    deleteRow(country) {
      this.deleteItem(
        country,
        this.propMainUrl,
        this.$t("countries.countryDeleted"),
        this.$t("countries.deleteError")
      );
    },

    /**
     * Navigate to governorates page for this country
     */
    viewGovernorates(country) {
      this.$router.push({
        name: "governorates",
        params: { country_id: country.id },
      });
    },
  },
};
</script>

<style scoped>
</style>
