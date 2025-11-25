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