<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '90vw', height: '80vh' }"
    :breakpoints="{ '960px': '95vw', '641px': '98vw' }"
    @hide="closeModal"
    class="discount-final-products-modal"
  >
    <!-- Import and use the table component -->
    <DiscountFinalProductsTable
      :company_id="effectiveCompanyId"
      :discount_id="effectiveDiscountId"
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

// Import the table component
import DiscountFinalProductsTable from "./DiscountFinalProductsTable.vue";

export default {
  name: "DiscountFinalProductsTableModal",
  components: {
    Dialog,
    Button,
    DiscountFinalProductsTable,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
    discount_id: {
      type: String,
      required: true,
    },
    discount_name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
      effectiveCompanyId: null,
      effectiveDiscountId: null,
    };
  },
  computed: {
    modalTitle() {
      return `${this.$t("discounts.finalProducts")} - ${
        this.discount_name || this.$t("discounts.discount")
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
    discount_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveDiscountId = newVal;
        }
      },
    },
  },
  methods: {
    openModal() {
      console.log("Opening final products modal with:", {
        company_id: this.company_id,
        discount_id: this.discount_id,
      });

      this.effectiveCompanyId = this.company_id;
      this.effectiveDiscountId = this.discount_id;

      if (!this.effectiveCompanyId || !this.effectiveDiscountId) {
        console.error("Missing required IDs for modal");
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
.discount-final-products-modal :deep(.p-dialog-content) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.discount-final-products-modal :deep(.discount-final-products-table) {
  flex: 1;
  height: 100%;
  padding: 1.5rem;
}

.discount-final-products-modal :deep(.p-card) {
  border: none;
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.discount-final-products-modal :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.discount-final-products-modal :deep(.p-datatable) {
  flex: 1;
  border-radius: 0;
}

.discount-final-products-modal :deep(.empty-state) {
  margin: 1.5rem;
  border-radius: 8px;
}
</style>
