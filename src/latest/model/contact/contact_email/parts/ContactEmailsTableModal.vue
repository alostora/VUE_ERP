<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    @hide="closeModal"
    :header="$t('contacts.emails')"
  >
    <ContactEmailsTable :company_id="company_id" :contact_id="contact_id" />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ContactEmailsTable from "./ContactEmailsTable.vue";

export default {
  name: "ContactEmailsTableModal",
  components: { Dialog, ContactEmailsTable },
  props: {
    company_id: { type: String, required: true },
    contact_id: { type: String, required: true },
  },
  data() {
    return { visible: false };
  },
  mounted() {
    this.visible = true;
  },
  methods: {
    closeModal() {
      this.visible = false;
      if (this.$route && this.$route.name === "company-contact-emails") {
        this.$router.push({
          name: "company-contacts",
          params: { company_id: this.company_id },
        });
      }
      this.$emit("closed");
    },
  },
};
</script>

<style scoped>
/* Modal wrapper for emails table */
</style>
