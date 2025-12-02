<template>
  <Dialog
    :header="$t('pos.title')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '95vw', height: '90vh' }"
    :maximized="isMaximized"
    @hide="closeModal"
    class="pos-modal"
  >
    <!-- Toolbar -->
    <div
      class="pos-toolbar flex justify-content-between align-items-center mb-3 p-2 surface-100 border-round"
    >
      <div class="flex align-items-center gap-2">
        <Button
          :label="$t('pos.holdInvoice')"
          icon="pi pi-pause"
          @click="holdCurrentInvoice"
          class="p-button-warning"
          :disabled="cartItems.length === 0"
        />
        <Button
          :label="$t('pos.viewHeld')"
          icon="pi pi-list"
          @click="showHeldInvoices"
          class="p-button-secondary"
        />
        <Button
          :label="$t('pos.switchLayout')"
          :icon="layoutIcon"
          @click="toggleLayout"
          class="p-button-help"
        />
      </div>

      <div class="flex align-items-center gap-2">
        <span class="font-bold"
          >{{ $t("pos.invoiceNumber") }}: {{ invoiceNumber }}</span
        >
        <Button
          :icon="
            isMaximized ? 'pi pi-window-minimize' : 'pi pi-window-maximize'
          "
          @click="toggleMaximize"
          class="p-button-text"
          v-tooltip.top="isMaximized ? $t('pos.minimize') : $t('pos.maximize')"
        />
        <Button
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text p-button-danger"
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
        :class="
          layoutClass.includes('horizontal')
            ? 'products-panel-horizontal'
            : 'products-panel-vertical'
        "
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
        :class="
          layoutClass.includes('horizontal')
            ? 'cart-panel-horizontal'
            : 'cart-panel-vertical'
        "
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
        />
        <Button
          :label="$t('common.close')"
          @click="showReceipt = false"
          class="p-button-text"
        />
      </template>
    </Dialog>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ loadingMessage }}</p>
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
      isMaximized: true,
      layout: "horizontal", // 'horizontal' or 'vertical'

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

      // Tax (TODO: Get from API)
      taxRate: 14, // Example tax rate

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
  },
  created() {
    this.posService = new PosService(this.companyId, this.branchId);
    // Initialize with dummy data
    this.initializeData();
  },
  methods: {
    openModal() {
      this.visible = true;
      this.resetCart();
      this.generateInvoiceNumber();
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
    },

    toggleLayout() {
      this.layout = this.layout === "horizontal" ? "vertical" : "horizontal";
      // Save preference to localStorage
      localStorage.setItem("pos_layout_preference", this.layout);
    },

    async initializeData() {
      // Load layout preference
      const savedLayout = localStorage.getItem("pos_layout_preference");
      if (savedLayout) {
        this.layout = savedLayout;
      }

      // TODO: Load real data from APIs
      // For now, use dummy data
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
          additional_costs: [], // For item-level additional costs
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
        // Prepare final products for API
        const finalProducts = this.cartItems.map((item) => ({
          final_product_id: item.id,
          measurement_unit_id:
            item.measurement_unit_id ||
            item.product?.sales_measurement_unit?.id,
          quantity: item.quantity || 1,
        }));

        // Prepare invoice data
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

        // TODO: Uncomment when API is ready
        // const result = await this.posService.createInvoice(invoiceData);

        // For now, simulate success
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create receipt data
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

        // Show receipt
        this.showReceipt = true;

        // Clear cart
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
              body { font-family: Arial, sans-serif; font-size: 12px; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-items { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .receipt-items th, .receipt-items td { border: 1px solid #ddd; padding: 5px; }
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
  },
  // In PosModal.vue methods, add these:
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
      // Create a new array to trigger reactivity
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
      // Create a new array to trigger reactivity
      this.invoiceAdditionalCosts = [
        ...this.invoiceAdditionalCosts.slice(0, index),
        updatedCost,
        ...this.invoiceAdditionalCosts.slice(index + 1),
      ];
    }
  },
};
</script>

<style scoped>
.pos-modal {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.pos-toolbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.pos-toolbar .p-button {
  font-weight: 600;
}

.horizontal-layout {
  display: flex;
  height: calc(90vh - 100px);
  gap: 1rem;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  height: calc(90vh - 100px);
  gap: 1rem;
}

.products-panel-horizontal {
  flex: 3;
  min-width: 0;
}

.cart-panel-horizontal {
  flex: 2;
  min-width: 400px;
  max-width: 500px;
}

.products-panel-vertical {
  flex: 2;
  min-height: 300px;
}

.cart-panel-vertical {
  flex: 3;
  min-height: 400px;
}

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

:deep(.p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

:deep(.p-dialog-header-icons button) {
  color: white;
}

:deep(.p-dialog-header-icons button:hover) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
