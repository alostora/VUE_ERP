<template>
  <Dialog
    :header="$t('countries.createCountry')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- Country Create Form -->
    <CountryCreateForm
      @created="handleCreated"
      @cancel="closeModal"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("countries.creatingCountry") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import CountryCreateForm from "./CountryCreateForm.vue";

export default {
  name: "CountryCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    CountryCreateForm,
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
    },

    handleCreated(newItem) {
      this.$emit("created", newItem);
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
