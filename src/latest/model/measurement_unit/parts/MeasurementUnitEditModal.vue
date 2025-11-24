<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <MeasurementUnitEditForm
      :measurement-unit="measurementUnit"
      :company_id="effectiveCompanyId"
      @measurement-unit-updated="handleMeasurementUnitUpdated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import MeasurementUnitEditForm from "./MeasurementUnitEditForm.vue";

export default {
  name: "MeasurementUnitEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    MeasurementUnitEditForm,
  },
  props: {
    measurementUnit: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    headerText() {
      return this.measurementUnit?.id
        ? this.$t("measurementUnits.editMeasurementUnit")
        : this.$t("measurementUnits.createMeasurementUnit");
    },
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
      this.$emit("modal-closed");
    },

    handleMeasurementUnitUpdated(updatedMeasurementUnit) {
      this.$emit("measurement-unit-updated", updatedMeasurementUnit);
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
