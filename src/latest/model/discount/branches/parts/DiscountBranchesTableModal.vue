<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '90vw', height: '80vh' }"
    :breakpoints="{ '960px': '95vw', '641px': '98vw' }"
    @hide="closeModal"
    class="discount-branches-modal"
  >
    <DiscountBranchesTable
      ref="branchesTable"
      :company_id="effectiveCompanyId"
      :discount_id="effectiveDiscountId"
      @open-create-modal="openCreateModal"
    />

    <DiscountBranchesCreateModal
      ref="createModal"
      :company_id="effectiveCompanyId"
      :discount_id="effectiveDiscountId"
      @branches-added="onBranchesAdded"
    />

    <template #footer>
      <Button
        :label="$t('common.close')"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import DiscountBranchesTable from "./DiscountBranchesTable.vue";
import DiscountBranchesCreateModal from "./DiscountBranchesCreateModal.vue";

export default {
  name: "DiscountBranchesTableModal",
  components: { Dialog, Button, DiscountBranchesTable, DiscountBranchesCreateModal },
  props: {
    company_id: { type: String, required: true },
    discount_id: { type: String, required: true },
    discount_name: { type: String, default: "" },
  },
  data() {
    return { visible: false, effectiveCompanyId: null, effectiveDiscountId: null };
  },
  computed: {
    modalTitle() {
      return `${this.$t("discounts.branches")} - ${this.discount_name || this.$t("discounts.discount")}`;
    },
  },
  watch: {
    company_id: { immediate: true, handler(newVal) { if (newVal) this.effectiveCompanyId = newVal; } },
    discount_id: { immediate: true, handler(newVal) { if (newVal) this.effectiveDiscountId = newVal; } },
  },
  methods: {
    openModal() {
      this.effectiveCompanyId = this.company_id;
      this.effectiveDiscountId = this.discount_id;
      if (!this.effectiveCompanyId || !this.effectiveDiscountId) return console.error('Missing IDs for branches modal');
      this.visible = true;
    },
    closeModal() { this.visible = false; this.$emit('modal-closed'); },
    openCreateModal() {
      if (this.$refs.createModal && typeof this.$refs.createModal.openModal === 'function') {
        this.$refs.createModal.openModal();
      }
    },
    onBranchesAdded(newBranches) {
      if (this.$refs.branchesTable && typeof this.$refs.branchesTable.getData === 'function') {
        this.$refs.branchesTable.getData();
      }
      this.$emit('branches-added', newBranches);
    },
  },
};
</script>

<style scoped>
.discount-branches-modal :deep(.p-dialog-content) { padding: 0; display: flex; flex-direction: column; }
.discount-branches-modal :deep(.discount-branches-table) { flex: 1; height: 100%; padding: 1.5rem; }
.discount-branches-modal :deep(.p-datatable) { flex: 1; border-radius: 0; }
</style>
