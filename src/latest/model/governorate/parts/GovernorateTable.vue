<template>
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("governorates.title") }}</h2>

      <!-- Show country filter when coming from sidebar -->
      <p v-if="!country_id" class="text-color-secondary">
        {{ $t("governorates.showingAll") }}
      </p>

      <!-- Show country name when coming from country page -->
      <p v-else class="text-color-secondary">
        {{ $t("governorates.filteredByCountry") }}: {{ countryName }}
        <Button
          :label="$t('governorates.showAll')"
          icon="pi pi-times"
          text
          class="p-button-text p-button-sm"
          @click="clearCountryFilter"
        />
      </p>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('governorates.addGovernorate')"
        icon="pi pi-plus"
        @click="createGovernorate"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <!-- Country Filter (only show when NOT coming from country page) -->
      <Select
        v-if="!country_id"
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        optionValue="id"
        :placeholder="$t('governorates.filterByCountry')"
        class="w-15rem"
        @change="onCountryChange"
        :showClear="true"
      />

      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('governorates.search')"
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
        :placeholder="$t('governorates.show')"
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
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <Column
        field="id"
        :header="$t('governorates.id')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column
        field="name"
        :header="$t('governorates.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <Column
        field="name_ar"
        :header="$t('governorates.name_ar')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.name_ar }}</span>
        </template>
      </Column>

      <Column
        field="prefix"
        :header="$t('governorates.prefix')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span class="font-mono">{{ slotProps.data.prefix || "-" }}</span>
        </template>
      </Column>

      <!-- Show country column only when showing all governorates -->
      <Column
        v-if="!country_id"
        field="country"
        :header="$t('governorates.country')"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.country?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Cities Column -->
      <Column :header="$t('governorates.cities')" style="min-width: 150px">
        <template #body="slotProps">
          <Button
            :label="$t('governorates.viewCities')"
            icon="pi pi-building"
            class="p-button-text p-button-sm p-button-info"
            @click="viewCities(slotProps.data)"
            v-tooltip.top="$t('governorates.viewCitiesTooltip')"
          />
        </template>
      </Column>

      <Column
        :header="$t('governorates.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editGovernorateModal(slotProps.data)"
              v-tooltip.top="$t('governorates.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('governorates.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <GovernorateEditModal
      ref="governorateEditModal"
      :governorate="selectedItem"
      :countryId="selectedCountry || country_id"
      @governorate-updated="handleGovernorateUpdated"
    />

    <GovernorateCreateModal
      ref="governorateCreateModal"
      :countryId="selectedCountry || country_id"
      @governorate-created="handleGovernorateCreated"
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

import GovernorateCreateModal from "./GovernorateCreateModal.vue";
import GovernorateEditModal from "./GovernorateEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "GovernorateTable",

  components: {
    GovernorateCreateModal,
    GovernorateEditModal,
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
  },

  data() {
    return {
      propMainUrl: general_request.BASE_URL + "/admin/governorate",
      selectedCountry: null,
      countries: [],
      countryName: "",
    };
  },

  computed: {
    propSearchUrl() {
      let url = `${general_request.BASE_URL}/admin/governorates-search-all?`;
      const params = new URLSearchParams();

      if (this.query_string) params.append("query_string", this.query_string);

      // Use country_id from props OR from selectedCountry filter
      const countryFilter = this.country_id || this.selectedCountry;
      if (countryFilter) params.append("country_id", countryFilter);

      params.append("paginate", "true");

      return url + params.toString();
    },
  },

  mounted() {
    this.selectedCountry = this.country_id;
    this.loadCountries();
    this.getData();
    if (this.country_id) {
      this.loadCountryName();
    }
  },

  methods: {
    getData() {
      this.fetchData(this.propSearchUrl);
    },

    onCountryChange() {
      this.meta.current_page = 1;
      this.getData();
    },

    clearCountryFilter() {
      // Navigate back to all governorates
      this.$router.push({ name: "governorates" });
    },

    async loadCountries() {
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          { headers: general_request.headers }
        );
        this.countries = response.data.data || [];
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    },

    async loadCountryName() {
      if (!this.country_id) return;

      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/country/${this.country_id}`,
          { headers: general_request.headers }
        );
        this.countryName = response.data.data?.name || "Unknown Country";
      } catch (error) {
        console.error("Error loading country name:", error);
        this.countryName = "Unknown Country";
      }
    },

    viewCities(governorate) {
      this.$router.push({
        name: "cities",
        params: {
          country_id: governorate.country_id,
          governorate_id: governorate.id,
        },
      });
    },

    createGovernorate() {
      this.$refs.governorateCreateModal.openModal();
    },

    handleGovernorateCreated(newGovernorate) {
      this.handleItemCreated(newGovernorate);
    },

    editGovernorateModal(governorate) {
      this.selectedItem = { ...governorate };
      this.$nextTick(() => {
        this.$refs.governorateEditModal.openModal();
      });
    },

    handleGovernorateUpdated(updatedGovernorate) {
      this.handleItemUpdated(updatedGovernorate);
    },

    deleteRow(governorate) {
      this.deleteItem(
        governorate,
        this.propMainUrl,
        this.$t("governorates.governorateDeleted"),
        this.$t("governorates.deleteError")
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

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
