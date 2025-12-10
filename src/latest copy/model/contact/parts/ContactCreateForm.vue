<template>
  <div class="contact-create-form">
    <Message v-if="error" severity="error" class="mb-3">{{ error }}</Message>

    <form @submit.prevent="submitForm">
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2"
            >{{ $t("contacts.name") }} *</label
          >
          <InputText
            v-model="form.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('contacts.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">{{ $t("contacts.email") }}</label>
          <InputText
            v-model="form.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            :placeholder="$t('contacts.emailPlaceholder')"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">{{ $t("contacts.phone") }}</label>
          <InputText
            v-model="form.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
            :placeholder="$t('contacts.phonePlaceholder')"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">{{
            $t("contacts.address")
          }}</label>
          <InputText
            v-model="form.address"
            :class="{ 'p-invalid': errors.address }"
            class="w-full"
            :placeholder="$t('contacts.addressPlaceholder')"
          />
          <small v-if="errors.address" class="p-error">{{
            errors.address
          }}</small>
        </div>
      </div>

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
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "ContactCreateForm",
  components: { InputText, Button, Message },
  props: { company_id: { type: String, required: true } },
  data() {
    return {
      loading: false,
      error: "",
      form: { name: "", email: "", phone: "", address: "" },
      errors: {},
    };
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.name?.trim())
        this.errors.name = this.$t("contacts.nameRequired");
      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      if (!this.validate()) return;
      this.loading = true;
      this.error = "";
      try {
        const payload = { company_id: this.company_id, ...this.form };
        const url = `${general_request.BASE_URL}/admin/company/contact`;
        const res = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });
        this.$emit("contact-created", res.data.data);
        this.resetForm();
        if (this.$toast)
          this.$toast.add({
            severity: "success",
            summary: this.$t("common.success"),
            detail: this.$t("contacts.contactCreated"),
            life: 3000,
          });
      } catch (err) {
        this.error =
          err.response?.data?.message || this.$t("contacts.createError");
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = { name: "", email: "", phone: "", address: "" };
      this.errors = {};
      this.error = "";
    },
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>
