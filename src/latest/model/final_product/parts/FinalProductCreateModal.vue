<template>
  <Dialog
    :header="$t('final_product.createFinalProduct')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
    @hide="closeModal"
  >
    <FinalProductCreateForm
      :company_id="effectiveCompanyId"
      @final-product-created="handleFinalProductCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("final_product.creatingFinalProduct") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import FinalProductCreateForm from "./FinalProductCreateForm.vue";

export default {
  name: "FinalProductCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    FinalProductCreateForm,
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

    handleFinalProductCreated(newFinalProduct) {
      this.$emit("final-product-created", newFinalProduct);
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