<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
    @hide="closeModal"
  >
    <VariantValuesForm
      :variant="variant"
      :company_id="effectiveCompanyId"
      @variant-values-updated="handleVariantValuesUpdated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("variants.loadingVariantValues") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import VariantValuesForm from "./VariantValuesForm.vue";

export default {
  name: "VariantValuesModal",
  components: {
    Dialog,
    ProgressSpinner,
    VariantValuesForm,
  },
  props: {
    variant: {
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
    modalTitle() {
      return this.variant?.name
        ? `${this.$t("variants.variantValues")} - ${this.variant.name}`
        : this.$t("variants.variantValues");
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
    },

    handleVariantValuesUpdated() {
      this.$emit("variant-values-updated");
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
