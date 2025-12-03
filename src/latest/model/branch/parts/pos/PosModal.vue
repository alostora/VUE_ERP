<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :style="dialogStyle"
    :maximizable="false"
    :draggable="false"
    :resizable="false"
    @hide="closeModal"
    class="pos-modal"
    :class="{ 'maximized-dialog': isMaximized }"
  >
    <!-- Simple header -->
    <template #header>
      <span class="text-xl font-bold text-white dark:text-gray-100">{{
        $t("pos.title")
      }}</span>
    </template>

    <!-- POS Toolbar -->
    <div
      class="pos-toolbar flex justify-content-between align-items-center mb-3 p-3 surface-ground border-round"
      :class="{ 'dark-surface': isDarkMode }"
    >
      <div class="flex align-items-center gap-2">
        <Button
          :label="$t('pos.holdInvoice')"
          icon="pi pi-pause"
          @click="holdCurrentInvoice"
          class="p-button-warning"
          :class="{ 'dark-button-warning': isDarkMode }"
          :disabled="cartItems.length === 0"
        />
        <Button
          :label="$t('pos.viewHeld')"
          icon="pi pi-list"
          @click="showHeldInvoices"
          class="p-button-secondary"
          :class="{ 'dark-button-secondary': isDarkMode }"
        />
        <Button
          :label="$t('pos.switchLayout')"
          :icon="layoutIcon"
          @click="toggleLayout"
          class="p-button-help"
          :class="{ 'dark-button-help': isDarkMode }"
        />
      </div>

      <div class="flex align-items-center gap-2">
        <span class="font-bold text-color dark:text-gray-300">
          {{ $t("pos.invoiceNumber") }}: {{ invoiceNumber }}
        </span>

        <!-- Maximize/Minimize Button -->
        <Button
          :icon="
            isMaximized ? 'pi pi-window-minimize' : 'pi pi-window-maximize'
          "
          @click="toggleMaximize"
          class="p-button-rounded custom-maximize-btn"
          :class="{ 'dark-button': isDarkMode }"
          v-tooltip.top="isMaximized ? $t('pos.minimize') : $t('pos.maximize')"
        />

        <!-- Close Button -->
        <Button
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-rounded custom-close-btn"
          :class="{ 'dark-close-btn': isDarkMode }"
          v-tooltip.top="$t('common.close')"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div :class="['pos-main-content', layoutClass]">
      <!-- Products Panel -->
      <PosProductsPanel
        ref="productsPanel"
        :company-id="companyId"
        :branch-id="branchId"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        @add-to-cart="addToCart"
        @category-change="selectedCategory = $event"
        @search="searchQuery = $event"
        :class="[
          layoutClass.includes('horizontal')
            ? 'products-panel-horizontal'
            : 'products-panel-vertical',
          { 'dark-panel': isDarkMode },
        ]"
      />

      <!-- Cart Panel -->
      <PosCartPanel
        ref="cartPanel"
        :cart-items="cartItems"
        :selected-customer="selectedCustomer"
        :selected-warehouse="selectedWarehouse?.id"
        :selected-payment-method="selectedPaymentMethod?.id"
        :invoice-discounts="invoiceDiscounts"
        :invoice-additional-costs="invoiceAdditionalCosts"
        :tax-rate="taxRate"
        @update-item="updateCartItem"
        @remove-item="removeCartItem"
        @customer-change="selectedCustomer = $event"
        @warehouse-change="onWarehouseChange"
        @payment-method-change="onPaymentMethodChange"
        @add-discount="addInvoiceDiscount"
        @update-discount="onDiscountUpdate"
        @remove-discount="removeInvoiceDiscount"
        @add-additional-cost="addInvoiceAdditionalCost"
        @update-additional-cost="onAdditionalCostUpdate"
        @remove-additional-cost="removeInvoiceAdditionalCost"
        @checkout="processCheckout"
        @clear-cart="clearCart"
        :class="[
          layoutClass.includes('horizontal')
            ? 'cart-panel-horizontal'
            : 'cart-panel-vertical',
          { 'dark-panel': isDarkMode },
        ]"
      />
    </div>

    <!-- Held Invoices Modal -->
    <PosHeldInvoices
      ref="heldInvoicesModal"
      :company-id="companyId"
      :branch-id="branchId"
      @load-invoice="loadHeldInvoice"
    />

    <!-- Receipt Modal -->
    <Dialog
      v-model:visible="showReceipt"
      :header="$t('pos.receipt')"
      :modal="true"
      :style="{ width: '400px' }"
      :class="{ 'dark-dialog': isDarkMode }"
    >
      <PosReceipt
        :invoice="currentInvoice"
        :company-id="companyId"
        :branch-id="branchId"
      />
      <template #footer>
        <Button
          :label="$t('pos.printReceipt')"
          icon="pi pi-print"
          @click="printReceipt"
          class="p-button-primary"
          :class="{ 'dark-button-primary': isDarkMode }"
        />
        <Button
          :label="$t('common.close')"
          @click="showReceipt = false"
          class="p-button-text"
          :class="{ 'dark-button-text': isDarkMode }"
        />
      </template>
    </Dialog>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="loading-overlay"
      :class="{ 'dark-overlay': isDarkMode }"
    >
      <ProgressSpinner />
      <p class="mt-2 text-color dark:text-gray-300">{{ loadingMessage }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Tooltip from "primevue/tooltip";

import PosProductsPanel from "./PosProductsPanel.vue";
import PosCartPanel from "./PosCartPanel.vue";
import PosHeldInvoices from "./PosHeldInvoices.vue";
import PosReceipt from "./PosReceipt.vue";
import PosService from "./PosService.js";

export default {
  name: "PosModal",
  components: {
    Dialog,
    Button,
    ProgressSpinner,
    PosProductsPanel,
    PosCartPanel,
    PosHeldInvoices,
    PosReceipt,
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
      isMaximized: false,
      layout: "horizontal",
      isDarkMode: false,

      // Dialog dimensions
      dialogWidth: "95vw",
      dialogHeight: "90vh",
      originalWidth: "95vw",
      originalHeight: "90vh",

      // Cart data
      cartItems: [],
      selectedCustomer: null,
      selectedWarehouse: null,
      selectedPaymentMethod: null,
      invoiceDiscounts: [],
      invoiceAdditionalCosts: [],

      // Products filtering
      selectedCategory: null,
      searchQuery: "",

      // Tax
      taxRate: 14,

      // Invoice
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      currentInvoice: null,
      showReceipt: false,

      // Loading states
      loading: false,
      loadingMessage: "",

      // Service
      posService: null,
    };
  },
  computed: {
    layoutClass() {
      return this.layout === "horizontal"
        ? "horizontal-layout"
        : "vertical-layout";
    },
    layoutIcon() {
      return this.layout === "horizontal"
        ? "pi pi-arrow-right-arrow-left"
        : "pi pi-arrow-down-arrow-up";
    },
    dialogStyle() {
      if (this.isMaximized) {
        return {
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          top: "0",
          left: "0",
          margin: "0",
          position: "fixed",
        };
      } else {
        return {
          width: this.dialogWidth,
          height: this.dialogHeight,
          maxWidth: "95vw",
          maxHeight: "90vh",
        };
      }
    },
  },
  created() {
    this.posService = new PosService(this.companyId, this.branchId);
    this.initializeData();
    this.checkDarkMode();
  },
  mounted() {
    this.originalWidth = this.dialogWidth;
    this.originalHeight = this.dialogHeight;

    // Listen for dark mode changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", this.checkDarkMode);
  },
  beforeDestroy() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", this.checkDarkMode);
  },
  methods: {
    checkDarkMode() {
      this.isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      console.log("Dark mode:", this.isDarkMode);
    },

    openModal() {
      this.visible = true;
      this.resetCart();
      this.generateInvoiceNumber();
      this.isMaximized = false;
      this.checkDarkMode();
    },

    closeModal() {
      if (this.cartItems.length > 0) {
        if (confirm(this.$t("pos.confirmCloseWithItems"))) {
          this.visible = false;
          this.resetCart();
        }
      } else {
        this.visible = false;
        this.resetCart();
      }
    },

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      console.log("Maximize toggled:", this.isMaximized);

      this.$nextTick(() => {
        window.dispatchEvent(new Event("resize"));
        if (this.$refs.dialog) {
          this.$refs.dialog.$el.style.transform = "none";
        }
      });
    },

    toggleLayout() {
      this.layout = this.layout === "horizontal" ? "vertical" : "horizontal";
      localStorage.setItem("pos_layout_preference", this.layout);
    },

    async initializeData() {
      const savedLayout = localStorage.getItem("pos_layout_preference");
      if (savedLayout) {
        this.layout = savedLayout;
      }
      this.selectedWarehouse = { id: "warehouse1", name: "Main Warehouse" };
    },

    generateInvoiceNumber() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      this.invoiceNumber = `INV-${timestamp.toString().slice(-6)}-${random}`;
    },

    // Cart Methods
    addToCart(product) {
      const existingItem = this.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        this.cartItems.push({
          ...product,
          quantity: 1,
          measurement_unit_id:
            product.product?.sales_measurement_unit?.id || null,
          additional_costs: [],
        });
      }

      this.$toast.add({
        severity: "success",
        summary: this.$t("pos.productAdded"),
        detail: `${product.name} ${this.$t("pos.addedToCart")}`,
        life: 2000,
      });
    },

    updateCartItem(itemId, updates) {
      const index = this.cartItems.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        this.cartItems[index] = { ...this.cartItems[index], ...updates };
      }
    },

    removeCartItem(itemId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    },

    clearCart() {
      this.cartItems = [];
      this.invoiceDiscounts = [];
      this.invoiceAdditionalCosts = [];
      this.selectedCustomer = null;
      this.selectedPaymentMethod = null;
    },

    // Invoice Discounts & Additional Costs
    addInvoiceDiscount() {
      this.invoiceDiscounts.push({
        id: `disc_${Date.now()}`,
        name: "",
        value: 0,
      });
    },

    removeInvoiceDiscount(discountId) {
      this.invoiceDiscounts = this.invoiceDiscounts.filter(
        (d) => d.id !== discountId
      );
    },

    addInvoiceAdditionalCost() {
      this.invoiceAdditionalCosts.push({
        id: `cost_${Date.now()}`,
        name: "",
        value: 0,
      });
    },

    removeInvoiceAdditionalCost(costId) {
      this.invoiceAdditionalCosts = this.invoiceAdditionalCosts.filter(
        (c) => c.id !== costId
      );
    },

    // Hold Invoice
    holdCurrentInvoice() {
      if (this.cartItems.length === 0) {
        this.$toast.add({
          severity: "warn",
          summary: this.$t("pos.emptyCart"),
          detail: this.$t("pos.addItemsBeforeHold"),
          life: 3000,
        });
        return;
      }

      const heldInvoice = {
        id: `held_${Date.now()}`,
        cartItems: [...this.cartItems],
        customer: this.selectedCustomer,
        warehouse: this.selectedWarehouse,
        discounts: [...this.invoiceDiscounts],
        additionalCosts: [...this.invoiceAdditionalCosts],
        heldAt: new Date().toISOString(),
        invoiceNumber: this.invoiceNumber,
      };

      this.posService.saveHeldInvoice(heldInvoice);

      this.$toast.add({
        severity: "success",
        summary: this.$t("pos.invoiceHeld"),
        detail: this.$t("pos.invoiceSavedForLater"),
        life: 3000,
      });

      this.clearCart();
      this.generateInvoiceNumber();
    },

    showHeldInvoices() {
      this.$refs.heldInvoicesModal.openModal();
    },

    loadHeldInvoice(invoice) {
      this.cartItems = invoice.cartItems || [];
      this.selectedCustomer = invoice.customer || null;
      this.selectedWarehouse = invoice.warehouse || null;
      this.invoiceDiscounts = invoice.discounts || [];
      this.invoiceAdditionalCosts = invoice.additionalCosts || [];
      this.invoiceNumber = invoice.invoiceNumber || this.invoiceNumber;

      this.$refs.heldInvoicesModal.closeModal();

      this.$toast.add({
        severity: "success",
        summary: this.$t("pos.invoiceLoaded"),
        detail: this.$t("pos.heldInvoiceLoaded"),
        life: 3000,
      });
    },

    // Checkout
    async processCheckout() {
      if (this.cartItems.length === 0) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.emptyCart"),
          detail: this.$t("pos.addItemsBeforeCheckout"),
          life: 3000,
        });
        return;
      }

      if (!this.selectedWarehouse) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.warehouseRequired"),
          detail: this.$t("pos.selectWarehouseFirst"),
          life: 3000,
        });
        return;
      }

      if (!this.selectedPaymentMethod) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.paymentMethodRequired"),
          detail: this.$t("pos.selectPaymentMethodFirst"),
          life: 3000,
        });
        return;
      }

      this.loading = true;
      this.loadingMessage = this.$t("pos.processingPayment");

      try {
        const finalProducts = this.cartItems.map((item) => ({
          final_product_id: item.id,
          measurement_unit_id:
            item.measurement_unit_id ||
            item.product?.sales_measurement_unit?.id,
          quantity: item.quantity || 1,
        }));

        const invoiceData = {
          warehouse_id: this.selectedWarehouse.id,
          contact_id: this.selectedCustomer?.id || null,
          payment_method_id: this.selectedPaymentMethod.id,
          details: this.$t("pos.posSale"),
          final_products: finalProducts,
          additional_costs: this.invoiceAdditionalCosts.map((cost) => ({
            name: cost.name,
            value: parseFloat(cost.value),
          })),
          discounts: this.invoiceDiscounts.map((discount) => ({
            name: discount.name,
            value: parseFloat(discount.value),
          })),
        };

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const totals = this.posService.calculateInvoiceTotals(
          this.cartItems,
          this.invoiceDiscounts,
          this.invoiceAdditionalCosts,
          this.taxRate
        );

        this.currentInvoice = {
          ...invoiceData,
          id: `inv_${Date.now()}`,
          invoice_number: this.invoiceNumber,
          created_at: new Date().toISOString(),
          customer: this.selectedCustomer,
          warehouse: this.selectedWarehouse,
          payment_method: this.selectedPaymentMethod,
          items: this.cartItems,
          totals: totals,
        };

        this.showReceipt = true;
        this.clearCart();
        this.generateInvoiceNumber();

        this.$toast.add({
          severity: "success",
          summary: this.$t("pos.paymentSuccessful"),
          detail: this.$t("pos.invoiceCreatedSuccessfully"),
          life: 3000,
        });
      } catch (error) {
        console.error("Checkout error:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.paymentFailed"),
          detail: error.message || this.$t("pos.checkoutError"),
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    printReceipt() {
      const printContent = document.querySelector(".pos-receipt").innerHTML;
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.$t("pos.receipt")}</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 12px; background: ${
                this.isDarkMode ? "#1a1a1a" : "#ffffff"
              }; color: ${this.isDarkMode ? "#e0e0e0" : "#000000"}; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-items { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .receipt-items th, .receipt-items td { border: 1px solid ${
                this.isDarkMode ? "#444" : "#ddd"
              }; padding: 5px; }
              .receipt-totals { margin-top: 20px; text-align: right; }
              .receipt-footer { margin-top: 30px; text-align: center; font-size: 10px; }
              @media print {
                body { margin: 0; padding: 10px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer;">
                ${this.$t("pos.print")}
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; cursor: pointer; margin-left: 10px;">
                ${this.$t("common.close")}
              </button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    },

    resetCart() {
      this.cartItems = [];
      this.selectedCustomer = null;
      this.selectedPaymentMethod = null;
      this.invoiceDiscounts = [];
      this.invoiceAdditionalCosts = [];
      this.selectedCategory = null;
      this.searchQuery = "";
    },

    onWarehouseChange(warehouse) {
      this.selectedWarehouse = warehouse;
    },

    onPaymentMethodChange(paymentMethod) {
      this.selectedPaymentMethod = paymentMethod;
    },

    onDiscountUpdate(updatedDiscount) {
      const index = this.invoiceDiscounts.findIndex(
        (d) => d.id === updatedDiscount.id
      );
      if (index !== -1) {
        this.invoiceDiscounts = [
          ...this.invoiceDiscounts.slice(0, index),
          updatedDiscount,
          ...this.invoiceDiscounts.slice(index + 1),
        ];
      }
    },

    onAdditionalCostUpdate(updatedCost) {
      const index = this.invoiceAdditionalCosts.findIndex(
        (c) => c.id === updatedCost.id
      );
      if (index !== -1) {
        this.invoiceAdditionalCosts = [
          ...this.invoiceAdditionalCosts.slice(0, index),
          updatedCost,
          ...this.invoiceAdditionalCosts.slice(index + 1),
        ];
      }
    },
  },
};
</script>

<style scoped>
.pos-modal {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
}

.pos-modal.maximized-dialog {
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* POS Toolbar - Light Mode */
.pos-toolbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.pos-toolbar.dark-surface {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  color: #e2e8f0;
  border: 1px solid #4a5568;
}

/* Horizontal Layout */
.horizontal-layout {
  display: flex;
  height: calc(100% - 80px);
  gap: 1rem;
  margin: 0 1rem;
}

/* Vertical Layout */
.vertical-layout {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px);
  gap: 1rem;
  margin: 0 1rem;
}

/* Products Panel */
.products-panel-horizontal {
  flex: 3;
  min-width: 0;
}

.products-panel-horizontal.dark-panel {
  background: #1a202c !important;
}

.cart-panel-horizontal {
  flex: 2;
  min-width: 400px;
  max-width: 500px;
}

.cart-panel-horizontal.dark-panel {
  background: #1a202c !important;
}

.products-panel-vertical {
  flex: 2;
  min-height: 300px;
}

.products-panel-vertical.dark-panel {
  background: #1a202c !important;
}

.cart-panel-vertical {
  flex: 3;
  min-height: 400px;
}

.cart-panel-vertical.dark-panel {
  background: #1a202c !important;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-overlay.dark-overlay {
  background: rgba(26, 32, 44, 0.95);
}

.loading-overlay.dark-overlay .p-progress-spinner-circle {
  stroke: #667eea !important;
}

/* Custom button styles for visibility */
.custom-maximize-btn,
.custom-close-btn {
  width: 40px !important;
  height: 40px !important;
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
}

.custom-maximize-btn:hover,
.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.1) !important;
}

.custom-maximize-btn:active,
.custom-close-btn:active {
  transform: scale(0.95) !important;
}

/* Dark mode button styles */
.custom-maximize-btn.dark-button,
.custom-close-btn.dark-close-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #e2e8f0 !important;
}

.custom-maximize-btn.dark-button:hover,
.custom-close-btn.dark-close-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.custom-close-btn.dark-close-btn {
  color: #fc8181 !important;
}

/* Dialog header styling */
:deep(.p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 1rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

/* Dark mode dialog header */
:deep(.dark-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Hide default header icons */
:deep(.p-dialog .p-dialog-header-icons) {
  display: none !important;
}

/* Dialog content area */
:deep(.p-dialog-content) {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  transition: background-color 0.3s ease;
}

/* Dark mode dialog content */
:deep(.dark-dialog .p-dialog-content) {
  background-color: #1a202c !important;
  color: #e2e8f0 !important;
}

/* Ensure proper spacing */
:deep(.p-dialog .p-dialog-content) {
  flex: 1;
  overflow: auto;
  padding-top: 0.5rem !important;
}

/* Maximized dialog styles */
:deep(.maximized-dialog .p-dialog) {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
}

:deep(.maximized-dialog .p-dialog-content) {
  height: calc(100vh - 60px) !important;
}

/* Fix for dialog positioning */
:deep(.p-dialog) {
  transition: all 0.3s ease !important;
}

/* Dark mode button overrides */
:deep(.dark-button-warning) {
  background-color: #d69e2e !important;
  border-color: #d69e2e !important;
  color: white !important;
}

:deep(.dark-button-warning:hover) {
  background-color: #b7791f !important;
  border-color: #b7791f !important;
}

:deep(.dark-button-secondary) {
  background-color: #718096 !important;
  border-color: #718096 !important;
  color: white !important;
}

:deep(.dark-button-secondary:hover) {
  background-color: #4a5568 !important;
  border-color: #4a5568 !important;
}

:deep(.dark-button-help) {
  background-color: #805ad5 !important;
  border-color: #805ad5 !important;
  color: white !important;
}

:deep(.dark-button-help:hover) {
  background-color: #6b46c1 !important;
  border-color: #6b46c1 !important;
}

:deep(.dark-button-primary) {
  background-color: #4299e1 !important;
  border-color: #4299e1 !important;
  color: white !important;
}

:deep(.dark-button-primary:hover) {
  background-color: #3182ce !important;
  border-color: #3182ce !important;
}

:deep(.dark-button-text) {
  color: #e2e8f0 !important;
}

:deep(.dark-button-text:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
