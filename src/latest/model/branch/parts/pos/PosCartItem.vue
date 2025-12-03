<template>
  <div
    class="pos-cart-item p-3"
    :class="{ 'light-item': !isDarkMode, 'dark-item': isDarkMode }"
  >
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
          <div v-else class="no-image" :class="{ 'dark-no-image': isDarkMode }">
            <i class="pi pi-image"></i>
          </div>
        </div>

        <!-- Product Info -->
        <div style="flex: 1">
          <h4 class="m-0 mb-1" :class="{ 'dark-text': isDarkMode }">
            {{ item.name }}
          </h4>
          <p
            class="text-sm m-0 mb-1"
            :class="{
              'text-color-secondary': !isDarkMode,
              'dark-text-secondary': isDarkMode,
            }"
          >
            {{ item.name_ar }}
          </p>

          <!-- Price Display -->
          <div class="flex align-items-center gap-2 mb-1">
            <span
              v-if="item.has_discount"
              class="original-price text-line-through"
              :class="{
                'text-color-secondary': !isDarkMode,
                'dark-text-secondary': isDarkMode,
              }"
            >
              {{ formatCurrency(item.price) }}
            </span>
            <span
              class="current-price font-bold"
              :class="{ 'dark-price': isDarkMode }"
            >
              {{
                formatCurrency(
                  item.has_discount ? item.price_after_discount : item.price
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

          <!-- Measurement Unit -->
          <div v-if="measurementUnits.length > 0" class="mb-1">
            <Dropdown
              v-model="selectedMeasurementUnit"
              :options="measurementUnits"
              optionLabel="name"
              optionValue="id"
              placeholder="Select Unit"
              class="w-10rem"
              size="small"
              :class="{ 'dark-dropdown': isDarkMode }"
              @change="updateMeasurementUnit"
            />
          </div>
        </div>
      </div>

      <!-- Remove Button -->
      <Button
        icon="pi pi-times"
        @click="$emit('remove')"
        class="p-button-danger p-button-text p-button-sm"
        :class="{ 'dark-remove-btn': isDarkMode }"
        v-tooltip.top="$t('pos.removeItem')"
      />
    </div>

    <!-- Quantity Controls -->
    <div class="flex justify-content-between align-items-center mb-2">
      <div class="flex align-items-center gap-2">
        <span
          class="font-bold"
          :class="{ 'dark-text': isDarkMode, 'light-text': !isDarkMode }"
          >{{ $t("pos.quantity") }}:</span
        >
        <div
          class="quantity-controls flex align-items-center gap-1"
          :class="{ 'dark-quantity-controls': isDarkMode }"
        >
          <Button
            icon="pi pi-minus"
            @click="decreaseQuantity"
            class="p-button-rounded p-button-text p-button-sm"
            :class="{ 'dark-quantity-btn': isDarkMode }"
            :disabled="item.quantity <= 1"
          />
          <InputNumber
            v-model="item.quantity"
            :min="1"
            :max="item.stock || 999"
            showButtons
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            @input="updateQuantity"
            class="quantity-input"
            :class="{ 'dark-input': isDarkMode }"
          />
          <Button
            icon="pi pi-plus"
            @click="increaseQuantity"
            class="p-button-rounded p-button-text p-button-sm"
            :class="{ 'dark-quantity-btn': isDarkMode }"
          />
        </div>
      </div>
      <!-- Item Total -->
      <div
        class="item-total font-bold text-lg"
        :class="{ 'dark-total': isDarkMode }"
      >
        {{ formatCurrency(itemTotal) }}
      </div>
    </div>

    <!-- Stock Info -->
    <div v-if="item.stock !== undefined" class="stock-info mb-2">
      <Tag
        :value="`${$t('pos.stock')}: ${item.stock}`"
        :severity="getStockSeverity(item.stock)"
        size="small"
      />
      <small
        v-if="item.quantity > item.stock"
        class="ml-2"
        :class="{ 'p-error': !isDarkMode, 'dark-error': isDarkMode }"
      >
        {{ $t("pos.insufficientStock") }}
      </small>
    </div>

    <!-- Item-Level Additional Costs -->
    <div class="item-additional-costs">
      <div class="flex justify-content-between align-items-center mb-2">
        <h5 class="m-0" :class="{ 'dark-text': isDarkMode }">
          <i class="pi pi-wrench mr-1" :class="{ 'dark-icon': isDarkMode }"></i>
          {{ $t("pos.itemOperations") }}
        </h5>
        <Button
          :label="$t('pos.addOperation')"
          icon="pi pi-plus"
          @click="addAdditionalCost"
          class="p-button-warning p-button-sm"
          :class="{ 'dark-warning-btn': isDarkMode }"
          size="small"
        />
      </div>

      <div
        v-if="item.additional_costs && item.additional_costs.length > 0"
        class="costs-list"
      >
        <div
          v-for="(cost, index) in item.additional_costs"
          :key="cost.id || index"
          class="cost-item p-2 mb-2 border-round"
          :class="{
            'light-cost-item': !isDarkMode,
            'dark-cost-item': isDarkMode,
          }"
        >
          <div class="grid">
            <div class="col-12 md:col-4">
              <InputText
                v-model="cost.name"
                :placeholder="$t('pos.operationName')"
                class="w-full"
                size="small"
                :class="{ 'dark-input': isDarkMode }"
                @input="updateAdditionalCost(cost)"
              />
            </div>
            <div class="col-12 md:col-4">
              <InputNumber
                v-model="cost.value"
                :placeholder="$t('pos.costValue')"
                mode="currency"
                currency="USD"
                locale="en-US"
                class="w-full"
                size="small"
                :class="{ 'dark-input': isDarkMode }"
                @input="updateAdditionalCost(cost)"
              />
            </div>
            <div class="col-12 md:col-2">
              <Button
                icon="pi pi-paperclip"
                @click="uploadOperationImage(cost)"
                class="p-button-text p-button-sm"
                size="small"
                :class="{ 'dark-icon-btn': isDarkMode }"
                v-tooltip.top="$t('pos.uploadImage')"
              />
            </div>
            <div class="col-12 md:col-2">
              <Button
                icon="pi pi-times"
                @click="removeAdditionalCost(index)"
                class="p-button-danger p-button-text p-button-sm"
                size="small"
                :class="{ 'dark-remove-btn': isDarkMode }"
              />
            </div>

            <!-- Description -->
            <div class="col-12 mt-2">
              <Textarea
                v-model="cost.description"
                :placeholder="$t('pos.operationDescription')"
                rows="2"
                class="w-full"
                size="small"
                :class="{ 'dark-textarea': isDarkMode }"
                @input="updateAdditionalCost(cost)"
              />
            </div>

            <!-- Image Preview -->
            <div v-if="cost.image" class="col-12 mt-2">
              <div class="image-preview">
                <img :src="cost.image" :alt="cost.name" class="border-round" />
                <Button
                  icon="pi pi-times"
                  @click="removeOperationImage(cost)"
                  class="p-button-danger p-button-text p-button-sm remove-image-btn"
                  size="small"
                  :class="{ 'dark-remove-btn': isDarkMode }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-sm p-2"
        :class="{
          'text-color-secondary': !isDarkMode,
          'dark-text-secondary': isDarkMode,
        }"
      >
        {{ $t("pos.noOperationsAdded") }}
      </div>
    </div>

    <!-- Item Notes -->
    <div class="item-notes mt-2">
      <Textarea
        v-model="item.notes"
        :placeholder="$t('pos.itemNotesPlaceholder')"
        rows="1"
        class="w-full"
        size="small"
        :class="{ 'dark-textarea': isDarkMode }"
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
import Dropdown from "primevue/dropdown";
import Tooltip from "primevue/tooltip";

export default {
  name: "PosCartItem",
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
  },
  data() {
    return {
      measurementUnits: [],
      selectedMeasurementUnit: this.item.measurement_unit_id || null,
    };
  },
  computed: {
    itemTotal() {
      const price = this.item.has_discount
        ? this.item.price_after_discount
        : this.item.price;
      let total = price * (this.item.quantity || 1);

      // Add item-level additional costs
      if (
        this.item.additional_costs &&
        Array.isArray(this.item.additional_costs)
      ) {
        this.item.additional_costs.forEach((cost) => {
          total += parseFloat(cost.value) || 0;
        });
      }

      return parseFloat(total.toFixed(2));
    },
  },
  created() {
    this.loadMeasurementUnits();
    // Initialize additional_costs array if not exists
    if (!this.item.additional_costs) {
      this.$set(this.item, "additional_costs", []);
    }
  },
  methods: {
    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    getStockSeverity(stock) {
      if (!stock || stock <= 0) return "danger";
      if (stock <= 10) return "warning";
      return "success";
    },

    async loadMeasurementUnits() {
      // TODO: Load measurement units from API
      this.measurementUnits = [
        { id: "unit1", name: "Piece" },
        { id: "unit2", name: "Kg" },
        { id: "unit3", name: "Liter" },
      ];
    },

    updateMeasurementUnit() {
      this.$emit("update", {
        measurement_unit_id: this.selectedMeasurementUnit,
      });
    },

    updateQuantity() {
      this.$emit("update", { quantity: this.item.quantity });
    },

    updateItemNotes() {
      this.$emit("update", { notes: this.item.notes });
    },

    increaseQuantity() {
      const newQuantity = (this.item.quantity || 1) + 1;
      this.$emit("update", { quantity: newQuantity });
    },

    decreaseQuantity() {
      if (this.item.quantity > 1) {
        const newQuantity = this.item.quantity - 1;
        this.$emit("update", { quantity: newQuantity });
      }
    },

    addAdditionalCost() {
      if (!this.item.additional_costs) {
        this.$set(this.item, "additional_costs", []);
      }

      this.item.additional_costs.push({
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        value: 0,
        description: "",
        image: null,
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

    uploadOperationImage(cost) {
      // Create a file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            cost.image = event.target.result;
            this.updateAdditionalCost(cost);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    },

    removeOperationImage(cost) {
      cost.image = null;
      this.updateAdditionalCost(cost);
    },
  },
};
</script>

<style scoped>
/* Base styles */
.pos-cart-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pos-cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Light Mode */
.light-item {
  background: white;
  border-color: #dee2e6;
}

.light-item:hover {
  border-color: #007bff;
}

.light-cost-item {
  border-left: 3px solid #ffc107;
  background: #fff8e1;
}

.light-cost-item:nth-child(even) {
  border-left-color: #fd7e14;
  background: #fff3e0;
}

/* Dark Mode */
.dark-item {
  background: #2d3748;
  border-color: #4a5568;
}

.dark-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-cost-item {
  border-left: 3px solid #d69e2e;
  background: #4a5568;
}

.dark-cost-item:nth-child(even) {
  border-left-color: #ed8936;
  background: #2d3748;
}

/* Image */
.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dee2e6;
  border-radius: 6px;
}

.light-item .no-image {
  background: #f8f9fa;
  color: #6c757d;
}

.dark-item .no-image {
  background: #4a5568;
  color: #a0aec0;
}

/* Text Colors */
.dark-text {
  color: #e2e8f0 !important;
}

.dark-text-secondary {
  color: #a0aec0 !important;
}

.dark-price {
  color: #68d391 !important;
}

.dark-total {
  color: #667eea !important;
}

/* Original Price */
.original-price {
  font-size: 0.85rem;
}

.light-item .original-price {
  color: #6c757d;
}

.dark-item .original-price {
  color: #a0aec0;
}

/* Current Price */
.current-price {
  font-size: 1rem;
}

.light-item .current-price {
  color: #28a745;
}

.dark-item .current-price {
  color: #68d391;
}

/* Quantity Controls */
.quantity-controls {
  padding: 4px;
  border-radius: 6px;
}

.light-item .quantity-controls {
  background: #f8f9fa;
}

.dark-item .quantity-controls {
  background: #4a5568;
}

.quantity-input {
  width: 70px !important;
}

:deep(.quantity-input .p-inputnumber-input) {
  text-align: center;
  font-weight: bold;
}

/* Input Fields */
:deep(.dark-input .p-inputtext) {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

:deep(.dark-input .p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
}

:deep(.dark-input .p-inputnumber-button) {
  background-color: #4a5568 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

/* Dropdown */
:deep(.dark-dropdown .p-dropdown) {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

:deep(.dark-dropdown .p-dropdown-panel) {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
}

:deep(.dark-dropdown .p-dropdown-item) {
  color: #e2e8f0 !important;
}

:deep(.dark-dropdown .p-dropdown-item:hover) {
  background-color: #4a5568 !important;
}

/* Textarea */
:deep(.dark-textarea .p-inputtextarea) {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

:deep(.dark-textarea .p-inputtextarea:focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
}

/* Buttons */
:deep(.dark-quantity-btn.p-button) {
  background-color: #4a5568 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

:deep(.dark-quantity-btn.p-button:hover) {
  background-color: #667eea !important;
  border-color: #667eea !important;
}

:deep(.dark-warning-btn.p-button) {
  background-color: #d69e2e !important;
  border-color: #d69e2e !important;
  color: white !important;
}

:deep(.dark-warning-btn.p-button:hover) {
  background-color: #b7791f !important;
  border-color: #b7791f !important;
}

:deep(.dark-remove-btn.p-button) {
  color: #fc8181 !important;
}

:deep(.dark-remove-btn.p-button:hover) {
  background-color: rgba(252, 129, 129, 0.1) !important;
}

:deep(.dark-icon-btn.p-button) {
  color: #a0aec0 !important;
}

:deep(.dark-icon-btn.p-button:hover) {
  background-color: rgba(160, 174, 192, 0.1) !important;
}

.dark-icon {
  color: #a0aec0 !important;
}

/* Item Total */
.item-total {
  min-width: 80px;
  text-align: right;
  margin-top: 65px;
}

.light-item .item-total {
  color: #007bff;
}

.dark-item .item-total {
  color: #667eea;
}

/* Stock Info */
.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark-error {
  color: #fc8181 !important;
}

/* Image Preview */
.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
}

.light-text {
  color: #2d3748 !important; /* Dark gray for light mode */
}

.dark-text {
  color: #e2e8f0 !important; /* Light gray for dark mode */
}

/* Utility Classes */
:deep(.p-button.p-button-sm) {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-inputtext-sm) {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-dropdown-sm .p-dropdown-label) {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
