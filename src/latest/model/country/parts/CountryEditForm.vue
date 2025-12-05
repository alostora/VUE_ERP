<template>
  <div class="country-edit-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("countries.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Name Arabic Field -->
      <div class="field mb-3">
        <label for="name_ar" class="font-bold block mb-2">
          {{ $t("countries.name_ar") }} *
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

      <!-- Phone Code Field -->
      <div class="field mb-3">
        <label for="phone_code" class="font-bold block mb-2">
          {{ $t("countries.phone_code") }} *
        </label>
        <InputText
          id="phone_code"
          v-model="formData.phone_code"
          :class="{ 'p-invalid': errors.phone_code }"
          class="w-full"
        />
        <small v-if="errors.phone_code" class="p-error">{{
          errors.phone_code
        }}</small>
      </div>

      <!-- Prefix Field -->
      <div class="field mb-3">
        <label for="prefix" class="font-bold block mb-2">
          {{ $t("countries.prefix") }}
        </label>
        <InputText
          id="prefix"
          v-model="formData.prefix"
          :class="{ 'p-invalid': errors.prefix }"
          class="w-full"
        />
        <small v-if="errors.prefix" class="p-error">{{ errors.prefix }}</small>
      </div>

      <!-- Flag Field -->
      <div class="field mb-4">
        <label for="flag" class="font-bold block mb-2">
          {{ $t("countries.flag") }}
        </label>
        <InputText id="flag" v-model="formData.flag" class="w-full" />
        <small class="p-text-secondary">{{ $t("countries.flagHelp") }}</small>
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
// Import utilities
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CountryEditForm",
  components: {
    InputText,
    Button,
    Message,
  },
  props: {
    country: {
      type: Object,
      default: () => ({}),
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
        phone_code: "",
        prefix: "",
        flag: "",
      },
      errors: {},
    };
  },
  computed: {
    submitButtonText() {
      return this.formData.id
        ? this.$t("common.update")
        : this.$t("common.create");
    },
    isEditMode() {
      return !!this.formData.id;
    },
  },
  watch: {
    country: {
      immediate: true,
      deep: true,
      handler(newCountry) {
        if (newCountry && newCountry.id) {
          this.populateForm(newCountry);
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    populateForm(country) {
      this.formData = {
        id: country.id || "",
        name: country.name || "",
        name_ar: country.name_ar || "",
        phone_code: country.phone_code || "",
        prefix: country.prefix || "",
        flag: country.flag || "",
      };
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        phone_code: "",
        prefix: "",
        flag: "",
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
        this.errors.name_ar = this.$t("validation.name_arRequired");
      }

      if (!this.formData.phone_code?.trim()) {
        this.errors.phone_code = this.$t("validation.phone_codeRequired");
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
        const url = this.isEditMode
          ? `${general_request.BASE_URL}/admin/country/${this.formData.id}`
          : `${general_request.BASE_URL}/admin/country`;

        const method = this.isEditMode ? "patch" : "post";

        const response = await this.$http[method](url, this.formData, {
          headers: general_request.headers,
        });

        this.$emit("country-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("countries.success"),
          this.$t("countries.countryUpdated")
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

        if (responseData.status_code === 422 && responseData.errors) {
          this.errors = this.formatFieldErrors(responseData.errors);
          const firstError = Object.values(this.errors)[0];
          if (firstError) {
            this.error = firstError;
          }
        } else if (responseData.message) {
          this.error = responseData.message;
        } else {
          this.error = this.$t("countries.updateError");
        }
      } else {
        this.error = this.$t("countries.networkError");
      }
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
.country-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>
