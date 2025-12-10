<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <!-- Country Edit Form -->
    <CountryEditForm
      :country="country"
      @updated="handleUpdated"
      @cancel="closeModal"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import CountryEditForm from "./CountryEditForm.vue";

export default {
  name: "CountryEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    CountryEditForm,
  },
  props: {
    country: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  computed: {
    headerText() {
      return this.country?.id
        ? this.$t("countries.editCountry")
        : this.$t("countries.createCountry");
    },
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleUpdated(updatedItem) {
      this.$emit("updated", updatedItem);
      this.closeModal();
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
