<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    @hide="closeModal"
    :header="$t('contacts.addAddress')"
  >
    <div class="p-3">
      <div class="p-fluid">
        <label>{{ $t("contacts.address") }}</label>
        <InputText v-model="form.address" />

        <div class="mt-3">
          <Checkbox v-model="form.is_default" binary />
          <span class="ml-2">{{ $t("contacts.isDefault") }}</span>
        </div>

        <div class="mt-4 flex justify-content-end gap-2">
          <Button
            :label="$t('common.cancel')"
            @click="closeModal"
            class="p-button-text"
          />
          <Button
            :label="$t('common.create')"
            class="p-button-primary"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import general_request from "../../../../views/layouts/constants/general_request";

export default {
  name: "ContactAddressCreateModal",
  components: { Dialog, InputText, Button, Checkbox },
  props: { contact_id: { type: String, required: true } },
  data() {
    return { visible: false, form: { address: "", is_default: false } };
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
      this.form = { address: "", is_default: false };
    },
    async submit() {
      try {
        // POST to collection endpoint with contact_id in body (per CONTACT_PROMPET.md)
        await this.$http.post(
          `${general_request.BASE_URL}/admin/company/contact-address`,
          {
            contact_id: this.contact_id,
            address: this.form.address,
            is_default: this.form.is_default,
          },
          { headers: general_request.headers }
        );
        this.$toast.add({
          severity: "success",
          summary: this.$t("common.success"),
          detail: this.$t("contacts.addressCreated"),
        });
        this.$emit("created");
        this.closeModal();
      } catch (err) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("common.error"),
          detail: this.$t("contacts.createError"),
        });
      }
    },
  },
};
</script>

<style scoped>
.p-fluid label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
