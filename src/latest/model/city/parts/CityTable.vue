<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="table-header">
        <div class="mb-3">
          <h1 class="table-title">{{ $t("cities.title") }}</h1>
          <!-- Filter states -->
          <p v-if="!country_id && !governorate_id" class="text-color-secondary">
            {{ $t("cities.showingAll") }}
          </p>
          <p
            v-else-if="country_id && !governorate_id"
            class="text-color-secondary"
          >
            {{ $t("cities.filteredByCountry") }}: {{ countryName }}
            <Button
              :label="$t('cities.showAll')"
              icon="pi pi-times"
              text
              class="p-button-text p-button-sm"
              @click="clearFilters"
            />
          </p>
          <p v-else class="text-color-secondary">
            {{ $t("cities.filteredByGovernorate") }}: {{ governorateName }}
            <Button
              :label="$t('cities.showAll')"
              icon="pi pi-times"
              text
              class="p-button-text p-button-sm"
              @click="clearFilters"
            />
          </p>
        </div>
        <div class="table-actions">
          <Button
            :label="$t('cities.addCity')"
            icon="pi pi-plus"
            @click="createCity"
            class="p-button-primary"
          />
        </div>
      </div>

      <!-- Filters -->
      <div
        class="table-filters"
      >
        <!-- Search -->
        <!-- Country Filter (only show when NOT coming from URL) -->
        <Select
          v-if="!country_id"
          v-model="selectedCountry"
          :options="countries"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('cities.filterByCountry')"
          class="w-15rem"
          @change="onCountryChange"
          :showClear="true"
        />

        <!-- Governorate Filter (only show when country is selected AND NOT coming from URL) -->
        <Select
          v-if="(selectedCountry || country_id) && !governorate_id"
          v-model="selectedGovernorate"
          :options="filteredGovernorates"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('cities.filterByGovernorate')"
          class="w-15rem"
          @change="onGovernorateChange"
          :showClear="true"
          :disabled="!selectedCountry && !country_id"
        />

        <div class="search-container">
          <InputText
            v-model="query_string"
            :placeholder="$t('cities.search')"
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
          :placeholder="$t('cities.show')"
          @change="getData()"
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
        class="table-content"
        :class="{ 'responsive-table': true }"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        @page="handlePageChange"
      >
        <Column field="id" :header="$t('cities.id')" style="min-width: 100px">
          <template #body="slotProps">
            <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>

        <Column
          field="name"
          :header="$t('cities.name')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="name_ar"
          :header="$t('cities.name_ar')"
          sortable
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.name_ar }}</span>
          </template>
        </Column>

        <Column
          field="prefix"
          :header="$t('cities.prefix')"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <span class="font-mono">{{ slotProps.data.prefix || "-" }}</span>
          </template>
        </Column>

        <!-- Show country & governorate columns only when showing all cities -->
        <Column
          v-if="!country_id && !governorate_id"
          field="country"
          :header="$t('cities.country')"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.country?.name || "-" }}</span>
          </template>
        </Column>

        <Column
          v-if="!country_id && !governorate_id"
          field="governorate"
          :header="$t('cities.governorate')"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.governorate?.name || "-" }}</span>
          </template>
        </Column>

        <Column
          :header="$t('cities.actions')"
          :exportable="false"
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm p-button-primary"
                @click="editCityModal(slotProps.data)"
                v-tooltip.top="$t('cities.edit')"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="deleteRow(slotProps.data)"
                v-tooltip.top="$t('cities.delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <CityEditModal
        ref="cityEditModal"
        :city="selectedItem"
        :countryId="selectedCountry || country_id"
        :governorateId="selectedGovernorate || governorate_id"
        @city-updated="handleCityUpdated"
      />

      <CityCreateModal
        ref="cityCreateModal"
        :countryId="selectedCountry || country_id"
        :governorateId="selectedGovernorate || governorate_id"
        @city-created="handleCityCreated"
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

import CityCreateModal from "./CityCreateModal.vue";
import CityEditModal from "./CityEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CityTable",

  components: {
    CityCreateModal,
    CityEditModal,
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

  mixins: [useTable(), useCrud()],

  props: {
    country_id: {
      type: String,
      default: null,
    },
    governorate_id: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      propMainUrl: general_request.BASE_URL + "/admin/city",
      selectedCountry: null,
      selectedGovernorate: null,
      countries: [],
      governorates: [],
      countryName: "",
      governorateName: "",
    };
  },

  computed: {
    propSearchUrl() {
      let url = `${general_request.BASE_URL}/admin/cities-search-all?`;
      const params = new URLSearchParams();

      if (this.query_string) params.append("query_string", this.query_string);

      // Use filters from URL props OR from selected filters
      const countryFilter = this.country_id || this.selectedCountry;
      const governorateFilter = this.governorate_id || this.selectedGovernorate;

      if (countryFilter) params.append("country_id", countryFilter);
      if (governorateFilter) params.append("governorate_id", governorateFilter);

      params.append("paginate", "true");

      return url + params.toString();
    },

    filteredGovernorates() {
      if (!this.selectedCountry && !this.country_id) return [];
      return this.governorates.filter(
        (g) => g.country_id === (this.selectedCountry || this.country_id)
      );
    },
  },

  mounted() {
    this.selectedCountry = this.country_id;
    this.selectedGovernorate = this.governorate_id;
    this.loadCountries();
    this.loadGovernorates();
    this.getData();

    if (this.country_id) {
      this.loadCountryName(this.country_id);
    }
    if (this.governorate_id) {
      this.loadGovernorateName(this.governorate_id);
    }
  },

  methods: {
    getData() {
      this.fetchData(this.propSearchUrl);
    },

    onCountryChange() {
      this.selectedGovernorate = null; // Reset governorate when country changes
      this.meta.current_page = 1;
      this.getData();
      this.updateRoute();
    },

    onGovernorateChange() {
      this.meta.current_page = 1;
      this.getData();
      this.updateRoute();
    },

    clearFilters() {
      this.selectedCountry = null;
      this.selectedGovernorate = null;
      this.countryName = "";
      this.governorateName = "";
      this.updateRoute();
      this.getData();
    },

    updateRoute() {
      if (this.selectedGovernorate) {
        this.$router.push({
          name: "cities",
          params: {
            country_id: this.selectedCountry,
            governorate_id: this.selectedGovernorate,
          },
        });
      } else if (this.selectedCountry) {
        this.$router.push({
          name: "cities",
          params: { country_id: this.selectedCountry },
        });
      } else {
        this.$router.push({ name: "cities" });
      }
    },

    async loadCountries() {
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          { headers: general_request.headers }
        );
        this.countries = response.data.data || [];
      } catch (error) {}
    },

    async loadGovernorates() {
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorates-search-all?per_page=1000`,
          { headers: general_request.headers }
        );
        this.governorates = response.data.data || [];
      } catch (error) {}
    },

    async loadCountryName(countryId) {
      if (!countryId) return;

      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/country/${countryId}`,
          { headers: general_request.headers }
        );
        this.countryName = response.data.data?.name || "Unknown Country";
      } catch (error) {
        this.countryName = "Unknown Country";
      }
    },

    async loadGovernorateName(governorateId) {
      if (!governorateId) return;

      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorate/${governorateId}`,
          { headers: general_request.headers }
        );
        this.governorateName =
          response.data.data?.name || "Unknown Governorate";
      } catch (error) {
        this.governorateName = "Unknown Governorate";
      }
    },

    createCity() {
      this.$refs.cityCreateModal.openModal();
    },

    handleCityCreated(newCity) {
      this.handleItemCreated(newCity);
    },

    editCityModal(city) {
      this.selectedItem = { ...city };
      this.$nextTick(() => {
        this.$refs.cityEditModal.openModal();
      });
    },

    handleCityUpdated(updatedCity) {
      this.handleItemUpdated(updatedCity);
    },

    deleteRow(city) {
      this.deleteItem(
        city,
        this.propMainUrl,
        this.$t("cities.cityDeleted"),
        this.$t("cities.deleteError")
      );
    },
  },
};
</script>

<style scoped></style>
