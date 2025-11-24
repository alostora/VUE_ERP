<template>
  <div class="user-create-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("users.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('users.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="field mb-3">
        <label for="email" class="font-bold block mb-2">
          {{ $t("users.email") }} *
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
          :placeholder="$t('users.emailPlaceholder')"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("users.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
          :placeholder="$t('users.phonePlaceholder')"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Account Type Select -->
      <div class="field mb-3">
        <label for="accountType" class="font-bold block mb-2">
          {{ $t("users.accountType") }} *
        </label>
        <Select
          id="accountType"
          v-model="selectedAccountType"
          :options="accountTypes"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.user_account_type_id }"
          :placeholder="
            loadingAccountTypes
              ? $t('users.loadingAccountTypes')
              : $t('users.selectAccountType')
          "
          class="w-full"
          :loading="loadingAccountTypes"
          :disabled="loadingAccountTypes"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }} *
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="true"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
          toggleMask
          :inputStyle="{ width: '100%' }"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- Password Confirmation Field -->
      <div class="field mb-3">
        <label for="password_confirmation" class="font-bold block mb-2">
          {{ $t("users.confirmPassword") }} *
        </label>
        <Password
          id="password_confirmation"
          v-model="formData.password_confirmation"
          :feedback="false"
          :class="{ 'p-invalid': errors.password_confirmation }"
          class="w-full"
          :placeholder="$t('users.confirmPasswordPlaceholder')"
          toggleMask
        />
        <small v-if="errors.password_confirmation" class="p-error">
          {{ errors.password_confirmation }}
        </small>
      </div>

      <!-- Address Field -->
      <div class="field mb-4">
        <label for="address" class="font-bold block mb-2">
          {{ $t("users.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('users.addressPlaceholder')"
        />
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
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserCreateForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  data() {
    return {
      loading: false,
      loadingAccountTypes: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      },
      errors: {},
    };
  },
  watch: {
    selectedAccountType: {
      handler(newValue) {
        this.formData.user_account_type_id = newValue;
      },
    },
  },
  mounted() {
    this.loadAccountTypes();
  },
  methods: {
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
      this.loadingAccountTypes = true;
      try {
        const response = await this.$http.get(
          general_request.BASE_URL + "/system-lookups/1",
          {
            params: { per_page: 100 },
            headers: general_request.headers,
          }
        );
        this.accountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading account types:", error);
        this.error = this.$t("users.loadAccountTypesError");
      } finally {
        this.loadingAccountTypes = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t("accountTypeRequired");
      }

      if (!this.formData.password) {
        this.errors.password = this.$t("passwordRequired");
      } else if (this.formData.password.length < 6) {
        this.errors.password = this.$t("passwordMinLength");
      }

      if (!this.formData.password_confirmation) {
        this.errors.password_confirmation = this.$t("confirmPasswordRequired");
      } else if (
        this.formData.password !== this.formData.password_confirmation
      ) {
        this.errors.password_confirmation = this.$t("passwordsDoNotMatch");
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
        const url = `${general_request.BASE_URL}/admin/user`;

        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
          password: this.formData.password,
          password_confirmation: this.formData.password_confirmation,
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("user-created", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userCreated")
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
      this.error = responseData.message || this.$t("users.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("users.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("user account type id")) {
          this.errors.user_account_type_id = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        } else if (message.includes("password")) {
          this.errors.password = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
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
.user-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-select) {
  width: 100%;
}
</style>
