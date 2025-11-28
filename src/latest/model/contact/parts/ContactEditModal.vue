<template>
  <Dialog
    :header="$t('contacts.editContact')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <ContactEditForm
      :contact="contact"
      :company_id="company_id"
      @contact-updated="handleUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ContactEditForm from "./ContactEditForm.vue";

export default {
  name: "ContactEditModal",
  components: { Dialog, ContactEditForm },
  props: {
    contact: { type: Object, default: () => ({}) },
    company_id: { type: String, required: true },
  },
  data() {
    return { visible: false };
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
    handleUpdated(updated) {
      this.$emit("contact-updated", updated);
      this.closeModal();
    },
  },
};
</script>
