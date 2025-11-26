<template>
  <Dialog
    :header="$t('taxes.createTax')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <TaxCreateForm
      :company_id="effectiveCompanyId"
      @tax-created="handleTaxCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("taxes.creatingTax") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import TaxCreateForm from "./TaxCreateForm.vue";

export default {
  name: "TaxCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    TaxCreateForm,
  },
  props: {
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
    },
    handleTaxCreated(newTax) {
      this.$emit("tax-created", newTax);
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
