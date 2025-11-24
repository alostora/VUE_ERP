<template>
  <Dialog
    :header="$t('governorates.createGovernorate')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <GovernorateCreateForm
      :countryId="countryId"
      @governorate-created="handleGovernorateCreated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import GovernorateCreateForm from "./GovernorateCreateForm.vue";

export default {
  name: "GovernorateCreateModal",
  components: {
    Dialog,
    GovernorateCreateForm,
  },
  props: {
    countryId: {
      type: String,
      required: true
    }
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

    handleGovernorateCreated(newGovernorate) {
      this.$emit("governorate-created", newGovernorate);
      this.closeModal();
    },
  },
};
</script>