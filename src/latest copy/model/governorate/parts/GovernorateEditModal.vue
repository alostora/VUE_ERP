<template>
  <Dialog
    :header="$t('governorates.editGovernorate')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <GovernorateEditForm
      :governorate="governorate"
      :countryId="countryId"
      @governorate-updated="handleGovernorateUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import GovernorateEditForm from "./GovernorateEditForm.vue";

export default {
  name: "GovernorateEditModal",
  components: {
    Dialog,
    GovernorateEditForm,
  },
  props: {
    governorate: {
      type: Object,
      default: () => ({}),
    },
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

    handleGovernorateUpdated(updatedGovernorate) {
      this.$emit("governorate-updated", updatedGovernorate);
      this.closeModal();
    },
  },
};
</script>