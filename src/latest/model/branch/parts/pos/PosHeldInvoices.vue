<template>
  <Dialog
    :header="$t('pos.heldInvoices')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '700px' }"
  >
    <!-- Held Invoices List -->
    <div v-if="heldInvoices.length > 0" class="held-invoices-list">
      <DataTable
        :value="heldInvoices"
        :paginator="true"
        :rows="10"
        class="p-datatable-sm"
      >
        <Column field="invoiceNumber" :header="$t('pos.invoiceNumber')">
          <template #body="slotProps">
            <span class="font-mono">{{ slotProps.data.invoiceNumber }}</span>
          </template>
        </Column>

        <Column :header="$t('pos.customer')">
          <template #body="slotProps">
            <div>
              <div class="font-bold">
                {{ slotProps.data.customer?.name || $t("pos.walkInCustomer") }}
              </div>
              <div
                v-if="slotProps.data.customer?.phone"
                class="text-sm text-color-secondary"
              >
                {{ slotProps.data.customer.phone }}
              </div>
            </div>
          </template>
        </Column>

        <Column :header="$t('pos.items')">
          <template #body="slotProps">
            <div class="text-sm">
              {{ slotProps.data.cartItems?.length || 0 }} {{ $t("pos.items") }}
            </div>
          </template>
        </Column>

        <Column :header="$t('pos.total')">
          <template #body="slotProps">
            <div class="font-bold">
              {{ calculateInvoiceTotal(slotProps.data) }}
            </div>
          </template>
        </Column>

        <Column :header="$t('pos.heldAt')">
          <template #body="slotProps">
            <div class="text-sm">
              {{ formatDate(slotProps.data.heldAt) }}
            </div>
          </template>
        </Column>

        <Column :header="$t('pos.actions')" style="width: 150px">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                icon="pi pi-play"
                @click="loadInvoice(slotProps.data)"
                class="p-button-success p-button-sm"
                v-tooltip.top="$t('pos.loadInvoice')"
              />
              <Button
                icon="pi pi-trash"
                @click="deleteInvoice(slotProps.data.id)"
                class="p-button-danger p-button-sm"
                v-tooltip.top="$t('pos.deleteInvoice')"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-6">
      <i class="pi pi-inbox text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">{{ $t("pos.noHeldInvoices") }}</h3>
      <p class="text-color-secondary">
        {{ $t("pos.holdInvoicesWillAppearHere") }}
      </p>
    </div>

    <template #footer>
      <Button
        :label="$t('common.close')"
        @click="closeModal"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";

import PosService from "./PosService.js";

export default {
  name: "PosHeldInvoices",
  components: {
    Dialog,
    DataTable,
    Column,
    Button,
  },
  directives: {
    tooltip: Tooltip,
  },
  props: {
    companyId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      heldInvoices: [],
      posService: null,
    };
  },
  created() {
    this.posService = new PosService(this.companyId, this.branchId);
  },
  methods: {
    openModal() {
      this.visible = true;
      this.loadHeldInvoices();
    },

    closeModal() {
      this.visible = false;
    },

    loadHeldInvoices() {
      this.heldInvoices = this.posService.getHeldInvoices();
    },

    loadInvoice(invoice) {
      this.$emit("load-invoice", invoice);
      this.closeModal();
    },

    deleteInvoice(invoiceId) {
      if (confirm(this.$t("pos.confirmDeleteInvoice"))) {
        this.posService.deleteHeldInvoice(invoiceId);
        this.loadHeldInvoices();

        this.$toast.add({
          severity: "success",
          summary: this.$t("pos.invoiceDeleted"),
          detail: this.$t("pos.heldInvoiceDeleted"),
          life: 3000,
        });
      }
    },

    calculateInvoiceTotal(invoice) {
      // Calculate total from cart items
      let total = 0;
      if (invoice.cartItems && Array.isArray(invoice.cartItems)) {
        invoice.cartItems.forEach((item) => {
          const price = item.has_discount
            ? item.price_after_discount
            : item.price;
          total += price * (item.quantity || 1);
        });
      }
      return `$${total.toFixed(2)}`;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return (
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " " +
        date.toLocaleDateString()
      );
    },
  },
};
</script>

<style scoped>
.held-invoices-list {
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

:deep(.p-datatable) {
  font-size: 0.875rem;
}

:deep(.p-datatable .p-button.p-button-sm) {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
