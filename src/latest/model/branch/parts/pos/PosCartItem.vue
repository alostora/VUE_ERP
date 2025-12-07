<template>
  <div class="pos-cart-item" :class="{ 'dark-mode': isDarkMode }">
    <!-- Item Header -->
    <div class="flex justify-content-between align-items-start mb-2">
      <div class="flex align-items-start gap-2" style="flex: 1">
        <!-- Product Image -->
        <div class="item-image">
          <img
            v-if="item.main_image?.file?.file_path"
            :src="item.main_image.file.file_path"
            :alt="item.name"
            class="border-round"
          />
          <div v-else class="no-image">
            <i class="pi pi-image"></i>
          </div>
        </div>

        <!-- Product Info -->
        <div style="flex: 1">
          <h5 class="m-0 mb-1 text-sm">{{ item.name }}</h5>
          <p class="text-xs m-0 mb-1 text-color-secondary">
            {{ item.name_ar }}
          </p>

          <!-- Price Display -->
          <div class="flex align-items-center gap-1 mb-2">
            <span
              v-if="item.has_discount"
              class="original-price text-line-through text-xs text-color-secondary"
            >
              {{ formatCurrency(parsePrice(item.price)) }}
            </span>
            <span class="current-price font-bold text-sm">
              {{
                formatCurrency(
                  parsePrice(
                    item.has_discount ? item.price_after_discount : item.price
                  )
                )
              }}
            </span>
            <Tag
              v-if="item.has_discount"
              :value="`-${item.discount_value}%`"
              severity="danger"
              size="small"
            />
          </div>
        </div>
      </div>

      <!-- Remove Button -->
      <Button
        icon="pi pi-times"
        @click="$emit('remove')"
        class="p-button-danger p-button-text p-button-sm"
        v-tooltip="$t('pos.removeItem')"
      />
    </div>

    <!-- Quantity Controls -->
    <div class="flex justify-content-between align-items-center mb-3">
      <div class="flex align-items-center gap-2">
        <span class="font-bold text-xs">{{ $t("pos.quantity") }}:</span>
        <InputNumber
          v-model="item.quantity"
          :min="1"
          :max="999"
          showButtons
          buttonLayout="horizontal"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          @input="updateQuantity"
          class="quantity-input"
          inputStyle="width: 60px"
        />
      </div>

      <!-- Item Total - عرض شامل لتكاليف العمليات -->
      <div class="item-total font-bold text-sm">
        {{ formatCurrency(itemTotal) }}
        <small
          v-if="itemOperationsTotal > 0"
          class="text-green-600 text-xs ml-1"
        >
          (+{{ formatCurrency(itemOperationsTotal) }})
        </small>
      </div>
    </div>

    <!-- Item Operations Section -->
    <div class="item-operations" v-if="showAdditionalCosts">
      <div
        class="operations-header flex justify-content-between align-items-center mb-2"
      >
        <h6 class="m-0 text-xs font-bold">
          <i class="pi pi-wrench mr-1"></i>
          {{ $t("pos.itemOperations") }}
          <small class="text-green-600 ml-1">
            ({{ formatCurrency(itemOperationsTotal) }})
          </small>
        </h6>
        <Button
          :label="$t('pos.addOperation')"
          icon="pi pi-plus"
          @click="addAdditionalCost"
          class="p-button-warning p-button-sm text-xs"
        />
      </div>

      <!-- Additional Costs List -->
      <div
        v-if="item.additional_costs && item.additional_costs.length > 0"
        class="operations-list"
      >
        <div
          v-for="(cost, index) in item.additional_costs"
          :key="cost.id || index"
          class="operation-item p-2 mb-2 border-round"
        >
          <div class="grid">
            <div class="col-12 md:col-5 mb-1">
              <label class="block text-xs font-bold mb-1">
                {{ $t("pos.operationName") }}
              </label>
              <InputText
                v-model="cost.name"
                :placeholder="$t('pos.enterOperationName')"
                class="w-full text-xs"
                @input="updateAdditionalCost(cost)"
              />
            </div>

            <div class="col-12 md:col-4 mb-1">
              <label class="block text-xs font-bold mb-1">
                {{ $t("pos.costValue") }}
              </label>
              <InputNumber
                v-model="cost.value"
                :placeholder="$t('pos.enterCostValue')"
                mode="currency"
                currency="USD"
                locale="en-US"
                class="w-full text-xs"
                @input="updateAdditionalCost(cost)"
              />
            </div>

            <div class="col-12 md:col-3 mb-1 flex align-items-end">
              <Button
                icon="pi pi-times"
                @click="removeAdditionalCost(index)"
                class="p-button-danger p-button-text p-button-sm w-full"
              />
            </div>
          </div>

          <!-- File Upload for Operation -->
          <div class="mt-2">
            <div class="file-upload-section">
              <FileUpload
                mode="basic"
                :chooseLabel="$t('pos.uploadFile')"
                :multiple="false"
                :maxFileSize="5000000"
                @select="onFileSelect($event, cost)"
                class="w-full text-xs"
                accept="image/*,.pdf,.doc,.docx"
              />
              <small class="text-xs text-color-secondary">
                {{ $t("pos.maxFileSize") }}: 5MB
              </small>

              <!-- Show uploaded file -->
              <div v-if="cost.file" class="uploaded-file mt-1">
                <div class="flex align-items-center gap-1">
                  <i class="pi pi-file text-xs"></i>
                  <span class="text-xs">{{ getFileName(cost.file) }}</span>
                  <span class="text-xs text-color-secondary"
                    >({{ formatFileSize(cost.file) }})</span
                  >
                  <Button
                    icon="pi pi-times"
                    @click="removeFile(cost)"
                    class="p-button-danger p-button-text p-button-xs ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Notes -->
    <div class="item-notes mt-2">
      <Textarea
        v-model="item.notes"
        :placeholder="$t('pos.itemNotesPlaceholder')"
        rows="1"
        class="w-full text-xs"
        autoResize
        @input="updateItemNotes"
      />
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";
import Tooltip from "primevue/tooltip";

export default {
  name: "PosCartItem",
  components: {
    Button,
    Tag,
    InputNumber,
    InputText,
    Textarea,
    FileUpload,
  },
  directives: {
    tooltip: Tooltip,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
    showAdditionalCosts: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // حساب إجمالي تكاليف العمليات على المنتج
    itemOperationsTotal() {
      let total = 0;
      if (
        this.item.additional_costs &&
        Array.isArray(this.item.additional_costs)
      ) {
        this.item.additional_costs.forEach((cost) => {
          total += this.parsePrice(cost.value) || 0;
        });
      }
      return parseFloat(total.toFixed(2));
    },

    // حساب الإجمالي النهائي للمنتج (السعر + تكاليف العمليات)
    itemTotal() {
      const price = this.parsePrice(
        this.item.has_discount
          ? this.item.price_after_discount
          : this.item.price
      );

      let total = price * (this.item.quantity || 1);

      // إضافة تكاليف العمليات على المنتج (مهم: تضاف للإجمالي)
      total += this.itemOperationsTotal;

      return parseFloat(total.toFixed(2));
    },
  },
  created() {
    // Initialize additional_costs array if not exists
    if (!this.item.additional_costs) {
      this.$set(this.item, "additional_costs", []);
    }
  },
  methods: {
    parsePrice(price) {
      if (!price && price !== 0) return 0;
      if (typeof price === "string") {
        return parseFloat(price.replace(/,/g, ""));
      }
      return parseFloat(price);
    },

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    formatFileSize(file) {
      if (!file || !file.size) return "0 B";
      const bytes = file.size;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },

    getFileName(file) {
      if (file.name) return file.name;
      if (typeof file === "string") return file.split("/").pop();
      return "file";
    },

    updateQuantity() {
      this.$emit("update", { quantity: this.item.quantity });
    },

    updateItemNotes() {
      this.$emit("update", { notes: this.item.notes });
    },

    addAdditionalCost() {
      if (!this.item.additional_costs) {
        this.$set(this.item, "additional_costs", []);
      }

      this.item.additional_costs.push({
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        value: 0,
        file: null,
      });

      this.$emit("update", { additional_costs: this.item.additional_costs });
    },

    updateAdditionalCost(cost) {
      this.$emit("update", { additional_costs: this.item.additional_costs });
    },

    removeAdditionalCost(index) {
      this.item.additional_costs.splice(index, 1);
      this.$emit("update", { additional_costs: this.item.additional_costs });
    },

    onFileSelect(event, cost) {
      if (event.files && event.files[0]) {
        cost.file = event.files[0];
        this.updateAdditionalCost(cost);
      }
    },

    removeFile(cost) {
      cost.file = null;
      this.updateAdditionalCost(cost);
    },
  },
};
</script>

<style scoped>
.pos-cart-item {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 12px;
  color: var(--text-color);
  transition: all 0.2s ease;
}

.pos-cart-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .pos-cart-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* الهيدر */
.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.cart-item-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 13px;
  flex: 1;
}

.cart-item-remove-btn {
  color: var(--text-color-secondary) !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
}

.cart-item-remove-btn:hover {
  color: var(--color-danger) !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

/* البودي */
.cart-item-body {
  margin-bottom: 8px;
}

.cart-item-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cart-item-original-price {
  color: var(--text-color-secondary);
  text-decoration: line-through;
  font-size: 11px;
}

.cart-item-final-price {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 13px;
}

.cart-item-discount-badge {
  background: var(--color-success-light);
  color: var(--color-success-dark);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.dark-mode .cart-item-discount-badge {
  background: var(--color-success-dark);
  color: var(--color-success-light);
}

/* الكميات - هنا أهم جزء */
.cart-item-quantity-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.cart-item-quantity-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 4px !important;
  background: var(--surface-ground) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--text-color) !important;
  transition: all 0.2s ease !important;
}

.cart-item-quantity-btn:hover:not(:disabled) {
  background: var(--surface-hover) !important;
  border-color: var(--primary-color) !important;
  transform: translateY(-1px);
}

.cart-item-quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-item-quantity-input {
  width: 50px !important;
  min-width: 50px !important;
  height: 28px !important;
  text-align: center !important;
  padding: 0 4px !important;
  background: var(--surface-card) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--text-color) !important;
  border-radius: 4px !important;
  font-size: 12px !important;
  font-weight: 600;
}

.cart-item-quantity-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1) !important;
  outline: none !important;
}

/* الدارك مود للكميات */
.dark-mode .cart-item-quantity-btn {
  background: var(--surface-700) !important;
  border-color: var(--surface-600) !important;
}

.dark-mode .cart-item-quantity-btn:hover:not(:disabled) {
  background: var(--surface-600) !important;
  border-color: var(--primary-color-light) !important;
}

.dark-mode .cart-item-quantity-input {
  background: var(--surface-700) !important;
  border-color: var(--surface-600) !important;
  color: var(--text-color) !important;
}

/* الفوتر */
.cart-item-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--surface-border);
}

.cart-item-subtotal {
  font-weight: 600;
  color: var(--text-color);
  font-size: 13px;
}

/* التكاليف الإضافية */
.additional-costs-section {
  margin-top: 8px;
}

.additional-cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  margin-top: 4px;
  font-size: 11px;
}

.dark-mode .additional-cost-item {
  background: var(--surface-700);
  border-color: var(--surface-600);
}

.additional-cost-name {
  color: var(--text-color);
}

.additional-cost-value {
  color: var(--color-warning);
  font-weight: 600;
}
</style>