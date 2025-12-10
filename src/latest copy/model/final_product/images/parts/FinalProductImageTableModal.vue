<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '90vw', height: '80vh' }"
    :breakpoints="{ '960px': '95vw', '641px': '98vw' }"
    @hide="closeModal"
    class="final-product-images-modal"
  >
    <!-- Import and use the existing table component -->
    <FinalProductImageTable
      :company_id="effectiveCompanyId"
      :final_product_id="effectiveFinalProductId"
      :embedded="true"
      @close-requested="closeModal"
    />

    <!-- Footer -->
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

// Import the existing table component
import FinalProductImageTable from "./FinalProductImageTable.vue";

export default {
  name: "FinalProductImageTableModal",
  components: {
    Dialog,
    Button,
    FinalProductImageTable,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
    final_product_id: {
      type: String,
      required: true,
    },
    final_product_name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
      effectiveCompanyId: null,
      effectiveFinalProductId: null,
    };
  },
  computed: {
    modalTitle() {
      return `${this.$t("final_product_images.title")} - ${
        this.final_product_name || "Product"
      }`;
    },
  },
  watch: {
    company_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveCompanyId = newVal;
        }
      },
    },
    final_product_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveFinalProductId = newVal;
        }
      },
    },
  },
  methods: {
    openModal() {

      // Ensure we have the IDs
      this.effectiveCompanyId = this.company_id;
      this.effectiveFinalProductId = this.final_product_id;

      if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
        return;
      }

      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },
  },
};
</script>

<style scoped>
.final-product-images-modal :deep(.p-dialog-content) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.final-product-images-modal :deep(.final-product-images-table) {
  flex: 1;
  height: 100%;
  padding: 0;
}

.final-product-images-modal :deep(.page-header) {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--surface-border);
}

.final-product-images-modal :deep(.p-card) {
  border: none;
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.final-product-images-modal :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.final-product-images-modal :deep(.images-grid) {
  flex: 1;
  border-radius: 0;
}

.final-product-images-modal :deep(.empty-state) {
  margin: 1.5rem;
  border-radius: 8px;
}
</style>
