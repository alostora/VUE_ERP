<template>
  <div class="user-edit-form">
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
          :placeholder="$t('users.selectAccountType')"
          class="w-full"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field (optional for edit) -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }}
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="false"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
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
import Select from "primevue/select";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserEditForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
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
    user: {
      immediate: true,
      deep: true,
      handler(newUser) {
        if (newUser && newUser.id) {
          this.populateForm(newUser);
        } else {
          this.resetForm();
        }
      },
    },
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
    populateForm(user) {
      this.formData = {
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Never pre-fill password
        address: user.address || "",
        user_account_type_id: user.account_type?.id || "",
      };

      // Set the selected account type ID directly
      this.selectedAccountType = user.account_type?.id || null;
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
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
        this.error = this.$t("users.loadAccountTypesError");
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("validation.emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("validation.emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t(
          "validation.accountTypeRequired"
        );
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
        const url = this.isEditMode
          ? `${general_request.BASE_URL}/admin/user/${this.formData.id}`
          : `${general_request.BASE_URL}/admin/user`;

        const method = this.isEditMode ? "patch" : "post";

        // Prepare payload - only include password if provided
        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
        };

        // Only include password if provided (for updates)
        if (this.formData.password) {
          payload.password = this.formData.password;
        }

        const response = await this.$http[method](url, payload, {
          headers: general_request.headers,
        });

        this.$emit("user-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      // Clear previous errors
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        // Handle different error response formats
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
      // Handle 400 Bad Request errors
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");

          // Map common error messages to specific fields
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      // Fallback to main message
      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      // Handle 422 Validation errors (Laravel standard)
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);

        // Also show the first error as a general message
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      if (responseData.message) {
        this.error = responseData.message;
      } else {
        this.error = this.$t("users.updateError");
      }
    },

    handleNetworkError(error) {
      if (error.message) {
        this.error = error.message;
      } else {
        this.error = this.$t("users.networkError");
      }
    },

    mapCommonErrorsToFields(errorMessages) {
      // Map common error messages to specific form fields
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
        // Add more mappings as needed
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};

      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];

        if (Array.isArray(fieldErrors)) {
          // Take the first error message for each field
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
.user-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
