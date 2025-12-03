<template>
  <div class="pos-receipt" ref="receiptContent">
    <!-- Receipt Header -->
    <div class="receipt-header text-center mb-3">
      <h2 class="m-0">{{ companyName }}</h2>
      <p class="m-0 text-sm" v-if="companyAddress">{{ companyAddress }}</p>
      <p class="m-0 text-sm" v-if="companyPhone">
        {{ $t("pos.phone") }}: {{ companyPhone }}
      </p>
      <Divider />
    </div>

    <!-- Receipt Info -->
    <div class="receipt-info mb-3">
      <div class="grid">
        <div class="col-6">
          <strong>{{ $t("pos.invoiceNumber") }}:</strong>
          <div>{{ invoice.invoice_number }}</div>
        </div>
        <div class="col-6">
          <strong>{{ $t("pos.date") }}:</strong>
          <div>{{ formatDate(invoice.created_at) }}</div>
        </div>
      </div>

      <div class="mt-2">
        <strong>{{ $t("pos.cashier") }}:</strong>
        <div>{{ userName }}</div>
      </div>
    </div>

    <!-- Customer Info -->
    <div
      v-if="invoice.customer"
      class="customer-info mb-3 p-2 surface-50 border-round"
    >
      <h4 class="m-0 mb-1">{{ $t("pos.customer") }}</h4>
      <p class="m-0">
        <strong>{{ invoice.customer.name }}</strong>
      </p>
      <p v-if="invoice.customer.phone" class="m-0 text-sm">
        {{ $t("pos.phone") }}: {{ invoice.customer.phone }}
      </p>
      <p v-if="invoice.customer.email" class="m-0 text-sm">
        {{ $t("pos.email") }}: {{ invoice.customer.email }}
      </p>
      <p v-if="invoice.customer.address" class="m-0 text-sm">
        {{ $t("pos.address") }}: {{ invoice.customer.address }}
      </p>
    </div>

    <!-- Items Table -->
    <div class="receipt-items mb-3">
      <h4 class="m-0 mb-2">{{ $t("pos.items") }}</h4>
      <DataTable
        :value="invoice.items"
        class="p-datatable-sm table-scroll-container"
        :showHeaders="false"
      >
        <Column field="name">
          <template #body="slotProps">
            <div>
              <div class="font-bold">{{ slotProps.data.name }}</div>
              <div class="text-sm text-color-secondary">
                {{ slotProps.data.quantity }} ×
                {{
                  formatCurrency(
                    slotProps.data.has_discount
                      ? slotProps.data.price_after_discount
                      : slotProps.data.price
                  )
                }}
              </div>
              <div
                v-if="
                  slotProps.data.additional_costs &&
                  slotProps.data.additional_costs.length > 0
                "
                class="text-xs text-color-secondary mt-1"
              >
                <div
                  v-for="cost in slotProps.data.additional_costs"
                  :key="cost.id"
                  class="ml-2"
                >
                  + {{ cost.name }}: {{ formatCurrency(cost.value) }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column style="width: 80px">
          <template #body="slotProps">
            {{ formatCurrency(calculateItemTotal(slotProps.data)) }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Invoice-Level Adjustments -->
    <div v-if="hasInvoiceAdjustments" class="invoice-adjustments mb-3">
      <h4 class="m-0 mb-2">{{ $t("pos.adjustments") }}</h4>

      <!-- Discounts -->
      <div
        v-if="invoice.discounts && invoice.discounts.length > 0"
        class="mb-2"
      >
        <div
          v-for="discount in invoice.discounts"
          :key="discount.name"
          class="flex justify-content-between text-red-500"
        >
          <span>{{ discount.name }}:</span>
          <span>-{{ formatCurrency(discount.value) }}</span>
        </div>
      </div>

      <!-- Additional Costs -->
      <div
        v-if="invoice.additional_costs && invoice.additional_costs.length > 0"
        class="mb-2"
      >
        <div
          v-for="cost in invoice.additional_costs"
          :key="cost.name"
          class="flex justify-content-between text-green-500"
        >
          <span>{{ cost.name }}:</span>
          <span>+{{ formatCurrency(cost.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <div class="receipt-totals">
      <div class="grid">
        <div class="col-6">
          <strong>{{ $t("pos.subtotal") }}:</strong>
        </div>
        <div class="col-6 text-right">
          {{ formatCurrency(invoice.totals.subtotal) }}
        </div>

        <div v-if="invoice.totals.discountTotal > 0" class="col-6 text-red-500">
          <strong>{{ $t("pos.discount") }}:</strong>
        </div>
        <div
          v-if="invoice.totals.discountTotal > 0"
          class="col-6 text-right text-red-500"
        >
          -{{ formatCurrency(invoice.totals.discountTotal) }}
        </div>

        <div
          v-if="invoice.totals.additionalCostsTotal > 0"
          class="col-6 text-green-500"
        >
          <strong>{{ $t("pos.additionalCosts") }}:</strong>
        </div>
        <div
          v-if="invoice.totals.additionalCostsTotal > 0"
          class="col-6 text-right text-green-500"
        >
          +{{ formatCurrency(invoice.totals.additionalCostsTotal) }}
        </div>

        <div class="col-6">
          <strong>{{ $t("pos.tax") }} ({{ taxRate }}%):</strong>
        </div>
        <div class="col-6 text-right">
          {{ formatCurrency(invoice.totals.taxAmount) }}
        </div>

        <Divider class="col-12 my-2" />

        <div class="col-6 font-bold text-xl">{{ $t("pos.total") }}:</div>
        <div class="col-6 text-right font-bold text-xl text-primary">
          {{ formatCurrency(invoice.totals.grandTotal) }}
        </div>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="payment-info mt-3 p-2 surface-100 border-round">
      <h4 class="m-0 mb-1">{{ $t("pos.payment") }}</h4>
      <p class="m-0">
        <strong>{{ $t("pos.paymentMethod") }}:</strong>
        {{ invoice.payment_method?.name || $t("pos.cash") }}
      </p>
      <p v-if="invoice.details" class="m-0 mt-1 text-sm">
        <strong>{{ $t("pos.notes") }}:</strong> {{ invoice.details }}
      </p>
    </div>

    <!-- Receipt Footer -->
    <div class="receipt-footer text-center mt-4">
      <Divider />
      <p class="text-sm text-color-secondary m-0">
        {{ $t("pos.thankYouMessage") }}
      </p>
      <p class="text-xs text-color-secondary m-0 mt-1">
        {{ $t("pos.returnPolicy") }}
      </p>
      <p class="text-xs text-color-secondary m-0">
        {{ $t("pos.receiptFooter") }}
      </p>
    </div>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Divider from "primevue/divider";

export default {
  name: "PosReceipt",
  components: {
    DataTable,
    Column,
    Divider,
  },
  props: {
    invoice: {
      type: Object,
      required: true,
    },
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
      companyName: "Your Company Name",
      companyAddress: "123 Business Street, City",
      companyPhone: "0123456789",
      userName: "Cashier",
      taxRate: 14,
    };
  },
  computed: {
    hasInvoiceAdjustments() {
      return (
        (this.invoice.discounts && this.invoice.discounts.length > 0) ||
        (this.invoice.additional_costs &&
          this.invoice.additional_costs.length > 0)
      );
    },
  },
  created() {
    // TODO: Load company info from API
    this.loadCompanyInfo();
  },
  methods: {
    async loadCompanyInfo() {
      // TODO: Load company info from API
      // For now, use dummy data
    },

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },

    calculateItemTotal(item) {
      const price = item.has_discount ? item.price_after_discount : item.price;
      let total = price * (item.quantity || 1);

      if (item.additional_costs && Array.isArray(item.additional_costs)) {
        item.additional_costs.forEach((cost) => {
          total += parseFloat(cost.value) || 0;
        });
      }

      return total;
    },
  },
};
</script>

<style scoped>
.pos-receipt {
  font-family: "Courier New", monospace;
  font-size: 12px;
  line-height: 1.4;
  background: white;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.receipt-header {
  border-bottom: 2px dashed #333;
  padding-bottom: 10px;
}

.receipt-header h2 {
  font-size: 18px;
  font-weight: bold;
}

.receipt-items :deep(.p-datatable) {
  font-size: 11px;
}

.receipt-items :deep(.p-datatable-tbody tr) {
  border-bottom: 1px dashed #ddd;
}

.receipt-items :deep(.p-datatable-tbody tr:last-child) {
  border-bottom: none;
}

.receipt-totals .grid > div {
  padding: 2px 0;
}

.payment-info {
  border-left: 3px solid #007bff;
}

.receipt-footer {
  border-top: 2px dashed #333;
  padding-top: 10px;
}

/* Print styles */
@media print {
  .pos-receipt {
    width: 80mm;
    padding: 5mm;
    font-size: 10px;
  }

  .receipt-header h2 {
    font-size: 14px;
  }

  .receipt-items :deep(.p-datatable) {
    font-size: 9px;
  }
}
</style>
