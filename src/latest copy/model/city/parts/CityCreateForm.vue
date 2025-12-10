<template>
  <div class="city-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Country Selection -->
      <div class="field mb-3">
        <label for="country" class="font-bold block mb-2">
          {{ $t("cities.country") }} *
        </label>
        <Select
          id="country"
          v-model="selectedCountry"
          :options="countries"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.country_id }"
          :placeholder="loadingCountries ? $t('cities.loadingCountries') : $t('cities.selectCountry')"
          class="w-full"
          :loading="loadingCountries"
          :disabled="loadingCountries"
          :showClear="false"
          @change="onCountryChange"
        />
        <small v-if="errors.country_id" class="p-error">
          {{ errors.country_id }}
        </small>
      </div>

      <!-- Governorate Selection -->
      <div class="field mb-3">
        <label for="governorate" class="font-bold block mb-2">
          {{ $t("cities.governorate") }} *
        </label>
        <Select
          id="governorate"
          v-model="selectedGovernorate"
          :options="filteredGovernorates"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.governorate_id }"
          :placeholder="loadingGovernorates ? $t('cities.loadingGovernorates') : $t('cities.selectGovernorate')"
          class="w-full"
          :loading="loadingGovernorates"
          :disabled="loadingGovernorates || !selectedCountry"
          :showClear="false"
        />
        <small v-if="errors.governorate_id" class="p-error">
          {{ errors.governorate_id }}
        </small>
      </div>

      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("cities.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('cities.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Arabic Name Field -->
      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("cities.name_ar") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="formData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
          :placeholder="$t('cities.nameArPlaceholder')"
        />
        <small v-if="errors.name_ar" class="p-error">{{ errors.name_ar }}</small>
      </div>

      <!-- Prefix Field -->
      <div class="field mb-4">
        <label for="prefix" class="font-bold block mb-2">
          {{ $t("cities.prefix") }}
        </label>
        <InputText
          id="prefix"
          v-model="formData.prefix"
          :class="{ 'p-invalid': errors.prefix }"
          class="w-full"
          :placeholder="$t('cities.prefixPlaceholder')"
        />
        <small v-if="errors.prefix" class="p-error">{{ errors.prefix }}</small>
      </div>

      <!-- Action Buttons -->
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
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CityCreateForm",
  components: {
    InputText,
    Select,
    Button,
    Message,
  },
  props: {
    countryId: {
      type: String,
      default: null
    },
    governorateId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      loadingCountries: false,
      loadingGovernorates: false,
      error: "",
      countries: [],
      governorates: [],
      selectedCountry: null,
      selectedGovernorate: null,
      formData: {
        country_id: "",
        governorate_id: "",
        name: "",
        name_ar: "",
        prefix: "",
      },
      errors: {},
    };
  },
  computed: {
    filteredGovernorates() {
      if (!this.selectedCountry) return [];
      return this.governorates.filter(g => g.country_id === this.selectedCountry);
    }
  },
  watch: {
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
        this.selectedGovernorate = null; // Reset governorate when country changes
        this.formData.governorate_id = "";
      },
    },
    selectedGovernorate: {
      handler(newValue) {
        this.formData.governorate_id = newValue;
      },
    },
  },
  mounted() {
    this.loadCountries();
    this.loadGovernorates();
    
    // Pre-select if props provided
    if (this.countryId) {
      this.selectedCountry = this.countryId;
      this.formData.country_id = this.countryId;
    }
    if (this.governorateId) {
      this.selectedGovernorate = this.governorateId;
      this.formData.governorate_id = this.governorateId;
    }
  },
  methods: {
    onCountryChange() {
      this.selectedGovernorate = null;
      this.formData.governorate_id = "";
    },

    resetForm() {
      this.formData = {
        country_id: this.countryId || "",
        governorate_id: this.governorateId || "",
        name: "",
        name_ar: "",
        prefix: "",
      };
      this.selectedCountry = this.countryId || null;
      this.selectedGovernorate = this.governorateId || null;
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
        this.error = this.$t("cities.loadCountriesError");
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
        this.error = this.$t("cities.loadGovernoratesError");
      } finally {
        this.loadingGovernorates = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.country_id) {
        this.errors.country_id = this.$t("validation.countryRequired");
      }

      if (!this.formData.governorate_id) {
        this.errors.governorate_id = this.$t("validation.governorateRequired");
      }

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
        const url = `${general_request.BASE_URL}/admin/city`;

        const response = await this.$http.post(url, this.formData, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("city-created", response.data.data);

        this.showToast(
          "success",
          this.$t("cities.success"),
          this.$t("cities.cityCreated")
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
        } else if (responseData.errors.errors && Array.isArray(responseData.errors.errors)) {
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
      this.error = responseData.message || this.$t("cities.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("cities.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("country") || message.includes("country_id")) {
          this.errors.country_id = message;
        } else if (message.includes("governorate") || message.includes("governorate_id")) {
          this.errors.governorate_id = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("prefix")) {
          this.errors.prefix = message;
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
.city-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>