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
