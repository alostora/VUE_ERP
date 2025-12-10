<template>
  <div class="branch-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("branches.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('branches.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("branches.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('branches.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>
      </div>

      <!-- Phone -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("branches.phone") }} *
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
          :placeholder="$t('branches.phonePlaceholder')"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Address -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="address" class="font-bold block mb-2">
            {{ $t("branches.address") }} *
          </label>
          <Textarea
            id="address"
            v-model="formData.address"
            rows="3"
            :class="{ 'p-invalid': errors.address }"
            class="w-full"
            :placeholder="$t('branches.addressPlaceholder')"
          />
          <small v-if="errors.address" class="p-error">{{
            errors.address
          }}</small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="address_ar" class="font-bold block mb-2">
            {{ $t("branches.address_ar") }} *
          </label>
          <Textarea
            id="address_ar"
            v-model="formData.address_ar"
            rows="3"
            :class="{ 'p-invalid': errors.address_ar }"
            class="w-full"
            :placeholder="$t('branches.addressArPlaceholder')"
          />
          <small v-if="errors.address_ar" class="p-error">{{
            errors.address_ar
          }}</small>
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
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "BranchEditForm",
  components: {
    InputText,
    Textarea,
    Button,
    Message,
  },
  props: {
    branch: {
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
  },
  data() {
    return {
      loading: false,
      error: "",
      formData: {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        address: "",
        address_ar: "",
      },
      errors: {},
    };
  },
  watch: {
    branch: {
      immediate: true,
      deep: true,
      handler(newBranch) {
        if (newBranch && newBranch.id) {
          this.populateForm(newBranch);
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    populateForm(branch) {
      this.formData = {
        id: branch.id || "",
        name: branch.name || "",
        name_ar: branch.name_ar || "",
        phone: branch.phone || "",
        address: branch.address || "",
        address_ar: branch.address_ar || "",
      };
    },
    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        address: "",
        address_ar: "",
      };
      this.errors = {};
      this.error = "";
    },
    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("branches.nameRequired");
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = this.$t("branches.nameArRequired");
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = this.$t("branches.phoneRequired");
      }

      if (!this.formData.address?.trim()) {
        this.errors.address = this.$t("branches.addressRequired");
      }

      if (!this.formData.address_ar?.trim()) {
        this.errors.address_ar = this.$t("branches.addressRequired");
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
        const payload = {
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          phone: this.formData.phone,
          address: this.formData.address,
          address_ar: this.formData.address_ar,
        };

        const url = `${general_request.BASE_URL}/admin/company/branch/${this.formData.id}`;
        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        this.$emit("branch-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("branches.success"),
          this.$t("branches.branchUpdated")
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
      this.error = responseData.message || this.$t("branches.updateError");
    },
    handleNetworkError(error) {
      this.error = error.message || this.$t("branches.networkError");
    },
    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("phone")) {
          this.errors.phone = message;
        } else if (message.includes("address")) {
          this.errors.address = message;
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
.branch-edit-form {
  max-width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
