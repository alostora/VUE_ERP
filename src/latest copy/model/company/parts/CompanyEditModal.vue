<template>
  <Dialog
    :header="$t('companies.editCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyEditForm
      :company="company"
      @company-updated="handleCompanyUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyEditForm from "./CompanyEditForm.vue";

export default {
  name: "CompanyEditModal",
  components: {
    Dialog,
    CompanyEditForm,
  },
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCompanyUpdated(updatedCompany) {
      this.$emit("company-updated", updatedCompany);
      this.closeModal();
    },
  },
};
</script>
