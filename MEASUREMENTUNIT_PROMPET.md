src\latest\model\company\parts

CompanyCreateForm.vue

and this is its content

<template>
  <div class="company-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information Section -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("companies.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('companies.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("companies.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('companies.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <!-- Phone -->
        <div class="col-12 md:col-6 field">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("companies.phone") }} *
          </label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
            :placeholder="$t('companies.phonePlaceholder')"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <!-- Email -->
        <div class="col-12 md:col-6 field">
          <label for="email" class="font-bold block mb-2">
            {{ $t("companies.email") }} *
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            :placeholder="$t('companies.emailPlaceholder')"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>
      </div>

      <!-- Client Selection -->
      <div class="field mb-3">
        <label for="client" class="font-bold block mb-2">
          {{ $t("companies.client") }} *
        </label>
        <Select
          id="client"
          v-model="selectedClient"
          :options="clients"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.client_id }"
          :placeholder="
            loadingClients
              ? $t('companies.loadingClients')
              : $t('companies.selectClient')
          "
          class="w-full"
          :loading="loadingClients"
          :disabled="loadingClients"
          filter
        />
        <small v-if="errors.client_id" class="p-error">
          {{ errors.client_id }}
        </small>
      </div>

      <!-- Location Section -->
      <div class="grid">
        <!-- Country -->
        <div class="col-12 md:col-4 field">
          <label for="country" class="font-bold block mb-2">
            {{ $t("companies.country") }}
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCountries
                ? $t('companies.loadingCountries')
                : $t('companies.selectCountry')
            "
            class="w-full"
            :loading="loadingCountries"
            :disabled="loadingCountries"
            @change="onCountryChange"
          />
        </div>

        <!-- Governorate -->
        <div class="col-12 md:col-4 field">
          <label for="governorate" class="font-bold block mb-2">
            {{ $t("companies.governorate") }}
          </label>
          <Select
            id="governorate"
            v-model="selectedGovernorate"
            :options="filteredGovernorates"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingGovernorates
                ? $t('companies.loadingGovernorates')
                : $t('companies.selectGovernorate')
            "
            class="w-full"
            :loading="loadingGovernorates"
            :disabled="loadingGovernorates || !selectedCountry"
            @change="onGovernorateChange"
          />
        </div>

        <!-- City -->
        <div class="col-12 md:col-4 field">
          <label for="city" class="font-bold block mb-2">
            {{ $t("companies.city") }}
          </label>
          <Select
            id="city"
            v-model="selectedCity"
            :options="filteredCities"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCities
                ? $t('companies.loadingCities')
                : $t('companies.selectCity')
            "
            class="w-full"
            :loading="loadingCities"
            :disabled="loadingCities || !selectedGovernorate"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="field mb-3">
        <label for="address" class="font-bold block mb-2">
          {{ $t("companies.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('companies.addressPlaceholder')"
        />
      </div>

      <!-- Currency -->
      <div class="field mb-3">
        <label for="currency" class="font-bold block mb-2">
          {{ $t("companies.currency") }} *
        </label>
        <Select
          id="currency"
          v-model="selectedCurrency"
          :options="currencies"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.currency_id }"
          :placeholder="
            loadingCurrencies
              ? $t('companies.loadingCurrencies')
              : $t('companies.selectCurrency')
          "
          class="w-full"
          :loading="loadingCurrencies"
          :disabled="loadingCurrencies"
        />
        <small v-if="errors.currency_id" class="p-error">
          {{ errors.currency_id }}
        </small>
      </div>

      <!-- Social Media Section -->
      <div class="grid">
        <div class="col-12 md:col-4 field">
          <label for="website_url" class="font-bold block mb-2">
            Website URL
          </label>
          <InputText
            id="website_url"
            v-model="formData.website_url"
            class="w-full"
            :placeholder="$t('companies.websiteUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="facebook_url" class="font-bold block mb-2">
            Facebook URL
          </label>
          <InputText
            id="facebook_url"
            v-model="formData.facebook_url"
            class="w-full"
            :placeholder="$t('companies.facebookUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="twitter_url" class="font-bold block mb-2">
            Twitter URL
          </label>
          <InputText
            id="twitter_url"
            v-model="formData.twitter_url"
            class="w-full"
            :placeholder="$t('companies.twitterUrlPlaceholder')"
          />
        </div>
      </div>

      <!-- Coordinates Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="longitude" class="font-bold block mb-2">
            Longitude
          </label>
          <InputText
            id="longitude"
            v-model="formData.longitude"
            class="w-full"
            :placeholder="$t('companies.longitudePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="latitude" class="font-bold block mb-2"> Latitude </label>
          <InputText
            id="latitude"
            v-model="formData.latitude"
            class="w-full"
            :placeholder="$t('companies.latitudePlaceholder')"
          />
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="logo" class="font-bold block mb-2">
            {{ $t("companies.logo") }}
          </label>
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onLogoSelect"
          />
          <small v-if="logoFile" class="p-text-secondary">
            {{ logoFile.name }}
          </small>
          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="cover" class="font-bold block mb-2">
            {{ $t("companies.cover") }}
          </label>
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onCoverSelect"
          />
          <small v-if="coverFile" class="p-text-secondary">
            {{ coverFile.name }}
          </small>
          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyCreateForm",
  components: {
    InputText,
    Textarea,
    Select,
    FileUpload,
    Button,
    Message,
  },
  data() {
    return {
      loading: false,
      loadingClients: false,
      loadingCountries: false,
      loadingGovernorates: false,
      loadingCities: false,
      loadingCurrencies: false,
      error: "",
      clients: [],
      countries: [],
      governorates: [],
      cities: [],
      currencies: [],
      selectedClient: null,
      selectedCountry: null,
      selectedGovernorate: null,
      selectedCity: null,
      selectedCurrency: null,
      logoFile: null,
      coverFile: null,
      formData: {
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      },
      errors: {},
    };
  },
  computed: {
    filteredGovernorates() {
      if (!this.selectedCountry) return [];
      return this.governorates.filter(
        (g) => g.country_id === this.selectedCountry
      );
    },
    filteredCities() {
      if (!this.selectedGovernorate) return [];
      return this.cities.filter(
        (c) => c.governorate_id === this.selectedGovernorate
      );
    },
  },
  watch: {
    selectedClient: {
      handler(newValue) {
        this.formData.client_id = newValue;
      },
    },
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
        this.selectedGovernorate = null;
        this.selectedCity = null;
        this.formData.governorate_id = "";
        this.formData.city_id = "";
      },
    },
    selectedGovernorate: {
      handler(newValue) {
        this.formData.governorate_id = newValue;
        this.selectedCity = null;
        this.formData.city_id = "";
      },
    },
    selectedCity: {
      handler(newValue) {
        this.formData.city_id = newValue;
      },
    },
    selectedCurrency: {
      handler(newValue) {
        this.formData.currency_id = newValue;
      },
    },
  },
  mounted() {
    this.loadClients();
    this.loadCountries();
    this.loadGovernorates();
    this.loadCities();
    this.loadCurrencies();
  },
  methods: {
    onCountryChange() {
      this.selectedGovernorate = null;
      this.selectedCity = null;
    },

    onGovernorateChange() {
      this.selectedCity = null;
    },

    onLogoSelect(event) {
      this.logoFile = event.files[0];
    },

    onCoverSelect(event) {
      this.coverFile = event.files[0];
    },

    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$http.post(
          `${general_request.BASE_URL}/storage/file`,
          formData,
          {
            headers: {
              ...general_request.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.data.id;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },

    resetForm() {
      this.formData = {
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      };
      this.selectedClient = null;
      this.selectedCountry = null;
      this.selectedGovernorate = null;
      this.selectedCity = null;
      this.selectedCurrency = null;
      this.logoFile = null;
      this.coverFile = null;
      this.errors = {};
      this.error = "";
    },

    async loadClients() {
      this.loadingClients = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/clients?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.clients = response.data.data || [];
      } catch (error) {
        console.error("Error loading clients:", error);
        this.error = this.$t("companies.loadClientsError");
      } finally {
        this.loadingClients = false;
      }
    },

    async loadCountries() {
      this.loadingCountries = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.countries = response.data.data || [];
      } catch (error) {
        console.error("Error loading countries:", error);
        this.error = this.$t("companies.loadCountriesError");
      } finally {
        this.loadingCountries = false;
      }
    },

    async loadGovernorates() {
      this.loadingGovernorates = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorates-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.governorates = response.data.data || [];
      } catch (error) {
        console.error("Error loading governorates:", error);
        this.error = this.$t("companies.loadGovernoratesError");
      } finally {
        this.loadingGovernorates = false;
      }
    },

    async loadCities() {
      this.loadingCities = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/cities-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.cities = response.data.data || [];
      } catch (error) {
        console.error("Error loading cities:", error);
        this.error = this.$t("companies.loadCitiesError");
      } finally {
        this.loadingCities = false;
      }
    },

    async loadCurrencies() {
      this.loadingCurrencies = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/7`,
          {
            headers: general_request.headers,
          }
        );
        this.currencies = response.data.data || [];
      } catch (error) {
        console.error("Error loading currencies:", error);
        this.error = this.$t("companies.loadCurrenciesError");
      } finally {
        this.loadingCurrencies = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = "Company name is required";
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = "Arabic company name is required";
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = "Phone number is required";
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = "Email is required";
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      if (!this.formData.client_id) {
        this.errors.client_id = "Client is required";
      }

      if (!this.formData.currency_id) {
        this.errors.currency_id = "Currency is required";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Upload files first and get IDs
        let logoId = null;
        let coverId = null;

        if (this.logoFile) {
          logoId = await this.uploadFile(this.logoFile);
        }

        if (this.coverFile) {
          coverId = await this.uploadFile(this.coverFile);
        }

        // Prepare company payload
        const payload = {
          client_id: this.formData.client_id,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          phone: this.formData.phone,
          email: this.formData.email,
          address: this.formData.address,
          longitude: this.formData.longitude,
          latitude: this.formData.latitude,
          website_url: this.formData.website_url,
          facebook_url: this.formData.facebook_url,
          twitter_url: this.formData.twitter_url,
          country_id: this.formData.country_id,
          governorate_id: this.formData.governorate_id,
          city_id: this.formData.city_id,
          currency_id: this.formData.currency_id,
        };

        // Add file IDs if they exist
        if (logoId) {
          payload.logo_id = logoId;
        }

        if (coverId) {
          payload.cover_id = coverId;
        }

        console.log("🚀 Creating company with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("company-created", response.data.data);

        this.showToast(
          "success",
          this.$t("companies.success"),
          this.$t("companies.companyCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("companies.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("companies.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("client") || message.includes("client_id")) {
          this.errors.client_id = message;
        } else if (
          message.includes("currency") ||
          message.includes("currency_id")
        ) {
          this.errors.currency_id = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("phone")) {
          this.errors.phone = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.company-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>
_____________________________________________

CompanyCreateModal.vue

and this is its content

<template>
  <Dialog
    :header="$t('companies.createCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyCreateForm
      @company-created="handleCompanyCreated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyCreateForm from "./CompanyCreateForm.vue";

export default {
  name: "CompanyCreateModal",
  components: {
    Dialog,
    CompanyCreateForm,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCompanyCreated(newCompany) {
      this.$emit("company-created", newCompany);
      this.closeModal();
    },
  },
};
</script>

_______________________________________________

CompanyDetails.vue

and this is its content

<template>
  <div class="company-show-wrapper">
    <CompanyStatistics :company="company" />
    <Divider />
    <CompanyDetails :company="company" />
  </div>
</template>

<script>
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";
import Divider from "primevue/divider";
import CompanyDetails from "../parts/details/CompanyDetails.vue";


import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyShow",
  components: {
    Divider,
    CompanyDetails,
    CompanyStatistics,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      company: {},
      loading: false,
    };
  },
  mounted() {
    this.fetchCompany();
  },

  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}
</style>

___________________________________

CompanyEditForm.vue

it content

<template>
  <div class="company-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information Section -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("companies.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('companies.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("companies.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('companies.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <!-- Phone -->
        <div class="col-12 md:col-6 field">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("companies.phone") }} *
          </label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
            :placeholder="$t('companies.phonePlaceholder')"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <!-- Email -->
        <div class="col-12 md:col-6 field">
          <label for="email" class="font-bold block mb-2">
            {{ $t("companies.email") }} *
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            :placeholder="$t('companies.emailPlaceholder')"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>
      </div>

      <!-- Client (Read-only) -->
      <div class="field mb-3">
        <label class="font-bold block mb-2">
          {{ $t("companies.client") }}
        </label>
        <div
          class="p-inputtext p-component w-full"
          style="background: #f8f9fa; color: #6c757d"
        >
          {{ clientName }}
        </div>
        <small class="p-text-secondary">
          Client cannot be changed when editing
        </small>
      </div>

      <!-- Location Section -->
      <div class="grid">
        <!-- Country -->
        <div class="col-12 md:col-4 field">
          <label for="country" class="font-bold block mb-2">
            {{ $t("companies.country") }}
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCountries
                ? $t('companies.loadingCountries')
                : $t('companies.selectCountry')
            "
            class="w-full"
            :loading="loadingCountries"
            :disabled="loadingCountries"
            @change="onCountryChange"
          />
        </div>

        <!-- Governorate -->
        <div class="col-12 md:col-4 field">
          <label for="governorate" class="font-bold block mb-2">
            {{ $t("companies.governorate") }}
          </label>
          <Select
            id="governorate"
            v-model="selectedGovernorate"
            :options="filteredGovernorates"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingGovernorates
                ? $t('companies.loadingGovernorates')
                : $t('companies.selectGovernorate')
            "
            class="w-full"
            :loading="loadingGovernorates"
            :disabled="loadingGovernorates || !selectedCountry"
            @change="onGovernorateChange"
          />
        </div>

        <!-- City -->
        <div class="col-12 md:col-4 field">
          <label for="city" class="font-bold block mb-2">
            {{ $t("companies.city") }}
          </label>
          <Select
            id="city"
            v-model="selectedCity"
            :options="filteredCities"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCities
                ? $t('companies.loadingCities')
                : $t('companies.selectCity')
            "
            class="w-full"
            :loading="loadingCities"
            :disabled="loadingCities || !selectedGovernorate"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="field mb-3">
        <label for="address" class="font-bold block mb-2">
          {{ $t("companies.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('companies.addressPlaceholder')"
        />
      </div>

      <!-- Currency -->
      <div class="field mb-3">
        <label for="currency" class="font-bold block mb-2">
          {{ $t("companies.currency") }} *
        </label>
        <Select
          id="currency"
          v-model="selectedCurrency"
          :options="currencies"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.currency_id }"
          :placeholder="
            loadingCurrencies
              ? $t('companies.loadingCurrencies')
              : $t('companies.selectCurrency')
          "
          class="w-full"
          :loading="loadingCurrencies"
          :disabled="loadingCurrencies"
        />
        <small v-if="errors.currency_id" class="p-error">
          {{ errors.currency_id }}
        </small>
      </div>

      <!-- Social Media Section -->
      <div class="grid">
        <div class="col-12 md:col-4 field">
          <label for="website_url" class="font-bold block mb-2">
            Website URL
          </label>
          <InputText
            id="website_url"
            v-model="formData.website_url"
            class="w-full"
            :placeholder="$t('companies.websiteUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="facebook_url" class="font-bold block mb-2">
            Facebook URL
          </label>
          <InputText
            id="facebook_url"
            v-model="formData.facebook_url"
            class="w-full"
            :placeholder="$t('companies.facebookUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="twitter_url" class="font-bold block mb-2">
            Twitter URL
          </label>
          <InputText
            id="twitter_url"
            v-model="formData.twitter_url"
            class="w-full"
            :placeholder="$t('companies.twitterUrlPlaceholder')"
          />
        </div>
      </div>

      <!-- Coordinates Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="longitude" class="font-bold block mb-2">
            Longitude
          </label>
          <InputText
            id="longitude"
            v-model="formData.longitude"
            class="w-full"
            :placeholder="$t('companies.longitudePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="latitude" class="font-bold block mb-2"> Latitude </label>
          <InputText
            id="latitude"
            v-model="formData.latitude"
            class="w-full"
            :placeholder="$t('companies.latitudePlaceholder')"
          />
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="logo" class="font-bold block mb-2">
            {{ $t("companies.logo") }}
          </label>

          <!-- Current Logo Preview -->
          <div v-if="company.logo" class="current-file-preview mb-3">
            <label class="p-text-secondary text-sm block mb-2"
              >Current Logo:</label
            >
            <img
              :src="company.logo.file_path"
              :alt="formData.name"
              class="file-preview-image"
            />
          </div>

          <!-- New Logo Upload -->
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onLogoSelect"
          />

          <!-- New Logo Preview -->
          <div v-if="logoFile" class="new-file-preview mt-2">
            <label class="p-text-secondary text-sm block mb-2"
              >New Logo Preview:</label
            >
            <img
              :src="getFilePreview(logoFile)"
              alt="New Logo Preview"
              class="file-preview-image"
            />
          </div>

          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="cover" class="font-bold block mb-2">
            {{ $t("companies.cover") }}
          </label>

          <!-- Current Cover Preview -->
          <div v-if="company.cover" class="current-file-preview mb-3">
            <label class="p-text-secondary text-sm block mb-2"
              >Current Cover:</label
            >
            <img
              :src="company.cover.file_path"
              :alt="formData.name"
              class="file-preview-image"
            />
          </div>

          <!-- New Cover Upload -->
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onCoverSelect"
          />

          <!-- New Cover Preview -->
          <div v-if="coverFile" class="new-file-preview mt-2">
            <label class="p-text-secondary text-sm block mb-2"
              >New Cover Preview:</label
            >
            <img
              :src="getFilePreview(coverFile)"
              alt="New Cover Preview"
              class="file-preview-image"
            />
          </div>

          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.update')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyEditForm",
  components: {
    InputText,
    Textarea,
    Select,
    FileUpload,
    Button,
    Message,
  },
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      loadingCountries: false,
      loadingGovernorates: false,
      loadingCities: false,
      loadingCurrencies: false,
      error: "",
      countries: [],
      governorates: [],
      cities: [],
      currencies: [],
      selectedCountry: null,
      selectedGovernorate: null,
      selectedCity: null,
      selectedCurrency: null,
      logoFile: null,
      coverFile: null,
      clientName: "",
      formData: {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      },
      errors: {},
    };
  },
  computed: {
    filteredGovernorates() {
      if (!this.selectedCountry) return [];
      return this.governorates.filter(
        (g) => g.country_id === this.selectedCountry
      );
    },
    filteredCities() {
      if (!this.selectedGovernorate) return [];
      return this.cities.filter(
        (c) => c.governorate_id === this.selectedGovernorate
      );
    },
  },
  watch: {
    company: {
      immediate: true,
      deep: true,
      handler(newCompany) {
        if (newCompany && newCompany.id) {
          this.populateForm(newCompany);
        } else {
          this.resetForm();
        }
      },
    },
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
        if (!newValue) {
          this.selectedGovernorate = null;
          this.selectedCity = null;
        }
      },
    },
    selectedGovernorate: {
      handler(newValue) {
        this.formData.governorate_id = newValue;
        if (!newValue) {
          this.selectedCity = null;
        }
      },
    },
    selectedCity: {
      handler(newValue) {
        this.formData.city_id = newValue;
      },
    },
    selectedCurrency: {
      handler(newValue) {
        this.formData.currency_id = newValue;
      },
    },
  },
  mounted() {
    this.loadCountries();
    this.loadGovernorates();
    this.loadCities();
    this.loadCurrencies();
  },
  methods: {
    onCountryChange() {
      this.selectedGovernorate = null;
      this.selectedCity = null;
    },

    onGovernorateChange() {
      this.selectedCity = null;
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
    },

    onLogoSelect(event) {
      this.logoFile = event.files[0];
    },

    onCoverSelect(event) {
      this.coverFile = event.files[0];
    },

    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$http.post(
          `${general_request.BASE_URL}/storage/file`,
          formData,
          {
            headers: {
              ...general_request.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.data.id;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },

    populateForm(company) {
      console.log("🔍 Populating form with company data:", company);

      this.resetForm();

      this.formData.id = company.id || "";
      this.formData.name = company.name || "";
      this.formData.name_ar = company.name_ar || "";
      this.formData.phone = company.phone || "";
      this.formData.email = company.email || "";
      this.formData.address = company.address || "";
      this.formData.website_url = company.website_url || "";
      this.formData.facebook_url = company.facebook_url || "";
      this.formData.twitter_url = company.twitter_url || "";
      this.formData.longitude = company.longitude || "";
      this.formData.latitude = company.latitude || "";
      this.formData.client_id = company.client?.id || "";
      this.formData.country_id = company.country?.id || "";
      this.formData.governorate_id = company.governorate?.id || "";
      this.formData.city_id = company.city?.id || "";
      this.formData.currency_id = company.currency?.id || "";
      this.formData.logo_id = company.logo?.id || "";
      this.formData.cover_id = company.cover?.id || "";

      // Set selected values
      this.selectedCountry = company.country?.id || null;
      this.selectedGovernorate = company.governorate?.id || null;
      this.selectedCity = company.city?.id || null;
      this.selectedCurrency = company.currency?.id || null;

      // Set client name for display
      this.clientName = company.client?.name || "Unknown Client";

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      };
      this.selectedCountry = null;
      this.selectedGovernorate = null;
      this.selectedCity = null;
      this.selectedCurrency = null;
      this.logoFile = null;
      this.coverFile = null;
      this.clientName = "";
      this.errors = {};
      this.error = "";
    },

    async loadCountries() {
      this.loadingCountries = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.countries = response.data.data || [];
      } catch (error) {
        console.error("Error loading countries:", error);
        this.error = this.$t("companies.loadCountriesError");
      } finally {
        this.loadingCountries = false;
      }
    },

    async loadGovernorates() {
      this.loadingGovernorates = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorates-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.governorates = response.data.data || [];
      } catch (error) {
        console.error("Error loading governorates:", error);
        this.error = this.$t("companies.loadGovernoratesError");
      } finally {
        this.loadingGovernorates = false;
      }
    },

    async loadCities() {
      this.loadingCities = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/cities-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.cities = response.data.data || [];
      } catch (error) {
        console.error("Error loading cities:", error);
        this.error = this.$t("companies.loadCitiesError");
      } finally {
        this.loadingCities = false;
      }
    },

    async loadCurrencies() {
      this.loadingCurrencies = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/2`,
          {
            headers: general_request.headers,
          }
        );
        this.currencies = response.data.data || [];
      } catch (error) {
        console.error("Error loading currencies:", error);
        this.error = this.$t("companies.loadCurrenciesError");
      } finally {
        this.loadingCurrencies = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = "Company name is required";
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = "Arabic company name is required";
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = "Phone number is required";
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = "Email is required";
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      if (!this.formData.currency_id) {
        this.errors.currency_id = "Currency is required";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Upload files first and get IDs (same as create form)
        let logoId = this.formData.logo_id;
        let coverId = this.formData.cover_id;

        if (this.logoFile) {
          logoId = await this.uploadFile(this.logoFile);
        }

        if (this.coverFile) {
          coverId = await this.uploadFile(this.coverFile);
        }

        // Prepare company payload (same structure as create form)
        const payload = {
          _method: "PATCH", // Use PATCH for update
          client_id: this.formData.client_id,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          phone: this.formData.phone,
          email: this.formData.email,
          address: this.formData.address,
          longitude: this.formData.longitude,
          latitude: this.formData.latitude,
          website_url: this.formData.website_url,
          facebook_url: this.formData.facebook_url,
          twitter_url: this.formData.twitter_url,
          country_id: this.formData.country_id,
          governorate_id: this.formData.governorate_id,
          city_id: this.formData.city_id,
          currency_id: this.formData.currency_id,
        };

        // Add file IDs if they exist (same as create form)
        if (logoId) {
          payload.logo_id = logoId;
        }

        if (coverId) {
          payload.cover_id = coverId;
        }

        console.log("🚀 Updating company with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company/${this.formData.id}`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.$emit("company-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("companies.success"),
          this.$t("companies.companyUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("companies.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("companies.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("currency") || message.includes("currency_id")) {
          this.errors.currency_id = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("phone")) {
          this.errors.phone = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>
<style scoped>
.company-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.file-preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.current-file-preview,
.new-file-preview {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 0.5rem;
  background: var(--surface-ground);
}

.current-file-preview label,
.new-file-preview label {
  font-weight: 500;
  color: var(--text-color);
}
</style>


__________________________________________________

CompanyEditModal.vue

<template>
  <Dialog
    :header="$t('companies.editCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyEditForm
      :company="company"
      @company-updated="handleCompanyUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyEditForm from "./CompanyEditForm.vue";

export default {
  name: "CompanyEditModal",
  components: {
    Dialog,
    CompanyEditForm,
  },
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCompanyUpdated(updatedCompany) {
      this.$emit("company-updated", updatedCompany);
      this.closeModal();
    },
  },
};
</script>

____________________________________________

CompanyShow.vue
its content

<template>
  <div class="company-show-wrapper" :class="layoutClasses">
    <!-- نحط كل حاجة في container واحد -->
    <div class="company-layout-container">
      <!-- Company Header -->
      <CompanyHeader
        :company="company"
        :current-page="$route.name"
        @toggle-sidebar="toggleSidebar"
        @go-back="goBackToCompanies"
        @edit-company="editCompany"
      />

      <!-- Company Sidebar -->
      <CompanySidebar
        :company="company"
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />

      <!-- Mobile Overlay -->
      <div
        v-if="isMobile && !sidebarCollapsed"
        class="company-sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- Main Content -->
      <main
        class="company-main-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <div class="company-show-page">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex justify-content-center align-items-center py-6"
          >
            <ProgressSpinner />
            <p class="ml-3">{{ $t("common.loading") }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <Message severity="error" class="mb-3">
              {{ error }}
            </Message>
            <Button
              :label="$t('common.retry')"
              icon="pi pi-refresh"
              @click="fetchCompany"
            />
          </div>

          <!-- Company Content -->
          <div v-else-if="company.id" class="company-content"></div>

          <RouterView :company="company" :company_id="company_id" />
        </div>
      </main>
    </div>

    <!-- Edit Company Modal -->
    <CompanyEditModal
      ref="companyEditModal"
      :company="company"
      @company-updated="handleCompanyUpdated"
    />

    <Toast />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

// Import Company Layouts
import CompanyHeader from "../layouts/CompanyHeader.vue";
import CompanySidebar from "../layouts/CompanySidebar.vue";

// Import Components
import CompanyDetails from "../parts/details/CompanyDetails.vue";
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";

// Import Edit Modal
import CompanyEditModal from "./CompanyEditModal.vue";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Divider from "primevue/divider";

export default {
  name: "CompanyShow",
  components: {
    RouterView,
    CompanyHeader,
    CompanySidebar,
    CompanyEditModal, // ضيفنا الـ modal هنا
    Button,
    ProgressSpinner,
    Message,
    Toast,
    Divider,
  },
  mixins: [useTable()],
  props: {
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      company: {},
      loading: false,
      error: "",
      sidebarCollapsed: false,
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
    };
  },
  computed: {
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
    },
    layoutClasses() {
      return {
        "company-ltr": this.currentDirection === "ltr",
        "company-rtl": this.currentDirection === "rtl",
        "mobile-view": this.isMobile,
      };
    },
  },
  mounted() {
    this.fetchCompany();
    this.checkMobile();
    this.setupLanguageListener();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
    if (this.languageUnwatch) {
      this.languageUnwatch();
    }
  },
  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    goBackToCompanies() {
      this.$router.push("/companies");
    },

    editCompany() {
      // افتح الـ modal للتحرير
      this.$refs.companyEditModal.openModal();
    },

    handleCompanyUpdated(updatedCompany) {
      // update الـ company data بعد التعديل
      this.company = { ...this.company, ...updatedCompany };

      // show success message
      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("companies.companyUpdated")
      );

      // refresh البيانات علشان نتأكد إن كل حاجة updated
      this.fetchCompany();
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },

    setupLanguageListener() {
      this.languageUnwatch = this.$watch("$i18n.locale", (newLocale) => {
        this.currentLanguage = newLocale;
      });
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}

/* الـ container الجديد علشان نحصر كل حاجة */
.company-layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* مهم جداً علشان نحصر المحتوى */
}

.company-main-content {
  min-height: calc(100vh - 70px);
  margin-left: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  background: var(--surface-ground);
  margin-top: 70px;
  position: relative;
  z-index: 1;
}

/* When sidebar is collapsed */
.company-main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* RTL Support */
.company-rtl .company-main-content {
  margin-left: 0;
  margin-right: 280px;
}

.company-rtl .company-main-content.sidebar-collapsed {
  margin-right: 70px;
}

.company-show-page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  transition: all 0.3s ease;
}

.company-sidebar-overlay {
  position: absolute; /* غيرنا لـ absolute علشان يفضل داخل الـ container */
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 699;
  backdrop-filter: blur(2px);
}

.error-state {
  text-align: center;
  padding: 2rem;
}

.company-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .company-layout-container {
    overflow: visible; /* في الموبايل بنسمح بالـ overlay */
  }

  .company-main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    margin-top: 70px;
  }

  .company-sidebar-overlay {
    top: 70px;
    z-index: 899;
  }
}
</style>


___________________________________________________

CompanyTable.vue

its content

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
      class="p-datatable-sm"
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
            class="logo-image"
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
    console.log("Companies component mounted");
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
      console.log("Navigating to company:", company.id, company.name);
      this.$router.push({
        name: "company-show",
        params: { company_id: company.id },
      });
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

.logo-image {
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


______________________________________
src\latest\model\company\parts\details
CompanyDetails.vue
its content


<template>
  <div class="company-details">
    <!-- Cover Image -->
    <div class="cover-image-section mb-4">
      <img
        v-if="company.cover"
        :src="company.cover.file_path"
        :alt="company.name"
        class="cover-image"
      />
      <div v-else class="cover-placeholder">
        <i class="pi pi-image text-6xl text-color-secondary"></i>
        <p class="text-color-secondary mt-2">
          {{ $t("companies.noCoverImage") }}
        </p>
      </div>
    </div>

    <!-- Main Details Card -->
    <Card>
      <template #title>
        <div class="flex align-items-center gap-3">
          <img
            v-if="company.logo"
            :src="company.logo.file_path"
            :alt="company.name"
            class="company-logo-large"
          />
          <div>
            <h2 class="m-0">{{ company.name }}</h2>
            <p class="m-0 text-color-secondary">{{ company.name_ar }}</p>
          </div>
        </div>
      </template>
      <template #content>
        <div class="grid">
          <!-- Contact Information -->
          <div class="col-12 md:col-6">
            <h4 class="mb-3">{{ $t("companies.contactInfo") }}</h4>
            <div class="space-y-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-phone text-primary"></i>
                <span>{{ company.phone || $t("companies.notProvided") }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-envelope text-primary"></i>
                <span>{{ company.email || $t("companies.notProvided") }}</span>
              </div>
              <div class="flex align-items-start gap-2">
                <i class="pi pi-map-marker text-primary mt-1"></i>
                <span>{{
                  company.address || $t("companies.notProvided")
                }}</span>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="col-12 md:col-6">
            <h4 class="mb-3">{{ $t("companies.locationInfo") }}</h4>
            <div class="space-y-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-globe text-primary"></i>
                <span>{{
                  company.country?.name || $t("companies.notProvided")
                }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-building text-primary"></i>
                <span>{{
                  company.governorate?.name || $t("companies.notProvided")
                }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-home text-primary"></i>
                <span>{{
                  company.city?.name || $t("companies.notProvided")
                }}</span>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="col-12 md:col-6 mt-4">
            <h4 class="mb-3">{{ $t("companies.socialMedia") }}</h4>
            <div class="space-y-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-external-link text-primary"></i>
                <span>{{
                  company.website_url || $t("companies.notProvided")
                }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-facebook text-primary"></i>
                <span>{{
                  company.facebook_url || $t("companies.notProvided")
                }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-twitter text-primary"></i>
                <span>{{
                  company.twitter_url || $t("companies.notProvided")
                }}</span>
              </div>
            </div>
          </div>

          <!-- Business Information -->
          <div class="col-12 md:col-6 mt-4">
            <h4 class="mb-3">{{ $t("companies.businessInfo") }}</h4>
            <div class="space-y-3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-money-bill text-primary"></i>
                <span>{{
                  company.currency?.name || $t("companies.notProvided")
                }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-user text-primary"></i>
                <span>{{
                  company.client?.name || $t("companies.notProvided")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from "primevue/card";

export default {
  name: "CompanyDetails",
  components: {
    Card,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.company-details {
  max-width: 100%;
}

.cover-image-section {
  border-radius: 12px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.cover-placeholder {
  height: 200px;
  background: var(--surface-ground);
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.company-logo-large {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid var(--surface-border);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

:deep(.p-card-title) {
  display: flex;
  align-items: center;
}
</style>
___________________________________________________
src\latest\model\company\parts\details\CompanyStatistics.vue
its content

<template>
  <div class="company-statistics">
    <h4 class="mb-4">{{ $t("companies.companyStatistics") }}</h4>

    <div class="grid">
      <!-- Total Categories -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-primary">
                  {{ statistics.totalCategories }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalCategories") }}
                </div>
              </div>
              <i class="pi pi-folder text-3xl text-primary"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Products -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-green-500">
                  {{ statistics.totalProducts }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalProducts") }}
                </div>
              </div>
              <i class="pi pi-shopping-bag text-3xl text-green-500"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Branches -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-blue-500">
                  {{ statistics.totalBranches }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalBranches") }}
                </div>
              </div>
              <i class="pi pi-map-marker text-3xl text-blue-500"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Employees -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-orange-500">
                  {{ statistics.totalEmployees }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalEmployees") }}
                </div>
              </div>
              <i class="pi pi-users text-3xl text-orange-500"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Additional Stats -->
    <div class="grid mt-3">
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-chart-line text-4xl text-purple-500 mb-2"></i>
              <div class="text-xl font-bold">$12,450</div>
              <div class="text-color-secondary">Monthly Revenue</div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-shopping-cart text-4xl text-cyan-500 mb-2"></i>
              <div class="text-xl font-bold">245</div>
              <div class="text-color-secondary">Monthly Orders</div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-star text-4xl text-yellow-500 mb-2"></i>
              <div class="text-xl font-bold">4.8</div>
              <div class="text-color-secondary">Customer Rating</div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";

export default {
  name: "CompanyStatistics",
  components: {
    Card,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statistics: {
        totalCategories: 12,
        totalProducts: 156,
        totalBranches: 3,
        totalEmployees: 24,
      },
    };
  },
};
</script>

<style scoped>
.stat-card {
  height: 100%;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

.company-statistics h4 {
  color: var(--text-color);
  font-weight: 600;
}
</style>







now you can see company structure and its related models ok??

____________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________
src\latest\model\measurement_unit
its content

<template>
  <div class="measurement-unit-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("measurementUnits.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('measurementUnits.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("measurementUnits.name_ar") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="formData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
          :placeholder="$t('measurementUnits.nameArPlaceholder')"
        />
        <small v-if="errors.name_ar" class="p-error">{{
          errors.name_ar
        }}</small>
      </div>

      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "MeasurementUnitCreateForm",
  components: {
    InputText,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      formData: {
        name: "",
        name_ar: "",
      },
      errors: {},
    };
  },
  methods: {
    resetForm() {
      this.formData = {
        name: "",
        name_ar: "",
      };
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("measurementUnits.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("measurementUnits.nameArRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/measurement-unit`;

        const payload = {
          company_id: this.effectiveCompanyId,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
        };

        console.log("📤 Creating measurement unit with payload:", payload);

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Measurement unit created successfully:", response.data);

        this.resetForm();
        this.$emit("measurement-unit-created", response.data.data);

        this.showToast(
          "success",
          this.$t("measurementUnits.success"),
          this.$t("measurementUnits.measurementUnitCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error =
        responseData.message || this.$t("measurementUnits.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("measurementUnits.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("company")) {
          this.error = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.measurement-unit-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>

______________________________________________
src\latest\model\measurement_unit\parts\MeasurementUnitCreateModal.vue
its content

<template>
  <Dialog
    :header="$t('measurementUnits.createMeasurementUnit')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <MeasurementUnitCreateForm
      :company_id="effectiveCompanyId"
      @measurement-unit-created="handleMeasurementUnitCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("measurementUnits.creatingMeasurementUnit") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import MeasurementUnitCreateForm from "./MeasurementUnitCreateForm.vue";

export default {
  name: "MeasurementUnitCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    MeasurementUnitCreateForm,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
    },

    handleMeasurementUnitCreated(newMeasurementUnit) {
      this.$emit("measurement-unit-created", newMeasurementUnit);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>


_____________________________________

src\latest\model\measurement_unit\parts\MeasurementUnitEditForm.vue

<template>
  <div class="measurement-unit-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("measurementUnits.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("measurementUnits.name_ar") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="formData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
        />
        <small v-if="errors.name_ar" class="p-error">{{
          errors.name_ar
        }}</small>
      </div>

      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="submitButtonText"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "MeasurementUnitEditForm",
  components: {
    InputText,
    Button,
    Message,
  },
  props: {
    measurementUnit: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    submitButtonText() {
      return this.formData.id
        ? this.$t("common.update")
        : this.$t("common.create");
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      formData: {
        id: "",
        name: "",
        name_ar: "",
      },
      errors: {},
    };
  },
  watch: {
    measurementUnit: {
      immediate: true,
      deep: true,
      handler(newMeasurementUnit) {
        if (newMeasurementUnit && newMeasurementUnit.id) {
          this.populateForm(newMeasurementUnit);
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    populateForm(measurementUnit) {
      console.log("📝 Populating form with measurement unit:", measurementUnit);

      this.formData = {
        id: measurementUnit.id || "",
        name: measurementUnit.name || "",
        name_ar: measurementUnit.name_ar || "",
      };

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
      };
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("validation.nameArRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/company/measurement-unit/${this.formData.id}`;

        const payload = {
          name: this.formData.name,
          name_ar: this.formData.name_ar,
        };

        console.log("📤 Updating measurement unit with payload:", payload);

        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Measurement unit updated successfully:", response.data);
        this.$emit("measurement-unit-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("measurementUnits.success"),
          this.$t("measurementUnits.measurementUnitUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error =
        responseData.message || this.$t("measurementUnits.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("measurementUnits.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.measurement-unit-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>

____________________________________

src\latest\model\measurement_unit\parts\MeasurementUnitEditModal.vue
<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <MeasurementUnitEditForm
      :measurement-unit="measurementUnit"
      :company_id="effectiveCompanyId"
      @measurement-unit-updated="handleMeasurementUnitUpdated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import MeasurementUnitEditForm from "./MeasurementUnitEditForm.vue";

export default {
  name: "MeasurementUnitEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    MeasurementUnitEditForm,
  },
  props: {
    measurementUnit: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    headerText() {
      return this.measurementUnit?.id
        ? this.$t("measurementUnits.editMeasurementUnit")
        : this.$t("measurementUnits.createMeasurementUnit");
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleMeasurementUnitUpdated(updatedMeasurementUnit) {
      this.$emit("measurement-unit-updated", updatedMeasurementUnit);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>

_____________________________________________________
src\latest\model\measurement_unit\parts\MeasurementUnitTable.vue

<template>
  <div class="measurement-unit-table-page">
    <div class="mb-4">
      <Button
        :label="$t('measurementUnits.addMeasurementUnit')"
        icon="pi pi-plus"
        @click="createMeasurementUnit"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('measurementUnits.search')"
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
        :placeholder="$t('measurementUnits.show')"
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
      <Column
        field="id"
        :header="$t('measurementUnits.id')"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column
        field="name"
        :header="$t('measurementUnits.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <Column
        field="equals"
        :header="$t('measurementUnits.equals')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.equals || "-" }}</span>
        </template>
      </Column>

      <Column
        field="created_at"
        :header="$t('measurementUnits.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <Column
        :header="$t('measurementUnits.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editMeasurementUnitModal(slotProps.data)"
              v-tooltip.top="$t('measurementUnits.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('measurementUnits.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <MeasurementUnitEditModal
      ref="measurementUnitEditModal"
      :measurement-unit="selectedItem"
      :company_id="effectiveCompanyId"
      @measurement-unit-updated="handleMeasurementUnitUpdated"
    />

    <MeasurementUnitCreateModal
      ref="measurementUnitCreateModal"
      :company_id="effectiveCompanyId"
      @measurement-unit-created="handleMeasurementUnitCreated"
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

import MeasurementUnitCreateModal from "./MeasurementUnitCreateModal.vue";
import MeasurementUnitEditModal from "./MeasurementUnitEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "MeasurementUnitTable",

  components: {
    MeasurementUnitCreateModal,
    MeasurementUnitEditModal,
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
        console.error("❌ No company ID found!");
        return "";
      }
      return `${general_request.BASE_URL}/admin/company/measurement-units/${this.effectiveCompanyId}?paginate=true`;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/measurement-unit`;
    },
  },

  mounted() {
    console.log("🚀 MeasurementUnitTable mounted()");
    console.log("🏢 Effective Company ID:", this.effectiveCompanyId);

    if (this.effectiveCompanyId) {
      console.log("✅ Company ID found, fetching measurement units...");
      this.getData();
    } else {
      console.error("❌ No company ID found!");
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        console.log("🛣️ Route company_id changed:", newCompanyId);
        if (newCompanyId) {
          console.log("✅ Company ID available, fetching data...");
          this.getData();
        }
      },
    },
  },

  methods: {
    createMeasurementUnit() {
      this.$refs.measurementUnitCreateModal.openModal();
    },

    handleMeasurementUnitCreated(newMeasurementUnit) {
      this.handleItemCreated(newMeasurementUnit);
    },

    editMeasurementUnitModal(measurementUnit) {
      this.selectedItem = { ...measurementUnit };
      this.$nextTick(() => {
        this.$refs.measurementUnitEditModal.openModal();
      });
    },

    handleMeasurementUnitUpdated(updatedMeasurementUnit) {
      this.handleItemUpdated(updatedMeasurementUnit);
    },

    deleteRow(measurementUnit) {
      this.deleteItem(
        measurementUnit,
        this.propMainUrl,
        this.$t("measurementUnits.measurementUnitDeleted"),
        this.$t("measurementUnits.deleteError")
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


___________________________________________________

src\latest\model\measurement_unit\routes\measurement_unit_routes.js
import MeasurementUnitTable from "../parts/MeasurementUnitTable.vue";

const measurement_unit_routes = [
     {
          path: "/company/:company_id/measurement-units",
          name: "company-measurement-units",
          component: MeasurementUnitTable,
          props: true,
     }
];

export default measurement_unit_routes;


_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________________________________________


At last i want from you if you under stand above structure and examples to create Final Product Inside Company



ok step by step 
this is the get final products url=>api
{{base_url}}/admin/company/product/company-final-products/search/{{company_id}}?category_id=&product_id={{product_id}}&query_string=&paginate=true

this is its response

{
    "data": [
        {
            "id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "name": "product name",
            "name_ar": "product name",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 0,
            "price": null,
            "details": "details for product222",
            "details_ar": "details for product222",
            "created_at": "2025-11-25T03:11:01.000000Z",
            "final_product_variant_values": [
                {
                    "id": "a0704350-967b-4408-8c95-4bb03959c09e",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                    "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
                    "final_product_id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
                    "created_at": "2025-11-25T03:11:01.000000Z",
                    "variant": {
                        "id": "a06fe99d-2819-497b-aac9-6df1767699af",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "updated variant name",
                        "name_ar": "updated variant name",
                        "created_at": "2025-11-24T23:00:12.000000Z"
                    },
                    "variant_value": {
                        "id": "a06ff3c7-700d-432c-8550-4a6ae856de15",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "a06fe99d-2819-497b-aac9-6df1767699af",
                        "value": "larg",
                        "value_ar": "larg",
                        "created_at": "2025-11-24T23:28:37.000000Z"
                    }
                }
            ],
            "main_image": null
        },
        {
            "id": "a0703ec6-0910-406f-8722-48ccff6b0e2e",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "name": "product name",
            "name_ar": "product name",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 0,
            "price": null,
            "details": "details for product222",
            "details_ar": "details for product222",
            "created_at": "2025-11-25T02:58:19.000000Z",
            "final_product_variant_values": [
                {
                    "id": "a0703ec6-09b9-4500-ae5c-16dd76a8b8e6",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                    "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
                    "final_product_id": "a0703ec6-0910-406f-8722-48ccff6b0e2e",
                    "created_at": "2025-11-25T02:58:19.000000Z",
                    "variant": {
                        "id": "a06fe99d-2819-497b-aac9-6df1767699af",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "updated variant name",
                        "name_ar": "updated variant name",
                        "created_at": "2025-11-24T23:00:12.000000Z"
                    },
                    "variant_value": {
                        "id": "a06ff3c7-700d-432c-8550-4a6ae856de15",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "a06fe99d-2819-497b-aac9-6df1767699af",
                        "value": "larg",
                        "value_ar": "larg",
                        "created_at": "2025-11-24T23:28:37.000000Z"
                    }
                }
            ],
            "main_image": null
        },
        {
            "id": "a0703e2b-eb9d-47fa-bc5b-5b60b5d23c6f",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "name": "product name",
            "name_ar": "product name",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 0,
            "price": null,
            "details": "details for product222",
            "details_ar": "details for product222",
            "created_at": "2025-11-25T02:56:38.000000Z",
            "final_product_variant_values": [],
            "main_image": null
        },
        {
            "id": "9f99dd92-b164-4afc-8dba-a8b2302a5786",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
            "name": "hosam zaki",
            "name_ar": "hosam zaki",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 25,
            "price": 25,
            "details": "Invoice Details",
            "details_ar": "تفاصيل الضريبة",
            "created_at": "2025-08-10T13:19:22.000000Z",
            "final_product_variant_values": [],
            "main_image": null
        },
        {
            "id": "9f8c7be5-7219-4129-9136-03540d9ba228",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f8c5e71-388f-40cd-96b1-654edb5bec86",
            "name": "Chips",
            "name_ar": "شيبسي",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 10,
            "price": 10,
            "details": "Chips",
            "details_ar": "شيبسي",
            "created_at": "2025-08-03T21:40:28.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f8c7be5-78c5-4c3c-af8f-489596538692",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f8c5e71-388f-40cd-96b1-654edb5bec86",
                    "final_product_id": "9f8c7be5-7219-4129-9136-03540d9ba228",
                    "created_at": "2025-08-03T21:40:28.000000Z",
                    "variant": {
                        "id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "المقاس",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-2412-4fb2-9c33-ee1d6e84e194",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "value": "small",
                        "value_ar": "صغير",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                }
            ],
            "main_image": {
                "id": "9f8c7cb3-ea24-4e5a-b41f-795da2fb13d5",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "final_product_id": "9f8c7be5-7219-4129-9136-03540d9ba228",
                "file": {
                    "id": "9f8c7cb3-e496-43cd-9824-5373d9646bd3",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/q7h9KdWA0s__lays-potato.png",
                    "original_name": "lays-potato.png",
                    "new_name": "q7h9KdWA0s__lays-potato.png"
                }
            }
        },
        {
            "id": "9f8a6bf6-d0db-4803-bb63-4bdf6d45213a",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f8a6b3d-4902-40a7-862e-d4bf4e4ec7d6",
            "product_id": "9f8a6b87-31fa-4dd0-a3a8-957e38648128",
            "name": "new product 2",
            "name_ar": "منتج جديد 2",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 10,
            "price": 10,
            "details": "product details 2",
            "details_ar": "تفاصل المنتج 2",
            "created_at": "2025-08-02T21:04:16.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f8a6bf6-dc4a-452a-9540-4340e249f01e",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f8a6b3d-4902-40a7-862e-d4bf4e4ec7d6",
                    "product_id": "9f8a6b87-31fa-4dd0-a3a8-957e38648128",
                    "final_product_id": "9f8a6bf6-d0db-4803-bb63-4bdf6d45213a",
                    "created_at": "2025-08-02T21:04:16.000000Z",
                    "variant": {
                        "id": "9f4c5fa6-21b2-4398-803c-4c6a7cf464ce",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "color",
                        "name_ar": "اللون",
                        "created_at": "2025-07-03T00:48:30.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5fa6-2481-4017-940b-672b48f6533f",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5fa6-21b2-4398-803c-4c6a7cf464ce",
                        "value": "green",
                        "value_ar": "اخضر",
                        "created_at": "2025-07-03T00:48:30.000000Z"
                    }
                },
                {
                    "id": "9f8a6bf6-df6f-4650-a46d-f590b71deadc",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f8a6b3d-4902-40a7-862e-d4bf4e4ec7d6",
                    "product_id": "9f8a6b87-31fa-4dd0-a3a8-957e38648128",
                    "final_product_id": "9f8a6bf6-d0db-4803-bb63-4bdf6d45213a",
                    "created_at": "2025-08-02T21:04:16.000000Z",
                    "variant": {
                        "id": "9f4e4d08-6eff-4dce-9d82-000f9872b25b",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "colorrrrr",
                        "name_ar": "اللونننننن",
                        "created_at": "2025-07-03T23:48:06.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4e4d08-76bd-4a9d-b4ba-fc5adeb4b3b4",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4e4d08-6eff-4dce-9d82-000f9872b25b",
                        "value": "yellowwwww",
                        "value_ar": "اصفررررر",
                        "created_at": "2025-07-03T23:48:06.000000Z"
                    }
                }
            ],
            "main_image": {
                "id": "9f8a6c46-6c3d-402b-8bea-928d48bc483f",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "final_product_id": "9f8a6bf6-d0db-4803-bb63-4bdf6d45213a",
                "file": {
                    "id": "9f8a6c46-6601-4de3-b8ce-41465d474569",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/VseAUbcEm0__istockphoto-1442417585-612x612.jpg",
                    "original_name": "istockphoto-1442417585-612x612.jpg",
                    "new_name": "VseAUbcEm0__istockphoto-1442417585-612x612.jpg"
                }
            }
        },
        {
            "id": "9f844e79-4b8e-4069-b932-19b6073df69b",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
            "name": "product name192",
            "name_ar": "اسم المنتج عربي192",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 192,
            "price": 192,
            "details": "details",
            "details_ar": "التفاصيل",
            "created_at": "2025-07-30T20:06:50.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f844e79-5473-4c9b-b284-31727905ac24",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f844e79-4b8e-4069-b932-19b6073df69b",
                    "created_at": "2025-07-30T20:06:50.000000Z",
                    "variant": {
                        "id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "المقاس",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-2412-4fb2-9c33-ee1d6e84e194",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "value": "small",
                        "value_ar": "صغير",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                },
                {
                    "id": "9f844e79-5777-4b39-81fe-eb7614bf9ec2",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f844e79-4b8e-4069-b932-19b6073df69b",
                    "created_at": "2025-07-30T20:06:50.000000Z",
                    "variant": {
                        "id": "9f4c5a71-26e5-4c61-a4bc-ff59cbe30b90",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "color",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-29bb-4bac-aaba-c9c081c4f280",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-26e5-4c61-a4bc-ff59cbe30b90",
                        "value": "green",
                        "value_ar": "اخضر",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                }
            ],
            "main_image": null
        },
        {
            "id": "9f844cc5-7f3b-4c1a-893f-9e3ac69cfb18",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
            "name": "product name118",
            "name_ar": "اسم المنتج عربي118",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 118,
            "price": 118,
            "details": "product details",
            "details_ar": "تفاصي المنتج",
            "created_at": "2025-07-30T20:02:05.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f844cc6-5ed9-4077-b8c0-0c40254379a0",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f844cc5-7f3b-4c1a-893f-9e3ac69cfb18",
                    "created_at": "2025-07-30T20:02:05.000000Z",
                    "variant": {
                        "id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "المقاس",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-2412-4fb2-9c33-ee1d6e84e194",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "value": "small",
                        "value_ar": "صغير",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                },
                {
                    "id": "9f844cc6-6228-4529-939e-82d9d243ae90",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f844cc5-7f3b-4c1a-893f-9e3ac69cfb18",
                    "created_at": "2025-07-30T20:02:05.000000Z",
                    "variant": {
                        "id": "9f4c5a71-26e5-4c61-a4bc-ff59cbe30b90",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "color",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-29bb-4bac-aaba-c9c081c4f280",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-26e5-4c61-a4bc-ff59cbe30b90",
                        "value": "green",
                        "value_ar": "اخضر",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                }
            ],
            "main_image": null
        },
        {
            "id": "9f5e444e-75d6-43a3-a594-939709f86103",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
            "name": "product name144",
            "name_ar": "اسم المنتج عربي144",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 100,
            "price": 100,
            "details": "t shirt",
            "details_ar": "تيشيرت ",
            "created_at": "2025-07-11T22:16:57.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f5e4461-4d13-4735-87be-e407bb9e36fd",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f5e444e-75d6-43a3-a594-939709f86103",
                    "created_at": "2025-07-11T22:17:09.000000Z",
                    "variant": {
                        "id": "9f4c5d8d-f539-4712-bda3-252b5255fd2f",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "color",
                        "name_ar": "اللون",
                        "created_at": "2025-07-03T00:42:39.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5d8d-fa20-46a5-a741-8e57125166d0",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5d8d-f539-4712-bda3-252b5255fd2f",
                        "value": "green",
                        "value_ar": "اخضر",
                        "created_at": "2025-07-03T00:42:39.000000Z"
                    }
                }
            ],
            "main_image": {
                "id": "9f5e6996-2763-40af-960e-46917b5be268",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "final_product_id": "9f5e444e-75d6-43a3-a594-939709f86103",
                "file": {
                    "id": "9f5e6996-20d1-4053-8615-1b36a760ff66",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/rxX1hO9ELR__3aa3aa99693911.5efff38f3eb00.jpg",
                    "original_name": "3aa3aa99693911.5efff38f3eb00.jpg",
                    "new_name": "rxX1hO9ELR__3aa3aa99693911.5efff38f3eb00.jpg"
                }
            }
        },
        {
            "id": "9f5e43fd-8c52-480c-8c53-0070fdae5f1d",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
            "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
            "name": "product name180",
            "name_ar": "اسم المنتج عربي180",
            "has_discount": false,
            "related_discount": null,
            "discount_value": 0,
            "price_after_discount": 180,
            "price": 180,
            "details": "xxxxxxx xxxxxxxxxxx",
            "details_ar": "xxxxxx xxxxxxxxxxxxxxxx",
            "created_at": "2025-07-11T22:16:04.000000Z",
            "final_product_variant_values": [
                {
                    "id": "9f5e43fd-957d-4c73-bad3-e4f0f8d362d0",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f5e43fd-8c52-480c-8c53-0070fdae5f1d",
                    "created_at": "2025-07-11T22:16:04.000000Z",
                    "variant": {
                        "id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "المقاس",
                        "name_ar": null,
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4c5a71-2412-4fb2-9c33-ee1d6e84e194",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4c5a71-1f22-40c4-b3b4-c7c114cd07cb",
                        "value": "small",
                        "value_ar": "صغير",
                        "created_at": "2025-07-03T00:33:56.000000Z"
                    }
                },
                {
                    "id": "9f5e4420-b619-4d6e-b084-11e6f14aa36f",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "category_id": "9f4a2cbf-1319-4b91-99e5-f7c0fa758039",
                    "product_id": "9f4a5587-b30b-4063-92b8-1c337c8454f9",
                    "final_product_id": "9f5e43fd-8c52-480c-8c53-0070fdae5f1d",
                    "created_at": "2025-07-11T22:16:27.000000Z",
                    "variant": {
                        "id": "9f4e4d08-6eff-4dce-9d82-000f9872b25b",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "name": "colorrrrr",
                        "name_ar": "اللونننننن",
                        "created_at": "2025-07-03T23:48:06.000000Z"
                    },
                    "variant_value": {
                        "id": "9f4e4d08-76bd-4a9d-b4ba-fc5adeb4b3b4",
                        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                        "variant_id": "9f4e4d08-6eff-4dce-9d82-000f9872b25b",
                        "value": "yellowwwww",
                        "value_ar": "اصفررررر",
                        "created_at": "2025-07-03T23:48:06.000000Z"
                    }
                }
            ],
            "main_image": null
        }
    ],
    "links": {
        "first": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
        "last": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=2",
        "prev": null,
        "next": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 2,
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=2",
                "label": "2",
                "active": false
            },
            {
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=2",
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "https://www.ngcis.com/ERP/public/api/admin/company/product/company-final-products/search/9f440efe-2b3a-46bb-9319-090027c5a773",
        "per_page": 10,
        "to": 10,
        "total": 14
    }
}
_______________________________________________________________________
this is post Create final product
{{base_url}}/admin/company/product/final-product
this is its body

{
    "company_id": "{{company_id}}",
    "category_id": "{{category_id}}", //{{base_url}}/admin/company/categories/search/{{company_id}}
    "product_id": "{{product_id}}", //{{base_url}}/admin/company/products/search/{{company_id}}?query_string=&category_uuid={{category_id}}&paginate=false  depends on category
    "price": 100, // required
    "name": "name", // nullable
    "name_ar": "name ar", // nullable
    "details": "details for product222", // nullable
    "details_ar": "details for product222", // nullable
    "variants": [
        {
            "variant_id": "{{variant_id}}", // {{base_url}}/admin/company/variants/search/{{company_id}}
            "variant_value_id": "{{variant_value_id}}" // {{base_url}}/admin/company/variant-values/search/{{variant_id}}  depends on variant
        }
    ]
}

this is its response

{
    "status_code": 200,
    "message": "company.company_product_created_successfully",
    "data": {
        "id": "a07051c4-f6c0-4072-ba0d-459f5eb66fa9",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "name",
        "name_ar": "name ar",
        "has_discount": false,
        "related_discount": null,
        "discount_value": 0,
        "price_after_discount": 100,
        "price": 100,
        "details": "details for product222",
        "details_ar": "details for product222",
        "created_at": "2025-11-25T03:51:26.000000Z",
        "category": {
            "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "rererere",
            "name_ar": "ssssss",
            "created_at": "2025-11-24T07:51:12.000000Z",
            "file": {
                "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                "original_name": "Mail.JPG",
                "new_name": "c0agqp3MoG__Mail.JPG"
            }
        },
        "product": {
            "id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "category": {
                "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "rererere",
                "name_ar": "ssssss",
                "created_at": "2025-11-24T07:51:12.000000Z",
                "file": {
                    "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                    "original_name": "Mail.JPG",
                    "new_name": "c0agqp3MoG__Mail.JPG"
                }
            },
            "name": "product name",
            "name_ar": "product name",
            "details": "details",
            "details_ar": "details",
            "purchases_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "sales_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "created_at": "2025-11-25T01:11:29.000000Z"
        },
        "final_product_variant_values": [
            {
                "id": "a07051c4-f770-4e9e-92ef-2071f870eb2b",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
                "final_product_id": "a07051c4-f6c0-4072-ba0d-459f5eb66fa9",
                "created_at": "2025-11-25T03:51:26.000000Z",
                "variant": {
                    "id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "name": "updated variant name",
                    "name_ar": "updated variant name",
                    "created_at": "2025-11-24T23:00:12.000000Z"
                },
                "variant_value": {
                    "id": "a06ff3c7-700d-432c-8550-4a6ae856de15",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "variant_id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "value": "larg",
                    "value_ar": "larg",
                    "created_at": "2025-11-24T23:28:37.000000Z"
                }
            }
        ],
        "main_image": null,
        "final_product_images": []
    }
}

______________________________________________________________________

this is patch Update Final Product
{{base_url}}/admin/company/product/final-product/{{final_product_id}}

this is its body

{
    "price": 100, // nullable
    "name": "name", // nullable
    "name_ar": "name ar", // nullable
    "details": "details for product222", // nullable
    "details_ar": "details for product222" // nullable
}

this is its response

{
    "status_code": 200,
    "message": "company.company_product_updated_successfully",
    "data": {
        "id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "name",
        "name_ar": "name ar",
        "has_discount": false,
        "related_discount": null,
        "discount_value": 0,
        "price_after_discount": 100,
        "price": 100,
        "details": "details for product222",
        "details_ar": "details for product222",
        "created_at": "2025-11-25T03:11:01.000000Z",
        "category": {
            "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "rererere",
            "name_ar": "ssssss",
            "created_at": "2025-11-24T07:51:12.000000Z",
            "file": {
                "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                "original_name": "Mail.JPG",
                "new_name": "c0agqp3MoG__Mail.JPG"
            }
        },
        "product": {
            "id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "category": {
                "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "rererere",
                "name_ar": "ssssss",
                "created_at": "2025-11-24T07:51:12.000000Z",
                "file": {
                    "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                    "original_name": "Mail.JPG",
                    "new_name": "c0agqp3MoG__Mail.JPG"
                }
            },
            "name": "product name",
            "name_ar": "product name",
            "details": "details",
            "details_ar": "details",
            "purchases_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "sales_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "created_at": "2025-11-25T01:11:29.000000Z"
        },
        "final_product_variant_values": [
            {
                "id": "a0704350-967b-4408-8c95-4bb03959c09e",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
                "final_product_id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
                "created_at": "2025-11-25T03:11:01.000000Z",
                "variant": {
                    "id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "name": "updated variant name",
                    "name_ar": "updated variant name",
                    "created_at": "2025-11-24T23:00:12.000000Z"
                },
                "variant_value": {
                    "id": "a06ff3c7-700d-432c-8550-4a6ae856de15",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "variant_id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "value": "larg",
                    "value_ar": "larg",
                    "created_at": "2025-11-24T23:28:37.000000Z"
                }
            }
        ],
        "main_image": null,
        "final_product_images": []
    }
}
_______________________________________________________________________________

this is DELETE
delete final product 
{{base_url}}/admin/company/product/final-product/9aab8489-101e-4991-b6ae-ab8c60517b34
_______________________________________________________

this is Show One Item One Final Product 

{{base_url}}/admin/company/product/final-product/{{final_product_id}}

this is its response

{
    "status_code": 200,
    "message": "company.company_product_retrieved_successfully",
    "data": {
        "id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "name",
        "name_ar": "name ar",
        "has_discount": false,
        "related_discount": null,
        "discount_value": 0,
        "price_after_discount": 100,
        "price": 100,
        "details": "details for product222",
        "details_ar": "details for product222",
        "created_at": "2025-11-25T03:11:01.000000Z",
        "category": {
            "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "rererere",
            "name_ar": "ssssss",
            "created_at": "2025-11-24T07:51:12.000000Z",
            "file": {
                "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                "original_name": "Mail.JPG",
                "new_name": "c0agqp3MoG__Mail.JPG"
            }
        },
        "product": {
            "id": "a0701891-c642-414f-b19a-c67c9c949ba9",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
            "category": {
                "id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "rererere",
                "name_ar": "ssssss",
                "created_at": "2025-11-24T07:51:12.000000Z",
                "file": {
                    "id": "a06ea533-8a76-4b06-9a2e-4de5b8089641",
                    "file_path": "https://www.ngcis.com/ERP/public/uploads/c0agqp3MoG__Mail.JPG",
                    "original_name": "Mail.JPG",
                    "new_name": "c0agqp3MoG__Mail.JPG"
                }
            },
            "name": "product name",
            "name_ar": "product name",
            "details": "details",
            "details_ar": "details",
            "purchases_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "sales_measurement_unit": {
                "id": "a06e7c29-36b4-4046-8f90-4b0b57821ecf",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "measurement unit name",
                "created_at": "2025-11-24T05:58:19.000000Z"
            },
            "created_at": "2025-11-25T01:11:29.000000Z"
        },
        "final_product_variant_values": [
            {
                "id": "a0704350-967b-4408-8c95-4bb03959c09e",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "category_id": "a06ea488-2d30-4ba9-a987-4485ee0c0154",
                "product_id": "a0701891-c642-414f-b19a-c67c9c949ba9",
                "final_product_id": "a0704350-95ca-46ca-911b-66c33bdd6abc",
                "created_at": "2025-11-25T03:11:01.000000Z",
                "variant": {
                    "id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "name": "updated variant name",
                    "name_ar": "updated variant name",
                    "created_at": "2025-11-24T23:00:12.000000Z"
                },
                "variant_value": {
                    "id": "a06ff3c7-700d-432c-8550-4a6ae856de15",
                    "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                    "variant_id": "a06fe99d-2819-497b-aac9-6df1767699af",
                    "value": "larg",
                    "value_ar": "larg",
                    "created_at": "2025-11-24T23:28:37.000000Z"
                }
            }
        ],
        "main_image": null,
        "final_product_images": []
    }
}



now go ahead you have full structure

next step we will controle its images and iste variants

now you have full structure go now