<template>
  <div class="pos-cart-panel">
    <!-- Cart Header -->
    <div class="cart-header mb-3 p-3 surface-100 border-round">
      <div class="flex justify-content-between align-items-center">
        <h3 class="m-0">
          <i class="pi pi-shopping-cart mr-2"></i>
          {{ $t("pos.cart") }}
          <Tag :value="cartItems.length" severity="info" class="ml-2" />
        </h3>
        <Button
          :label="$t('pos.clearAll')"
          icon="pi pi-trash"
          @click="clearCart"
          class="p-button-danger p-button-text"
          :disabled="cartItems.length === 0"
        />
      </div>
    </div>

    <!-- Cart Items -->
    <div
      class="cart-items-container"
      :class="{ 'empty-cart': cartItems.length === 0 }"
    >
      <div v-if="cartItems.length > 0" class="cart-items-list">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item-wrapper mb-2"
        >
          <PosCartItem
            :item="item"
            @update="(updates) => $emit('update-item', item.id, updates)"
            @remove="$emit('remove-item', item.id)"
          />
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="empty-cart-state text-center py-6">
        <i class="pi pi-shopping-cart text-6xl text-color-secondary mb-3"></i>
        <h4 class="text-color-secondary">{{ $t("pos.cartEmpty") }}</h4>
        <p class="text-color-secondary">{{ $t("pos.addProductsToCart") }}</p>
      </div>
    </div>

    <!-- Customer, Warehouse, Payment Selection -->
    <div class="selection-section mt-3 p-3 surface-50 border-round">
      <h4 class="mt-0 mb-3">{{ $t("pos.invoiceDetails") }}</h4>

      <div class="grid">
        <!-- Customer Selection -->
        <div class="col-12 md:col-6">
          <div class="field mb-3">
            <label class="block font-bold mb-2">
              <i class="pi pi-user mr-1"></i>
              {{ $t("pos.customer") }}
            </label>
            <PosCustomerSelector
              :company-id="companyId"
              :selected-customer="selectedCustomer"
              @select-customer="$emit('customer-change', $event)"
              @create-customer="createNewCustomer"
            />
          </div>
        </div>

        <!-- Warehouse Selection -->
        <div class="col-12 md:col-6">
          <div class="field mb-3">
            <label class="block font-bold mb-2">
              <i class="pi pi-building mr-1"></i>
              {{ $t("pos.warehouse") }} *
            </label>
            <Dropdown
              :model-value="selectedWarehouse"
              :options="warehouses"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('pos.selectWarehouse')"
              @update:modelValue="onWarehouseChange"
              class="w-full"
              :class="{
                'p-invalid': !selectedWarehouse && cartItems.length > 0,
              }"
              showClear
            />
            <small
              v-if="!selectedWarehouse && cartItems.length > 0"
              class="p-error"
            >
              {{ $t("pos.warehouseRequired") }}
            </small>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="col-12 md:col-6">
          <div class="field mb-3">
            <label class="block font-bold mb-2">
              <i class="pi pi-credit-card mr-1"></i>
              {{ $t("pos.paymentMethod") }} *
            </label>
            <Dropdown
              :model-value="selectedPaymentMethod"
              :options="paymentMethods"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('pos.selectPaymentMethod')"
              @update:modelValue="onPaymentMethodChange"
              class="w-full"
              :class="{
                'p-invalid': !selectedPaymentMethod && cartItems.length > 0,
              }"
              showClear
            />
            <small
              v-if="!selectedPaymentMethod && cartItems.length > 0"
              class="p-error"
            >
              {{ $t("pos.paymentMethodRequired") }}
            </small>
          </div>
        </div>

        <!-- Invoice Notes -->
        <div class="col-12 md:col-6">
          <div class="field mb-3">
            <label class="block font-bold mb-2">
              <i class="pi pi-comment mr-1"></i>
              {{ $t("pos.notes") }}
            </label>
            <Textarea
              :model-value="invoiceNotes"
              @update:modelValue="onInvoiceNotesChange"
              :placeholder="$t('pos.addNotesHere')"
              rows="2"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice-Level Discounts & Additional Costs -->
    <div class="invoice-adjustments mt-3">
      <!-- Discounts -->
      <div class="mb-3">
        <div class="flex justify-content-between align-items-center mb-2">
          <h4 class="m-0">
            <i class="pi pi-percentage mr-2"></i>
            {{ $t("pos.invoiceDiscounts") }}
          </h4>
          <Button
            :label="$t('pos.addDiscount')"
            icon="pi pi-plus"
            @click="$emit('add-discount')"
            class="p-button-success p-button-sm"
          />
        </div>

        <div v-if="invoiceDiscounts.length > 0" class="adjustments-list">
          <div
            v-for="discount in invoiceDiscounts"
            :key="discount.id"
            class="adjustment-item p-2 mb-2 surface-100 border-round"
          >
            <div class="grid">
              <div class="col-12 md:col-5">
                <InputText
                  :model-value="discount.name"
                  @update:modelValue="
                    (value) => onDiscountUpdate(discount, 'name', value)
                  "
                  :placeholder="$t('pos.discountName')"
                  class="w-full"
                />
              </div>
              <div class="col-12 md:col-5">
                <InputNumber
                  :model-value="discount.value"
                  @update:modelValue="
                    (value) => onDiscountUpdate(discount, 'value', value)
                  "
                  :placeholder="$t('pos.discountValue')"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  class="w-full"
                />
              </div>
              <div class="col-12 md:col-2">
                <Button
                  icon="pi pi-times"
                  @click="$emit('remove-discount', discount.id)"
                  class="p-button-danger p-button-text w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-color-secondary p-2">
          {{ $t("pos.noDiscountsAdded") }}
        </div>
      </div>

      <!-- Additional Costs -->
      <div>
        <div class="flex justify-content-between align-items-center mb-2">
          <h4 class="m-0">
            <i class="pi pi-money-bill mr-2"></i>
            {{ $t("pos.additionalCosts") }}
          </h4>
          <Button
            :label="$t('pos.addCost')"
            icon="pi pi-plus"
            @click="$emit('add-additional-cost')"
            class="p-button-warning p-button-sm"
          />
        </div>

        <div v-if="invoiceAdditionalCosts.length > 0" class="adjustments-list">
          <div
            v-for="cost in invoiceAdditionalCosts"
            :key="cost.id"
            class="adjustment-item p-2 mb-2 surface-100 border-round"
          >
            <div class="grid">
              <div class="col-12 md:col-5">
                <InputText
                  :model-value="cost.name"
                  @update:modelValue="
                    (value) => onAdditionalCostUpdate(cost, 'name', value)
                  "
                  :placeholder="$t('pos.costName')"
                  class="w-full"
                />
              </div>
              <div class="col-12 md:col-5">
                <InputNumber
                  :model-value="cost.value"
                  @update:modelValue="
                    (value) => onAdditionalCostUpdate(cost, 'value', value)
                  "
                  :placeholder="$t('pos.costValue')"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  class="w-full"
                />
              </div>
              <div class="col-12 md:col-2">
                <Button
                  icon="pi pi-times"
                  @click="$emit('remove-additional-cost', cost.id)"
                  class="p-button-danger p-button-text w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-color-secondary p-2">
          {{ $t("pos.noAdditionalCosts") }}
        </div>
      </div>
    </div>

    <!-- Invoice Summary -->
    <div class="invoice-summary mt-3 p-3 surface-100 border-round">
      <h4 class="mt-0 mb-3">{{ $t("pos.summary") }}</h4>

      <div class="summary-details">
        <div class="flex justify-content-between mb-2">
          <span>{{ $t("pos.subtotal") }}:</span>
          <span class="font-bold">{{ formatCurrency(totals.subtotal) }}</span>
        </div>

        <div
          v-if="totals.discountTotal > 0"
          class="flex justify-content-between mb-2 text-red-500"
        >
          <span>{{ $t("pos.discount") }}:</span>
          <span class="font-bold"
            >-{{ formatCurrency(totals.discountTotal) }}</span
          >
        </div>

        <div
          v-if="totals.additionalCostsTotal > 0"
          class="flex justify-content-between mb-2 text-green-500"
        >
          <span>{{ $t("pos.additionalCosts") }}:</span>
          <span class="font-bold"
            >+{{ formatCurrency(totals.additionalCostsTotal) }}</span
          >
        </div>

        <div class="flex justify-content-between mb-2">
          <span>{{ $t("pos.taxableAmount") }}:</span>
          <span class="font-bold">{{
            formatCurrency(totals.taxableAmount)
          }}</span>
        </div>

        <div class="flex justify-content-between mb-2">
          <span>{{ $t("pos.tax") }} ({{ taxRate }}%):</span>
          <span class="font-bold">{{ formatCurrency(totals.taxAmount) }}</span>
        </div>

        <Divider />

        <div class="flex justify-content-between mb-2 text-2xl font-bold">
          <span>{{ $t("pos.total") }}:</span>
          <span class="text-primary">{{
            formatCurrency(totals.grandTotal)
          }}</span>
        </div>
      </div>

      <!-- Checkout Button -->
      <Button
        :label="checkoutButtonLabel"
        icon="pi pi-check"
        @click="$emit('checkout')"
        class="p-button-success w-full mt-3"
        :disabled="!canCheckout"
        :loading="processingCheckout"
      >
        <template #loading>
          <ProgressSpinner style="width: 20px; height: 20px" />
          <span class="ml-2">{{ $t("pos.processing") }}</span>
        </template>
      </Button>

      <small class="block text-center text-color-secondary mt-2">
        {{ $t("pos.checkoutHint") }}
      </small>
    </div>
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Divider from "primevue/divider";
import ProgressSpinner from "primevue/progressspinner";

import PosCartItem from "./PosCartItem.vue";
import PosCustomerSelector from "./PosCustomerSelector.vue";
import PosService from "./PosService.js";

export default {
  name: "PosCartPanel",
  components: {
    Dropdown,
    Button,
    Tag,
    Textarea,
    InputText,
    InputNumber,
    Divider,
    ProgressSpinner,
    PosCartItem,
    PosCustomerSelector,
  },
  props: {
    cartItems: {
      type: Array,
      default: () => [],
    },
    selectedCustomer: {
      type: Object,
      default: null,
    },
    selectedWarehouse: {
      type: String,
      default: null,
    },
    selectedPaymentMethod: {
      type: String,
      default: null,
    },
    invoiceDiscounts: {
      type: Array,
      default: () => [],
    },
    invoiceAdditionalCosts: {
      type: Array,
      default: () => [],
    },
    taxRate: {
      type: Number,
      default: 14,
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
      // Data
      warehouses: [],
      paymentMethods: [],

      // UI State
      invoiceNotes: "",
      processingCheckout: false,

      // Service
      posService: null,
    };
  },
  computed: {
    selectedWarehouseObj() {
      return (
        this.warehouses.find((w) => w.id === this.selectedWarehouse) || null
      );
    },

    selectedPaymentMethodObj() {
      return (
        this.paymentMethods.find((p) => p.id === this.selectedPaymentMethod) ||
        null
      );
    },

    totals() {
      return this.posService.calculateInvoiceTotals(
        this.cartItems,
        this.invoiceDiscounts,
        this.invoiceAdditionalCosts,
        this.taxRate
      );
    },

    canCheckout() {
      return (
        this.cartItems.length > 0 &&
        this.selectedWarehouse &&
        this.selectedPaymentMethod
      );
    },

    checkoutButtonLabel() {
      if (this.cartItems.length === 0) return this.$t("pos.emptyCart");
      if (!this.selectedWarehouse) return this.$t("pos.selectWarehouse");
      if (!this.selectedPaymentMethod)
        return this.$t("pos.selectPaymentMethod");
      return `${this.$t("pos.checkout")} - ${this.formatCurrency(
        this.totals.grandTotal
      )}`;
    },
  },
  created() {
    this.posService = new PosService(this.companyId, this.branchId);
    this.loadSelectionData();
  },
  methods: {
    async loadSelectionData() {
      try {
        // Load warehouses
        // TODO: Replace with real API
        this.warehouses = [
          {
            id: "warehouse1",
            name: "Main Warehouse",
            name_ar: "المخزن الرئيسي",
          },
          { id: "warehouse2", name: "Branch Warehouse", name_ar: "مخزن الفرع" },
        ];

        // Load payment methods
        // TODO: Replace with real API
        this.paymentMethods = this.posService.getDummyPaymentMethods();
      } catch (error) {
        console.error("Error loading selection data:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.loadError"),
          detail: this.$t("pos.failedToLoadData"),
          life: 3000,
        });
      }
    },

    // Event handlers for prop updates
    onWarehouseChange(value) {
      const warehouseId = value;
      const warehouse =
        this.warehouses.find((w) => w.id === warehouseId) || null;
      this.$emit("warehouse-change", warehouse);
    },

    onPaymentMethodChange(value) {
      const methodId = value;
      const method = this.paymentMethods.find((p) => p.id === methodId) || null;
      this.$emit("payment-method-change", method);
    },

    onInvoiceNotesChange(value) {
      this.invoiceNotes = value;
      // If you need to emit this to parent
      // this.$emit('invoice-notes-change', this.invoiceNotes);
    },

    onDiscountUpdate(discount, field, value) {
      const updatedDiscount = { ...discount, [field]: value };
      this.$emit("update-discount", updatedDiscount);
    },

    onAdditionalCostUpdate(cost, field, value) {
      const updatedCost = { ...cost, [field]: value };
      this.$emit("update-additional-cost", updatedCost);
    },

    clearCart() {
      this.$emit("clear-cart");
    },

    async createNewCustomer(customerData) {
      try {
        // TODO: Replace with real API
        // const newCustomer = await this.posService.createContact(customerData);

        // For now, create dummy customer
        const newCustomer = {
          id: `cust_${Date.now()}`,
          ...customerData,
        };

        this.$emit("customer-change", newCustomer);

        this.$toast.add({
          severity: "success",
          summary: this.$t("pos.customerCreated"),
          detail: this.$t("pos.newCustomerAdded"),
          life: 3000,
        });
      } catch (error) {
        console.error("Error creating customer:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.createError"),
          detail: error.message || this.$t("pos.failedToCreateCustomer"),
          life: 3000,
        });
      }
    },

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.pos-cart-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.cart-items-container {
  flex: 1;
  overflow-y: auto;
  min-height: 1030px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px;
}

.cart-items-container.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-items-list {
  max-height: 1000px;
  overflow-y: auto;
}

.empty-cart-state {
  width: 100%;
}

.selection-section {
  background: #f8f9fa;
}

.invoice-adjustments .adjustment-item {
  border-left: 4px solid #007bff;
  background: white;
}

.invoice-adjustments .adjustment-item:nth-child(odd) {
  border-left-color: #28a745;
}

.invoice-summary {
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  border: 2px solid #007bff;
}

.summary-details {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-button) {
  font-weight: 600;
}

:deep(.p-divider) {
  margin: 1rem 0;
}

/* Scrollbar styling */
.cart-items-container::-webkit-scrollbar,
.cart-items-list::-webkit-scrollbar {
  width: 15px;
}

.cart-items-container::-webkit-scrollbar-track,
.cart-items-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cart-items-container::-webkit-scrollbar-thumb,
.cart-items-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.cart-items-container::-webkit-scrollbar-thumb:hover,
.cart-items-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
