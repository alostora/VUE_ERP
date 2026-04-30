<template>
  <div class="pos-receipt" ref="receiptContent">
    <!-- Receipt Header -->
    <div class="receipt-header text-center mb-3">
      <h2 class="m-0">{{ companyInfo.name || "Company Name" }}</h2>
      <p class="m-0 text-sm" v-if="companyInfo.address">
        {{ companyInfo.address }}
      </p>
      <p class="m-0 text-sm" v-if="companyInfo.phone">
        {{ $t("pos.phone") }}: {{ companyInfo.phone }}
      </p>
      <Divider />
    </div>

    <!-- Receipt Info -->
    <div class="receipt-info mb-3">
      <div class="grid">
        <div class="col-6">
          <strong>{{ $t("pos.invoiceNumber") }}:</strong>
          <div>{{ invoice.invoice_number || invoice.id }}</div>
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

    <!-- Warehouse Info -->
    <div
      v-if="invoice.warehouse"
      class="warehouse-info mb-3 p-2 surface-100 border-round"
    >
      <h4 class="m-0 mb-1">{{ $t("pos.warehouse") }}</h4>
      <p class="m-0">
        <strong>{{ invoice.warehouse.name }}</strong>
      </p>
    </div>

    <!-- Items Table -->
    <div class="receipt-items mb-3">
      <h4 class="m-0 mb-2">{{ $t("pos.items") }}</h4>
      <div class="items-table">
        <div
          class="table-header flex justify-content-between font-bold mb-1 pb-1 border-bottom-1"
        >
          <div class="col-6">{{ $t("pos.item") }}</div>
          <div class="col-2 text-center">{{ $t("pos.qty") }}</div>
          <div class="col-2 text-right">{{ $t("pos.price") }}</div>
          <div class="col-2 text-right">{{ $t("pos.total") }}</div>
        </div>

        <div
          v-for="(item, index) in invoice.items"
          :key="index"
          class="table-row justify-content-between py-1 border-bottom-1"
        >
          <div class="col-6">
            <div class="font-bold">{{ item.name }}</div>
            <div v-if="item.name_ar" class="text-sm text-color-secondary">
              {{ item.name_ar }}
            </div>
          </div>
          <div class="col-2 text-center">{{ item.quantity }}</div>
          <div class="col-2 text-right">
            {{
              formatCurrency(
                item.has_discount ? item.price_after_discount : item.price
              )
            }}
          </div>
          <div class="col-2 text-right">
            {{ formatCurrency(calculateItemTotal(item)) }}
          </div>
        </div>
      </div>
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
    <div class="receipt-totals p-3 surface-100 border-round">
      <h4 class="m-0 mb-2">{{ $t("pos.summary") }}</h4>

      <div class="totals-grid">
        <div class="flex justify-content-between mb-1">
          <span>{{ $t("pos.subtotal") }}:</span>
          <span class="font-bold">{{
            formatCurrency(invoice.totals?.subtotal || 0)
          }}</span>
        </div>

        <div
          v-if="invoice.totals?.discountTotal > 0"
          class="flex justify-content-between mb-1 text-red-500"
        >
          <span>{{ $t("pos.discount") }}:</span>
          <span class="font-bold"
            >-{{ formatCurrency(invoice.totals.discountTotal) }}</span
          >
        </div>

        <div
          v-if="invoice.totals?.additionalCostsTotal > 0"
          class="flex justify-content-between mb-1 text-green-500"
        >
          <span>{{ $t("pos.additionalCosts") }}:</span>
          <span class="font-bold"
            >+{{ formatCurrency(invoice.totals.additionalCostsTotal) }}</span
          >
        </div>

        <div class="flex justify-content-between mb-1">
          <span>{{ $t("pos.taxableAmount") }}:</span>
          <span class="font-bold">{{
            formatCurrency(invoice.totals?.taxableAmount || 0)
          }}</span>
        </div>

        <div class="flex justify-content-between mb-1">
          <span>{{ $t("pos.tax") }} ({{ invoice.taxRate || 14 }}%):</span>
          <span class="font-bold">{{
            formatCurrency(invoice.totals?.taxAmount || 0)
          }}</span>
        </div>

        <Divider class="my-2" />

        <div
          class="flex justify-content-between text-xl font-bold text-primary"
        >
          <span>{{ $t("pos.total") }}:</span>
          <span>{{ formatCurrency(invoice.totals?.grandTotal || 0) }}</span>
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
import Divider from "primevue/divider";
import PosService from "./PosService.js";

export default {
  name: "PosReceipt",
  components: {
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
      companyInfo: {
        name: "",
        address: "",
        phone: "",
      },
      userName: "Cashier",
      posService: null,
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
    this.posService = new PosService(this.companyId, this.branchId);
    this.loadCompanyInfo();
  },
  methods: {
    async loadCompanyInfo() {
      try {
        // Load company info from API if needed
        // For now, we'll use default values
        this.companyInfo = {
          name: "Your Company",
          address: "123 Business Street, City",
          phone: "0123456789",
        };
      } catch (error) {
        console.error("Error loading company info:", error);
      }
    },

    formatCurrency(amount) {
      if (amount === undefined || amount === null) return "$0.00";
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    formatDate(dateString) {
      if (!dateString) return new Date().toLocaleString();
      const date = new Date(dateString);
      return date.toLocaleString();
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
  color: #000;
}

.receipt-header {
  border-bottom: 2px dashed #333;
  padding-bottom: 10px;
}

.receipt-header h2 {
  font-size: 18px;
  font-weight: bold;
}

.receipt-info {
  font-size: 11px;
}

.customer-info,
.warehouse-info,
.payment-info {
  border-left: 3px solid #007bff;
}

.items-table {
  width: 100%;
}

.table-header {
  border-bottom: 2px solid #333;
}

.table-row {
  border-bottom: 1px dashed #ddd;
}

.table-row:last-child {
  border-bottom: none;
}

.receipt-totals {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.totals-grid {
  background: white;
  padding: 10px;
  border-radius: 4px;
}

.payment-info {
  border: 1px solid #28a745;
  background: #f8fff9;
}

.receipt-footer {
  border-top: 2px dashed #333;
  padding-top: 10px;
  font-size: 10px;
}

/* Print styles */
@media print {
  .pos-receipt {
    width: 80mm;
    padding: 0;
    font-size: 10px;
    max-width: none;
  }

  .receipt-header h2 {
    font-size: 14px;
  }

  .receipt-info,
  .customer-info,
  .warehouse-info {
    font-size: 9px;
  }

  .table-header,
  .table-row {
    font-size: 9px;
  }

  .receipt-totals {
    font-size: 10px;
  }

  .receipt-footer {
    font-size: 8px;
  }

  /* Hide buttons and other non-printable elements */
  .no-print {
    display: none !important;
  }
}
</style>
