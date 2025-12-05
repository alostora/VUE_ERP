<template>
  <div class="pos-cart-item">
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
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 12px;
  background: white;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.pos-cart-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dee2e6;
  border-radius: 4px;
  color: #6c757d;
}

.quantity-input {
  width: 100px;
}

.quantity-input :deep(.p-inputnumber-input) {
  text-align: center;
  font-weight: bold;
}

.quantity-input :deep(.p-inputnumber-button) {
  width: 24px !important;
  height: 24px !important;
  font-size: 10px !important;
}

.item-total {
  color: #28a745;
  font-size: 14px;
}

.original-price {
  font-size: 11px;
}

.current-price {
  font-size: 13px;
  color: #28a745;
}

.operations-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 10px;
}

.operation-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.operation-item:hover {
  background: #f1f3f4;
}

.file-upload-section {
  border: 1px dashed #dee2e6;
  border-radius: 4px;
  padding: 8px;
  background: white;
}

.uploaded-file {
  background: #e8f5e8;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.p-fileupload-choose) {
  font-size: 11px !important;
  padding: 4px 8px !important;
}

:deep(.p-button-xs) {
  padding: 2px 4px !important;
  font-size: 10px !important;
}

.item-notes :deep(.p-inputtextarea) {
  font-size: 11px !important;
  padding: 4px 8px !important;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

/* تحسينات للأجهزة الصغيرة */
@media (max-width: 768px) {
  .item-image {
    width: 50px;
    height: 50px;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .grid > div {
    width: 100% !important;
  }
}
</style>
