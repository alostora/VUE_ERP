<template>
  <div class="governorate-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Country Selection (Required) -->
      <div class="field mb-3">
        <label for="country" class="font-bold block mb-2">
          {{ $t("governorates.country") }} *
        </label>
        <Select
          id="country"
          v-model="selectedCountry"
          :options="countries"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.country_id }"
          :placeholder="
            loadingCountries
              ? $t('governorates.loadingCountries')
              : $t('governorates.selectCountry')
          "
          class="w-full"
          :loading="loadingCountries"
          :disabled="loadingCountries"
          :showClear="false"
        />
        <small v-if="errors.country_id" class="p-error">
          {{ errors.country_id }}
        </small>
      </div>

      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("governorates.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('governorates.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Arabic Name Field -->
      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("governorates.name_ar") }} *
        </label>
        <InputText
          id="name_ar"
          v-model="formData.name_ar"
          :class="{ 'p-invalid': errors.name_ar }"
          class="w-full"
          :placeholder="$t('governorates.nameArPlaceholder')"
        />
        <small v-if="errors.name_ar" class="p-error">{{
          errors.name_ar
        }}</small>
      </div>

      <!-- Prefix Field -->
      <div class="field mb-4">
        <label for="prefix" class="font-bold block mb-2">
          {{ $t("governorates.prefix") }}
        </label>
        <InputText
          id="prefix"
          v-model="formData.prefix"
          :class="{ 'p-invalid': errors.prefix }"
          class="w-full"
          :placeholder="$t('governorates.prefixPlaceholder')"
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
  name: "GovernorateCreateForm",
  components: {
    InputText,
    Select,
    Button,
    Message,
  },
  props: {
    // Remove countryId prop since we'll always select from dropdown
  },
  data() {
    return {
      loading: false,
      loadingCountries: false,
      error: "",
      countries: [],
      selectedCountry: null,
      formData: {
        country_id: "",
        name: "",
        name_ar: "",
        prefix: "",
      },
      errors: {},
    };
  },
  watch: {
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
      },
    },
  },
  mounted() {
    this.loadCountries();
  },
  methods: {
    resetForm() {
      this.formData = {
        country_id: "",
        name: "",
        name_ar: "",
        prefix: "",
      };
      this.selectedCountry = null;
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
        this.error = this.$t("governorates.loadCountriesError");
      } finally {
        this.loadingCountries = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.country_id) {
        this.errors.country_id = this.$t("validation.countryRequired");
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
        const url = `${general_request.BASE_URL}/admin/governorate`;

        const response = await this.$http.post(url, this.formData, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("governorate-created", response.data.data);

        this.showToast(
          "success",
          this.$t("governorates.success"),
          this.$t("governorates.governorateCreated")
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
      this.error = responseData.message || this.$t("governorates.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("governorates.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("country") || message.includes("country_id")) {
          this.errors.country_id = message;
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
.governorate-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>
