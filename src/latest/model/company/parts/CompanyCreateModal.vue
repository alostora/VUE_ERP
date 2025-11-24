<template>
  <Dialog
    :header="$t('companies.createCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyCreateForm
      @company-created="handleCompanyCreated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyCreateForm from "./CompanyCreateForm.vue";

export default {
  name: "CompanyCreateModal",
  components: {
    Dialog,
    CompanyCreateForm,
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

    handleCompanyCreated(newCompany) {
      this.$emit("company-created", newCompany);
      this.closeModal();
    },
  },
};
</script>
