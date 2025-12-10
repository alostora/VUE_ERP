<template>
  <div class="contact-edit-form">
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
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">{{ $t("contacts.email") }}</label>
          <InputText
            v-model="form.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
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
  name: "ContactEditForm",
  components: { InputText, Button, Message },
  props: {
    contact: { type: Object, default: () => ({}) },
    company_id: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      error: "",
      form: { id: "", name: "", email: "", phone: "", address: "" },
      errors: {},
    };
  },
  watch: {
    contact: {
      immediate: true,
      handler(c) {
        this.form = {
          id: c.id || "",
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          address: c.address || "",
        };
      },
    },
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
        const url = `${general_request.BASE_URL}/admin/company/contact/${this.form.id}`;
        const res = await this.$http.patch(
          url,
          {
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            address: this.form.address,
          },
          { headers: general_request.headers }
        );
        this.$emit("contact-updated", res.data.data);
        if (this.$toast)
          this.$toast.add({
            severity: "success",
            summary: this.$t("common.success"),
            detail: this.$t("contacts.contactUpdated"),
            life: 3000,
          });
      } catch (err) {
        this.error =
          err.response?.data?.message || this.$t("contacts.updateError");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>
