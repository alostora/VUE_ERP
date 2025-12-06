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
        :company-id="companyId"
        :branch-id="branchId"
        :is-dark-mode="isDarkMode"
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
        @totals-updated="handleTotalsUpdate"
        :class="[
          layoutClass.includes('horizontal')
            ? 'cart-panel-horizontal'
            : 'cart-panel-vertical',
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

    <!-- Print Options Modal -->
    <Dialog
      v-model:visible="showPrintOptions"
      :header="$t('pos.invoiceCompleted')"
      :modal="true"
      :style="{ width: '450px' }"
      :closable="false"
      class="print-dialog"
    >
      <div class="print-options text-center p-4">
        <i class="pi pi-check-circle text-5xl text-green-500 mb-3"></i>
        <h3 class="mb-2">{{ $t("pos.paymentSuccessful") }}</h3>
        <p class="text-color-secondary mb-4">
          {{ $t("pos.invoiceCreatedSuccessfully") }}
        </p>

        <div class="invoice-details mb-4 p-3 border-round bg-gray-50">
          <div class="flex justify-content-between mb-2">
            <span class="font-bold">{{ $t("pos.invoiceNumber") }}:</span>
            <span class="font-bold text-primary">{{
              currentInvoice?.invoice_number || invoiceNumber
            }}</span>
          </div>
          <div class="flex justify-content-between mb-2">
            <span class="font-bold">{{ $t("pos.total") }}:</span>
            <span class="font-bold text-primary text-lg">{{
              formatCurrency(currentTotals?.grandTotal || 0)
            }}</span>
          </div>
          <div class="flex justify-content-between">
            <span>{{ $t("pos.date") }}:</span>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-column gap-2 w-full">
          <Button
            :label="$t('pos.printAndFinish')"
            icon="pi pi-print"
            @click="printAndFinish"
            class="p-button-success mb-2"
          />
          <Button
            :label="$t('pos.finishOnly')"
            icon="pi pi-check"
            @click="finishOnly"
            class="p-button-primary p-button-outlined"
          />
          <!-- Add this cancel button -->
          <Button
            :label="$t('pos.cancel')"
            icon="pi pi-times"
            @click="showPrintOptions = false"
            class="p-button-secondary p-button-text mt-2"
          />
        </div>
      </template>
    </Dialog>

    <!-- Receipt Modal for Printing -->
    <Dialog
      v-model:visible="showReceipt"
      :modal="true"
      :style="{ width: '420px' }"
      :draggable="true"
      :resizable="true"
      class="receipt-dialog"
      id="receiptDialog"
    >
      <template #header>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-receipt text-primary"></i>
          <span class="text-lg font-bold">{{ $t("pos.receipt") }}</span>
          <Tag value="PAID" severity="success" class="ml-2" />
        </div>
      </template>

      <div class="receipt-container" ref="receiptContainer">
        <PosReceipt
          :invoice="currentInvoice"
          :company-id="companyId"
          :branch-id="branchId"
          :is-dark-mode="isDarkMode"
        />
      </div>

      <template #footer>
        <div class="flex justify-content-between align-items-center w-full">
          <div class="text-xs text-color-secondary">
            <i class="pi pi-info-circle mr-1"></i>
            {{ $t("pos.printHint") }}
          </div>
          <div class="flex gap-2">
            <Button
              :label="$t('pos.downloadPDF')"
              icon="pi pi-download"
              @click="downloadReceipt"
              class="p-button-outlined p-button-secondary"
              :class="{ 'dark-button-outlined': isDarkMode }"
            />
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
          </div>
        </div>
      </template>
    </Dialog>

    <!-- Loading Overlay -->
    <div
      v-if="processingCheckout"
      class="checkout-overlay"
      :class="{ 'dark-overlay': isDarkMode }"
    >
      <div class="checkout-loading text-center">
        <ProgressSpinner style="width: 60px; height: 60px" />
        <h3 class="mt-3 mb-1">{{ $t("pos.processingPayment") }}</h3>
        <p class="text-color-secondary">{{ $t("pos.pleaseWait") }}</p>

        <div class="mt-4 p-3 bg-surface border-round" style="max-width: 300px">
          <div class="flex justify-content-between mb-2">
            <span>{{ $t("pos.items") }}:</span>
            <span class="font-bold">{{ cartItems.length }}</span>
          </div>
          <div class="flex justify-content-between mb-2">
            <span>{{ $t("pos.total") }}:</span>
            <span class="font-bold text-primary">{{
              formatCurrency(currentTotals?.grandTotal || 0)
            }}</span>
          </div>
          <Divider />
          <div class="text-xs text-color-secondary">
            <i class="pi pi-info-circle mr-1"></i>
            {{ $t("pos.processingHint") }}
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
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
    Divider,
    Tag,
    PosProductsPanel, // أضف هنا
    PosCartPanel, // أضف هنا
    PosHeldInvoices, // أضف هنا
    PosReceipt, // أضف هنا
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
      currentTotals: null,

      // Products filtering
      selectedCategory: null,
      searchQuery: "",

      // Tax
      taxRate: 14,

      // Invoice
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      currentInvoice: null,
      showReceipt: false,
      showPrintOptions: false,

      // Loading states
      processingCheckout: false,
      loadingMessage: "",

      // Service and components
      posService: null,
      posProductsPanel: null,
      posCartPanel: null,
      posHeldInvoices: null,
      posReceipt: null,
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
    },

    async openModal() {
      this.visible = true;
      this.resetCart();
      this.generateInvoiceNumber();
      this.isMaximized = false;
      this.checkDarkMode();

      this.posService = new PosService(this.companyId, this.branchId);

      // Initialize data when modal opens
      await this.initializeData();
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

      this.$nextTick(() => {
        window.dispatchEvent(new Event("resize"));
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

      // Load initial warehouses and payment methods
      try {
        const warehouses = await this.posService.getWarehouses();
        if (warehouses.length > 0) {
          this.selectedWarehouse = warehouses[0];
        }

        const paymentMethods = await this.posService.getPaymentMethods();
        if (paymentMethods.length > 0) {
          this.selectedPaymentMethod = paymentMethods[0];
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    },

    generateInvoiceNumber() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      this.invoiceNumber = `INV-${timestamp.toString().slice(-6)}-${random}`;
    },

    // Cart Methods
    addToCart(product) {
      const existingItemIndex = this.cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        this.cartItems[existingItemIndex].quantity += 1;
        this.cartItems = [...this.cartItems];
      } else {
        const newItem = {
          ...product,
          quantity: 1,
          measurement_unit_id:
            product.product?.sales_measurement_unit?.id || null,
          additional_costs: [],
          notes: "",
        };
        this.cartItems = [...this.cartItems, newItem];
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
        this.cartItems = [...this.cartItems];
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
      this.currentTotals = null;
    },

    handleTotalsUpdate(totals) {
      this.currentTotals = totals;
    },

    // Invoice Discounts & Additional Costs
    addInvoiceDiscount() {
      this.invoiceDiscounts.push({
        id: `disc_${Date.now()}`,
        name: this.$t("pos.discount"),
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
        name: this.$t("pos.additionalCosts"),
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
      if (this.$refs.heldInvoicesModal) {
        this.$refs.heldInvoicesModal.openModal();
      }
    },

    loadHeldInvoice(invoice) {
      this.cartItems = invoice.cartItems || [];
      this.selectedCustomer = invoice.customer || null;
      this.selectedWarehouse = invoice.warehouse || null;
      this.invoiceDiscounts = invoice.discounts || [];
      this.invoiceAdditionalCosts = invoice.additionalCosts || [];
      this.invoiceNumber = invoice.invoiceNumber || this.invoiceNumber;

      if (this.$refs.heldInvoicesModal) {
        this.$refs.heldInvoicesModal.closeModal();
      }

      this.$toast.add({
        severity: "success",
        summary: this.$t("pos.invoiceLoaded"),
        detail: this.$t("pos.heldInvoiceLoaded"),
        life: 3000,
      });
    },

    // Checkout and Print
    async processCheckout() {
      if (!this.validateCheckoutData()) {
        return;
      }

      this.processingCheckout = true;

      try {
        // Create invoice object
        this.currentInvoice = this.createInvoiceObject();

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show print options
        this.showPrintOptions = true;
      } catch (error) {
        console.error("Checkout error:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.paymentFailed"),
          detail: error.message || this.$t("pos.checkoutError"),
          life: 3000,
        });
      } finally {
        this.processingCheckout = false;
      }
    },

    validateCheckoutData() {
      if (this.cartItems.length === 0) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.emptyCart"),
          detail: this.$t("pos.addItemsBeforeCheckout"),
          life: 3000,
        });
        return false;
      }

      if (!this.selectedWarehouse) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.warehouseRequired"),
          detail: this.$t("pos.selectWarehouseFirst"),
          life: 3000,
        });
        return false;
      }

      if (!this.selectedPaymentMethod) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.paymentMethodRequired"),
          detail: this.$t("pos.selectPaymentMethodFirst"),
          life: 3000,
        });
        return false;
      }

      return true;
    },

    createInvoiceObject() {
      return {
        id: `inv_${Date.now()}`,
        invoice_number: this.invoiceNumber,
        created_at: new Date().toISOString(),
        status: "completed",
        payment_status: "paid",
        customer: this.selectedCustomer,
        warehouse: this.selectedWarehouse,
        payment_method: this.selectedPaymentMethod,
        items: this.cartItems.map((item) => ({
          ...item,
          total: this.calculateItemTotal(item),
        })),
        discounts: this.invoiceDiscounts.filter((d) => d.value > 0),
        additional_costs: this.invoiceAdditionalCosts.filter(
          (c) => c.value > 0
        ),
        totals: this.currentTotals,
        taxRate: this.taxRate,
        details: "POS Sale",
        cashier: "System User",
      };
    },

    calculateItemTotal(item) {
      const price = this.parsePrice(
        item.has_discount ? item.price_after_discount : item.price
      );
      let total = price * (item.quantity || 1);

      if (item.additional_costs && Array.isArray(item.additional_costs)) {
        item.additional_costs.forEach((cost) => {
          total += this.parsePrice(cost.value) || 0;
        });
      }

      return parseFloat(total.toFixed(2));
    },

    parsePrice(price) {
      if (!price && price !== 0) return 0;
      if (typeof price === "string") {
        return parseFloat(price.replace(/,/g, ""));
      }
      return parseFloat(price);
    },

    // Print Functions
    printAndFinish() {
      this.showPrintOptions = false;
      this.showReceipt = true;
      this.$nextTick(() => {
        this.printReceipt();
        setTimeout(() => {
          this.finishSale();
        }, 1000);
      });
    },

    finishOnly() {
      this.showPrintOptions = false;
      this.finishSale();
    },

    finishSale() {
      this.clearCart();
      this.generateInvoiceNumber();
      this.showReceipt = false;

      this.$toast.add({
        severity: "success",
        summary: this.$t("pos.saleCompleted"),
        detail: this.$t("pos.readyForNewSale"),
        life: 3000,
      });
    },

    printReceipt() {
      const receiptElement = this.$refs.receiptContainer;
      if (!receiptElement) {
        console.error("Receipt container not found");
        return;
      }

      const printContent = receiptElement.innerHTML;
      const originalContent = document.body.innerHTML;

      const printWindow = window.open("", "_blank", "width=800,height=600");

      const styles = `
        <style>
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 10px;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: #fff;
          }
          .pos-receipt {
            max-width: 380px;
            margin: 0 auto;
            padding: 15px;
            border: 1px solid #000;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .receipt-header h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .receipt-items {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .receipt-items th {
            background: #f0f0f0;
            font-weight: bold;
            padding: 5px;
            border: 1px solid #000;
            text-align: left;
          }
          .receipt-items td {
            padding: 5px;
            border: 1px solid #000;
          }
          .receipt-totals {
            margin-top: 15px;
            padding: 10px;
            background: #f8f8f8;
            border: 1px solid #000;
          }
          .receipt-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
            .pos-receipt {
              border: none !important;
              box-shadow: none !important;
            }
          }
        </style>
      `;

      const buttons = `
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; margin-right: 10px;">
            ${this.$t("pos.print")}
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; cursor: pointer;">
            ${this.$t("common.close")}
          </button>
        </div>
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>${this.$t("pos.receipt")} - ${
        this.currentInvoice?.invoice_number
      }</title>
            ${styles}
          </head>
          <body>
            ${printContent}
            ${buttons}
            <script>
              window.onload = function() {
                // Auto print after 500ms
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            <\/script>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
    },

    downloadReceipt() {
      const receiptElement = this.$refs.receiptContainer;
      if (!receiptElement) {
        console.error("Receipt container not found");
        return;
      }

      const printContent = receiptElement.innerHTML;
      const blob = new Blob(
        [
          `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .pos-receipt { max-width: 400px; margin: 0 auto; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `,
        ],
        { type: "text/html" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${
        this.currentInvoice?.invoice_number || "invoice"
      }.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    formatDate(date) {
      if (!date) return new Date().toLocaleString();
      if (typeof date === "string") {
        date = new Date(date);
      }
      return date.toLocaleString();
    },

    resetCart() {
      this.cartItems = [];
      this.selectedCustomer = null;
      this.selectedPaymentMethod = null;
      this.invoiceDiscounts = [];
      this.invoiceAdditionalCosts = [];
      this.selectedCategory = null;
      this.searchQuery = "";
      this.currentTotals = null;
      this.currentInvoice = null;
      this.showReceipt = false;
      this.showPrintOptions = false;
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
  overflow: hidden;
}

.cart-panel-horizontal {
  flex: 2;
  min-width: 400px;
  max-width: 500px;
  overflow: hidden;
}

.products-panel-vertical {
  flex: 2;
  min-height: 300px;
  overflow: hidden;
}

.cart-panel-vertical {
  flex: 3;
  min-height: 400px;
  overflow: hidden;
}

/* Loading Overlay */
.checkout-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.checkout-overlay.dark-overlay {
  background: rgba(26, 32, 44, 0.98);
}

.checkout-overlay.dark-overlay .p-progress-spinner-circle {
  stroke: #667eea !important;
}

/* Print Options Dialog */
.print-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  color: white !important;
}

/* Receipt Dialog */
.receipt-dialog :deep(.p-dialog-content) {
  padding: 0 !important;
  max-height: 80vh !important;
}

/* Custom button styles */
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

/* Dialog header styling */
:deep(.p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 1rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Dialog content area */
:deep(.p-dialog-content) {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
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
</style>
