<template>
  <div class="pos-cart-panel" :style="{ height: panelTotalHeight + 'px' }">
    <!-- Cart Header -->
    <div class="cart-header p-2 border-round">
      <div class="flex justify-content-between align-items-center">
        <h3 class="m-0 text-sm">
          <i class="pi pi-shopping-cart mr-1"></i>
          {{ $t("pos.cart") }}
          <Tag :value="cartItems.length" severity="info" class="ml-1 text-xs" />
        </h3>
        <Button
          :label="$t('pos.clearAll')"
          icon="pi pi-trash"
          @click="clearCart"
          class="p-button-danger p-button-text p-button-sm"
          :disabled="cartItems.length === 0"
        />
      </div>
    </div>

    <!-- Main Container مع سكرول رئيسي -->
    <div class="main-scroll-container">
      <!-- Cart Items Section - بدون ارتفاع ثابت -->
      <div class="cart-items-section">
        <div v-if="cartItems.length > 0" class="cart-items-content">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item-wrapper"
          >
            <PosCartItem
              :item="item"
              :company-id="companyId"
              :branch-id="branchId"
              :is-dark-mode="isDarkMode"
              :show-additional-costs="true"
              @update="(updates) => $emit('update-item', item.id, updates)"
              @remove="$emit('remove-item', item.id)"
            />
          </div>
        </div>

        <!-- Empty Cart -->
        <div v-else class="empty-cart-state">
          <div class="empty-content">
            <i
              class="pi pi-shopping-cart text-4xl text-color-secondary mb-2"
            ></i>
            <h5 class="text-color-secondary mb-1">
              {{ $t("pos.cartEmpty") }}
            </h5>
            <p class="text-color-secondary text-xs">
              {{ $t("pos.addProductsToCart") }}
            </p>
          </div>
        </div>
      </div>

      <!-- Invoice Details Section -->
      <div class="invoice-details-section">
        <!-- Customer Selection -->
        <div class="selection-card p-2 mb-2">
          <h5 class="mt-0 mb-1">{{ $t("pos.customer") }}</h5>
          <PosCustomerSelector
            :company-id="companyId"
            :selected-customer="selectedCustomer"
            @select-customer="$emit('customer-change', $event)"
          />
        </div>

        <!-- Warehouse & Payment -->
        <div class="selection-card p-2 mb-2">
          <h5 class="mt-0 mb-1">{{ $t("pos.invoiceDetails") }}</h5>

          <div class="grid">
            <!-- Warehouse -->
            <div class="col-12 md:col-6 mb-1">
              <label class="block font-bold mb-1 text-xs">
                <i class="pi pi-building mr-1"></i>
                {{ $t("pos.warehouse") }} *
              </label>
              <Select
                :model-value="selectedWarehouse"
                :options="warehouses"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('pos.selectWarehouse')"
                @update:modelValue="onWarehouseChange"
                class="w-full text-xs"
                :class="{
                  'p-invalid': !selectedWarehouse && cartItems.length > 0,
                }"
                showClear
              />
              <small
                v-if="!selectedWarehouse && cartItems.length > 0"
                class="p-error text-xs"
              >
                {{ $t("pos.warehouseRequired") }}
              </small>
            </div>

            <!-- Payment Method -->
            <div class="col-12 md:col-6 mb-1">
              <label class="block font-bold mb-1 text-xs">
                <i class="pi pi-credit-card mr-1"></i>
                {{ $t("pos.paymentMethod") }} *
              </label>
              <Select
                :model-value="selectedPaymentMethod"
                :options="paymentMethods"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('pos.selectPaymentMethod')"
                @update:modelValue="onPaymentMethodChange"
                class="w-full text-xs"
                :class="{
                  'p-invalid': !selectedPaymentMethod && cartItems.length > 0,
                }"
                showClear
              />
              <small
                v-if="!selectedPaymentMethod && cartItems.length > 0"
                class="p-error text-xs"
              >
                {{ $t("pos.paymentMethodRequired") }}
              </small>
            </div>

            <!-- Invoice Notes -->
            <div class="col-12 mb-1">
              <label class="block font-bold mb-1 text-xs">
                <i class="pi pi-comment mr-1"></i>
                {{ $t("pos.notes") }}
              </label>
              <Textarea
                :model-value="invoiceNotes"
                @update:modelValue="onInvoiceNotesChange"
                :placeholder="$t('pos.addNotesHere')"
                rows="1"
                class="w-full text-xs"
              />
            </div>
          </div>
        </div>

        <!-- Invoice Adjustments -->
        <div class="adjustments-section p-2 mb-2">
          <!-- Discounts -->
          <div class="mb-2">
            <div class="flex justify-content-between align-items-center mb-1">
              <h6 class="m-0 text-sm">
                <i class="pi pi-percentage mr-1"></i>
                {{ $t("pos.invoiceDiscounts") }}
              </h6>
              <Button
                :label="$t('pos.addDiscount')"
                icon="pi pi-plus"
                @click="$emit('add-discount')"
                class="p-button-success p-button-sm text-xs"
              />
            </div>

            <div v-if="invoiceDiscounts.length > 0" class="adjustments-list">
              <div
                v-for="discount in invoiceDiscounts"
                :key="discount.id"
                class="adjustment-item p-1 mb-1"
              >
                <div class="grid">
                  <div class="col-12 md:col-5">
                    <InputText
                      :model-value="discount.name"
                      @update:modelValue="
                        (value) => onDiscountUpdate(discount, 'name', value)
                      "
                      :placeholder="$t('pos.discountName')"
                      class="w-full text-xs"
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
                      class="w-full text-xs"
                    />
                  </div>
                  <div class="col-12 md:col-2">
                    <Button
                      icon="pi pi-times"
                      @click="$emit('remove-discount', discount.id)"
                      class="p-button-danger p-button-text p-button-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-color-secondary text-xs">
              {{ $t("pos.noDiscountsAdded") }}
            </div>
          </div>

          <!-- Additional Costs -->
          <div>
            <div class="flex justify-content-between align-items-center mb-1">
              <h6 class="m-0 text-sm">
                <i class="pi pi-money-bill mr-1"></i>
                {{ $t("pos.additionalCosts") }}
              </h6>
              <Button
                :label="$t('pos.addCost')"
                icon="pi pi-plus"
                @click="$emit('add-additional-cost')"
                class="p-button-warning p-button-sm text-xs"
              />
            </div>

            <div
              v-if="invoiceAdditionalCosts.length > 0"
              class="adjustments-list"
            >
              <div
                v-for="cost in invoiceAdditionalCosts"
                :key="cost.id"
                class="adjustment-item p-1 mb-1"
              >
                <div class="grid">
                  <div class="col-12 md:col-5">
                    <InputText
                      :model-value="cost.name"
                      @update:modelValue="
                        (value) => onAdditionalCostUpdate(cost, 'name', value)
                      "
                      :placeholder="$t('pos.costName')"
                      class="w-full text-xs"
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
                      class="w-full text-xs"
                    />
                  </div>
                  <div class="col-12 md:col-2">
                    <Button
                      icon="pi pi-times"
                      @click="$emit('remove-additional-cost', cost.id)"
                      class="p-button-danger p-button-text p-button-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-color-secondary text-xs">
              {{ $t("pos.noAdditionalCosts") }}
            </div>
          </div>
        </div>

        <!-- Invoice Summary -->
        <div class="invoice-summary p-2">
          <h5 class="mt-0 mb-1">
            <i class="pi pi-calculator mr-1"></i>
            {{ $t("pos.summary") }}
          </h5>

          <div class="summary-details p-2 mb-2">
            <div class="flex justify-content-between mb-1 text-xs">
              <span>{{ $t("pos.subtotal") }}:</span>
              <span class="font-bold">{{
                formatCurrency(totals.subtotal)
              }}</span>
            </div>

            <div
              v-if="totals.discountTotal > 0"
              class="flex justify-content-between mb-1 text-xs text-red-500"
            >
              <span>{{ $t("pos.discount") }}:</span>
              <span class="font-bold"
                >-{{ formatCurrency(totals.discountTotal) }}</span
              >
            </div>

            <div
              v-if="totals.additionalCostsTotal > 0"
              class="flex justify-content-between mb-1 text-xs text-green-500"
            >
              <span>{{ $t("pos.additionalCosts") }}:</span>
              <span class="font-bold"
                >+{{ formatCurrency(totals.additionalCostsTotal) }}</span
              >
            </div>

            <div class="flex justify-content-between mb-1 text-xs">
              <span>{{ $t("pos.taxableAmount") }}:</span>
              <span class="font-bold">{{
                formatCurrency(totals.taxableAmount)
              }}</span>
            </div>

            <div class="flex justify-content-between mb-1 text-xs">
              <span>{{ $t("pos.tax") }} ({{ taxRate }}%):</span>
              <span class="font-bold">{{
                formatCurrency(totals.taxAmount)
              }}</span>
            </div>

            <Divider class="my-1" />

            <div class="flex justify-content-between text-sm font-bold">
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
            class="p-button-success w-full p-button-sm"
            :disabled="!canCheckout"
            :loading="processingCheckout"
          >
            <template #loading>
              <ProgressSpinner style="width: 16px; height: 16px" />
              <span class="ml-1 text-xs">{{ $t("pos.processing") }}</span>
            </template>
          </Button>

          <small class="block text-center text-color-secondary mt-1 text-xs">
            {{ $t("pos.checkoutHint") }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from "primevue/select";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Divider from "primevue/divider";
import ProgressSpinner from "primevue/progressspinner";

export default {
  name: "PosCartPanel",
  components: {
    Select,
    Button,
    Tag,
    Textarea,
    InputText,
    InputNumber,
    Divider,
    ProgressSpinner,
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
    invoiceNotes: {
      type: String,
      default: "",
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
    isDarkMode: {
      type: Boolean,
      default: false,
    },
    processingCheckout: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      warehouses: [],
      paymentMethods: [],
      posService: null,
      // ارتفاع إجمالي للبانل
      panelTotalHeight: 500,
      // مكونات محملة
      componentsLoaded: false,
    };
  },
  computed: {
    totals() {
      let subtotal = 0;

      this.cartItems.forEach((item) => {
        const price = this.parsePrice(
          item.has_discount ? item.price_after_discount : item.price
        );
        let itemSubtotal = price * (item.quantity || 1);

        if (item.additional_costs && Array.isArray(item.additional_costs)) {
          item.additional_costs.forEach((cost) => {
            itemSubtotal += this.parsePrice(cost.value) || 0;
          });
        }

        subtotal += itemSubtotal;
      });

      let discountTotal = 0;
      if (this.invoiceDiscounts && Array.isArray(this.invoiceDiscounts)) {
        this.invoiceDiscounts.forEach((discount) => {
          discountTotal += this.parsePrice(discount.value) || 0;
        });
      }

      let additionalCostsTotal = 0;
      if (
        this.invoiceAdditionalCosts &&
        Array.isArray(this.invoiceAdditionalCosts)
      ) {
        this.invoiceAdditionalCosts.forEach((cost) => {
          additionalCostsTotal += this.parsePrice(cost.value) || 0;
        });
      }

      const taxableAmount = subtotal - discountTotal + additionalCostsTotal;
      const taxAmount = (taxableAmount * this.taxRate) / 100;
      const grandTotal = taxableAmount + taxAmount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountTotal: parseFloat(discountTotal.toFixed(2)),
        additionalCostsTotal: parseFloat(additionalCostsTotal.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        taxableAmount: parseFloat(taxableAmount.toFixed(2)),
      };
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
    this.loadComponentsAsync();
    this.calculatePanelHeight();
  },
  watch: {
    cartItems: {
      handler() {
        this.calculatePanelHeight();
        this.$emit("totals-updated", this.totals);
      },
      deep: true,
      immediate: true,
    },
    "cartItems.additional_costs": {
      handler() {
        this.calculatePanelHeight();
        this.$emit("totals-updated", this.totals);
      },
      deep: true,
    },
  },
  methods: {
    async loadComponentsAsync() {
      try {
        const [cartItemModule, customerSelectorModule, serviceModule] =
          await Promise.all([
            import("./PosCartItem.vue"),
            import("./PosCustomerSelector.vue"),
            import("./PosService.js"),
          ]);

        this.$options.components.PosCartItem = cartItemModule.default;
        this.$options.components.PosCustomerSelector =
          customerSelectorModule.default;
        const PosService = serviceModule.default;

        this.posService = new PosService(this.companyId, this.branchId);
        await this.loadSelectionData();

        this.componentsLoaded = true;
      } catch (error) {
        console.error("Error loading components:", error);
      }
    },

    calculatePanelHeight() {
      if (this.cartItems.length === 0) {
        // ارتفاع أساسي عندما لا يوجد منتجات
        this.panelTotalHeight = 500;
        return;
      }

      // حساب ارتفاع المنتجات
      let productsHeight = 0;

      // ارتفاع كل منتج مع العمليات
      this.cartItems.forEach((item) => {
        // ارتفاع أساسي لكل منتج: 140px
        let itemHeight = 140;

        // إذا كان هناك عمليات، أضف مساحة إضافية
        if (item.additional_costs && item.additional_costs.length > 0) {
          // كل عملية تحتاج حوالي 75px
          itemHeight += item.additional_costs.length * 75;
        }

        productsHeight += itemHeight;
      });

      // ارتفاع ثابت للأجزاء الأخرى (الهيدر + الفاتورة)
      const fixedHeight = 50 + 450; // 50px للهيدر، 450px للفاتورة

      // الارتفاع الإجمالي = المنتجات + الأجزاء الثابتة + هامش
      const calculatedHeight = productsHeight + fixedHeight + 20;

      // الحد الأدنى: 500px، الحد الأقصى: 1000px
      this.panelTotalHeight = Math.min(Math.max(calculatedHeight, 500), 1000);
    },

    parsePrice(price) {
      if (!price && price !== 0) return 0;
      if (typeof price === "string") {
        return parseFloat(price.replace(/,/g, ""));
      }
      return parseFloat(price);
    },

    async loadSelectionData() {
      try {
        this.warehouses = await this.posService.getWarehouses();
        this.paymentMethods = await this.posService.getPaymentMethods();
      } catch (error) {
        console.error("Error loading selection data:", error);
      }
    },

    onWarehouseChange(value) {
      const warehouse = this.warehouses.find((w) => w.id === value) || null;
      this.$emit("warehouse-change", warehouse);
    },

    onPaymentMethodChange(value) {
      const method = this.paymentMethods.find((p) => p.id === value) || null;
      this.$emit("payment-method-change", method);
    },

    onInvoiceNotesChange(value) {
      this.$emit("invoice-notes-change", value);
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

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.pos-cart-panel {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: height 0.3s ease;
  min-height: 500px;
  max-height: 1000px;
}

.cart-header {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

/* Main Scroll Container - سكرول رئيسي */
.main-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Cart Items Section - بدون سكرول خاص */
.cart-items-section {
  background: white;
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}

.cart-items-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item-wrapper {
  flex-shrink: 0;
}

.empty-cart-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 150px;
}

.empty-content {
  text-align: center;
}

/* Invoice Details Section */
.invoice-details-section {
  padding: 8px;
  background: #f8f9fa;
  min-height: 450px;
}

.selection-card,
.adjustments-section,
.invoice-summary {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-bottom: 8px;
}

.invoice-summary {
  border-color: #28a745;
  background: #f8fff9;
}

.summary-details {
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

/* Adjustments Items */
.adjustment-item {
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

/* سكرول رئيسي فقط */
.main-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.main-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.main-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Ensure everything fits */
:deep(.p-select),
:deep(.p-inputtext),
:deep(.p-inputtextarea),
:deep(.p-inputnumber) {
  font-size: 12px !important;
}

:deep(.p-button) {
  font-size: 12px !important;
  padding: 5px 10px !important;
}

:deep(.p-button-sm) {
  padding: 4px 8px !important;
  font-size: 11px !important;
}

:deep(.p-tag) {
  font-size: 10px !important;
  padding: 1px 4px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .pos-cart-panel {
    min-height: 400px;
    max-height: 800px;
  }

  .invoice-details-section {
    min-height: 400px;
  }
}

/* Fix for small sizes */
:deep(.p-inputnumber-input) {
  font-size: 12px !important;
  padding: 4px !important;
}

:deep(.p-inputnumber-button) {
  width: 24px !important;
  height: 24px !important;
}

:deep(.p-divider) {
  margin: 4px 0 !important;
}

/* تحسينات للعرض */
.selection-card h5,
.adjustments-section h6,
.invoice-summary h5 {
  color: #495057;
  font-weight: 600;
}

.text-red-500 {
  color: #dc3545 !important;
}

.text-green-500 {
  color: #28a745 !important;
}

.text-primary {
  color: #007bff !important;
}

.border-round {
  border-radius: 6px !important;
}

.p-error {
  color: #dc3545 !important;
  font-size: 11px !important;
}

.grid {
  margin: 0 -0.25rem;
}

.grid > div {
  padding: 0 0.25rem;
}

/* تأثير سلس لتغيير الارتفاع */
.pos-cart-panel {
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cart-item-wrapper {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
