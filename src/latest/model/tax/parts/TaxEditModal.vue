<template>
  <Dialog
    :header="$t('taxes.editTax')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <TaxEditForm
      :tax="tax"
      :company_id="effectiveCompanyId"
      @tax-updated="handleTaxUpdated"
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
import TaxEditForm from "./TaxEditForm.vue";

export default {
  name: "TaxEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    TaxEditForm,
  },
  props: {
    tax: {
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
    handleTaxUpdated(updatedTax) {
      this.$emit("tax-updated", updatedTax);
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
