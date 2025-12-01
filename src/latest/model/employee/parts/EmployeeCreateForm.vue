<template>
  <div class="employee-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("employees.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('employees.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Email -->
        <div class="col-12 md:col-6 field">
          <label for="email" class="font-bold block mb-2">
            {{ $t("employees.email") }} *
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            type="email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            :placeholder="$t('employees.emailPlaceholder')"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="grid">
        <!-- Phone -->
        <div class="col-12 md:col-6 field">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("employees.phone") }} *
          </label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
            :placeholder="$t('employees.phonePlaceholder')"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <!-- Password -->
        <div class="col-12 md:col-6 field">
          <label for="password" class="font-bold block mb-2">
            {{ $t("employees.password") }} *
          </label>
          <Password
            id="password"
            v-model="formData.password"
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
            :placeholder="$t('employees.passwordPlaceholder')"
            :feedback="false"
            toggleMask
          />
          <small v-if="errors.password" class="p-error">{{
            errors.password
          }}</small>
        </div>
      </div>

      <!-- Address -->
      <div class="field">
        <label for="address" class="font-bold block mb-2">
          {{ $t("employees.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="2"
          class="w-full"
          :placeholder="$t('employees.addressPlaceholder')"
        />
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
          :label="loading ? $t('common.creating') : $t('common.create')"
          :loading="loading"
          class="p-button-primary"
          :disabled="loading"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "EmployeeCreateForm",
  components: {
    InputText,
    Textarea,
    Password,
    Button,
    Message,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
    branch_id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
      },
      errors: {},
    };
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route?.params?.company_id;
    },
    effectiveBranchId() {
      return this.branch_id || this.$route?.params?.branch_id;
    },
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("employees.nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("employees.emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("employees.emailInvalid");
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = this.$t("employees.phoneRequired");
      }

      if (!this.formData.password?.trim()) {
        this.errors.password = this.$t("employees.passwordRequired");
      } else if (this.formData.password.length < 8) {
        this.errors.password = this.$t("employees.passwordMinLength");
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    async submitForm() {
      console.log("Submit form triggered");

      if (!this.validateForm()) {
        console.log("Form validation failed");
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const payload = {
          company_id: this.effectiveCompanyId,
          branch_id: this.effectiveBranchId,
          name: this.formData.name.trim(),
          email: this.formData.email.trim(),
          phone: this.formData.phone.trim(),
          password: this.formData.password,
          address: this.formData.address?.trim() || "",
        };

        console.log("Sending CREATE request with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company-employee`;
        console.log("API URL:", url);

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ CREATE Response:", response.data);

        // TRANSFORM CREATE RESPONSE TO MATCH TABLE FORMAT
        const transformedEmployee = this.transformCreateResponse(
          response.data.data
        );
        console.log("🔄 Transformed for table:", transformedEmployee);

        // Reset form
        this.formData = {
          name: "",
          email: "",
          phone: "",
          password: "",
          address: "",
        };

        // Emit the transformed employee
        this.$emit("employee-created", transformedEmployee);

        // Show success message
        this.showToast(
          "success",
          this.$t("employees.success"),
          this.$t("employees.employeeCreated")
        );
      } catch (error) {
        console.error("❌ Error creating employee:", error);

        if (error.response) {
          console.error("Response error:", error.response.data);
          this.error =
            error.response.data.message || this.$t("employees.createError");

          if (error.response.status === 422 && error.response.data.errors) {
            this.errors = this.formatValidationErrors(
              error.response.data.errors
            );
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
          this.error = this.$t("employees.networkError");
        } else {
          console.error("Error:", error.message);
          this.error = error.message || this.$t("employees.createError");
        }
      } finally {
        this.loading = false;
      }
    },

    // TRANSFORM CREATE RESPONSE TO MATCH GET/TABLE FORMAT
    transformCreateResponse(employeeData) {
      return {
        id: employeeData.id,
        company_id: employeeData.company?.id || this.effectiveCompanyId,
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        avatar: employeeData.avatar || null,
        account_type: employeeData.account_type,
        created_at: employeeData.created_at,
      };
    },

    formatValidationErrors(errorsObject) {
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
      } else {
        console.log(`Toast: ${severity} - ${summary}: ${detail}`);
      }
    },
  },
};
</script>

<style scoped>
.employee-create-form {
  max-width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
