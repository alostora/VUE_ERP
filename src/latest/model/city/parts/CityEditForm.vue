<template>
  <div class="city-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Country (Read-only in edit mode) -->
      <div class="field mb-3">
        <label class="font-bold block mb-2">
          {{ $t("cities.country") }}
        </label>
        <div
          class="p-inputtext p-component w-full"
          style="background: #f8f9fa; color: #6c757d"
        >
          {{ countryName }}
        </div>
        <small class="p-text-secondary">
          {{ $t("cities.countryCannotBeChanged") }}
        </small>
      </div>

      <!-- Governorate (Read-only in edit mode) -->
      <div class="field mb-3">
        <label class="font-bold block mb-2">
          {{ $t("cities.governorate") }}
        </label>
        <div
          class="p-inputtext p-component w-full"
          style="background: #f8f9fa; color: #6c757d"
        >
          {{ governorateName }}
        </div>
        <small class="p-text-secondary">
          {{ $t("cities.governorateCannotBeChanged") }}
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
        <small v-if="errors.name_ar" class="p-error">{{
          errors.name_ar
        }}</small>
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
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CityEditForm",
  components: {
    InputText,
    Button,
    Message,
  },
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
    countryId: {
      type: String,
      default: null,
    },
    governorateId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      countryName: "",
      governorateName: "",
      formData: {
        id: "",
        country_id: "",
        governorate_id: "",
        name: "",
        name_ar: "",
        prefix: "",
      },
      errors: {},
    };
  },
  watch: {
    city: {
      immediate: true,
      deep: true,
      handler(newCity) {
        if (newCity && newCity.id) {
          this.populateForm(newCity);
        } else {
          this.resetForm();
        }
      },
    },
  },
  mounted() {
    if (this.countryId) {
      this.loadCountryName(this.countryId);
    }
    if (this.governorateId) {
      this.loadGovernorateName(this.governorateId);
    }
  },
  methods: {
    populateForm(city) {
      console.log("🔍 Populating form with city data:", city);

      this.resetForm();

      this.formData.id = city.id || "";
      this.formData.country_id = city.country_id || this.countryId;
      this.formData.governorate_id = city.governorate_id || this.governorateId;
      this.formData.name = city.name || "";
      this.formData.name_ar = city.name_ar || "";
      this.formData.prefix = city.prefix || "";

      if (this.formData.country_id) {
        this.loadCountryName(this.formData.country_id);
      }
      if (this.formData.governorate_id) {
        this.loadGovernorateName(this.formData.governorate_id);
      }

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        country_id: this.countryId || "",
        governorate_id: this.governorateId || "",
        name: "",
        name_ar: "",
        prefix: "",
      };
      this.countryName = "";
      this.governorateName = "";
      this.errors = {};
      this.error = "";
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
        console.error("Error loading country name:", error);
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
        console.error("Error loading governorate name:", error);
        this.governorateName = "Unknown Governorate";
      }
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
        const url = `${general_request.BASE_URL}/admin/city/${this.formData.id}`;

        const payload = {
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          prefix: this.formData.prefix,
          country_id: this.formData.country_id,
          governorate_id: this.formData.governorate_id,
        };

        console.log("🚀 Submitting form with payload:", payload);

        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ City updated successfully:", response.data);
        this.$emit("city-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("cities.success"),
          this.$t("cities.cityUpdated")
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
        console.log("❌ API Error Response:", responseData);

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
      this.error = responseData.message || this.$t("cities.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("cities.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
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
.city-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>
