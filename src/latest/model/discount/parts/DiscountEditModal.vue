<template>
  <Dialog
    :header="$t('discounts.editDiscount')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <DiscountEditForm
      :discount="discount"
      :company_id="effectiveCompanyId"
      @discount-updated="handleDiscountUpdated"
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
import DiscountEditForm from "./DiscountEditForm.vue";

export default {
  name: "DiscountEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    DiscountEditForm,
  },
  props: {
    discount: {
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
    handleDiscountUpdated(updatedDiscount) {
      this.$emit("discount-updated", updatedDiscount);
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
