<template>
  <Dialog
    :header="$t('discounts.selectBranches')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <DiscountBranchesCreateForm
      :discount_id="discount_id"
      :company_id="company_id"
      @branches-added="handleBranchesAdded"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("discounts.creatingBranches") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import DiscountBranchesCreateForm from "./DiscountBranchesCreateForm.vue";

export default {
  name: "DiscountBranchesCreateModal",
  components: { Dialog, ProgressSpinner, DiscountBranchesCreateForm },
  props: {
    discount_id: { type: String, required: true },
    company_id: { type: String, required: true },
  },
  data() {
    return { visible: false, loading: false };
  },
  methods: {
    openModal() { this.visible = true; },
    closeModal() { this.visible = false; this.loading = false; },
    handleBranchesAdded(newBranches) { this.$emit('branches-added', newBranches); this.closeModal(); },
    setLoading(state) { this.loading = state; },
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
