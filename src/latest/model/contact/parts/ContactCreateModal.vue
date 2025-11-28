<template>
  <Dialog
    :header="$t('contacts.addContact')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <ContactCreateForm
      :company_id="company_id"
      @contact-created="handleCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("contacts.creatingContact") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import ContactCreateForm from "./ContactCreateForm.vue";

export default {
  name: "ContactCreateModal",
  components: { Dialog, ProgressSpinner, ContactCreateForm },
  props: { company_id: { type: String, required: true } },
  data() {
    return { visible: false, loading: false };
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
      this.loading = false;
    },
    handleCreated(newContact) {
      this.$emit("contact-created", newContact);
      this.closeModal();
    },
    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
