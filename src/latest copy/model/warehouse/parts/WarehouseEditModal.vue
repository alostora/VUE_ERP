<template>
  <Dialog
    :header="$t('warehouses.editWarehouse')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <WarehouseEditForm
      :warehouse="warehouse"
      :company_id="effectiveCompanyId"
      :branch_id="effectiveBranchId"
      @warehouse-updated="handleWarehouseUpdated"
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
import WarehouseEditForm from "./WarehouseEditForm.vue";

export default {
  name: "WarehouseEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    WarehouseEditForm,
  },
  props: {
    warehouse: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
    branch_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    effectiveBranchId() {
      return this.branch_id || this.$route.params.branch_id;
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
    handleWarehouseUpdated(updatedWarehouse) {
      this.$emit("warehouse-updated", updatedWarehouse);
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
