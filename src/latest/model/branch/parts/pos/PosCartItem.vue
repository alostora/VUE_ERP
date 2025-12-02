<template>
  <div class="pos-cart-item p-3 surface-100 border-round">
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
          <h4 class="m-0 mb-1">{{ item.name }}</h4>
          <p class="text-sm text-color-secondary m-0 mb-1">
            {{ item.name_ar }}
          </p>

          <!-- Price Display -->
          <div class="flex align-items-center gap-2 mb-1">
            <span
              v-if="item.has_discount"
              class="original-price text-line-through text-color-secondary"
            >
              {{ formatCurrency(item.price) }}
            </span>
            <span class="current-price font-bold">
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
        v-tooltip.top="$t('pos.removeItem')"
      />
    </div>

    <!-- Quantity Controls -->
    <div class="flex justify-content-between align-items-center mb-2">
      <div class="flex align-items-center gap-2">
        <span class="font-bold">{{ $t("pos.quantity") }}:</span>
        <div class="quantity-controls flex align-items-center gap-1">
          <Button
            icon="pi pi-minus"
            @click="decreaseQuantity"
            class="p-button-rounded p-button-text p-button-sm"
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
          />
          <Button
            icon="pi pi-plus"
            @click="increaseQuantity"
            class="p-button-rounded p-button-text p-button-sm"
          />
        </div>
      </div>

      <!-- Item Total -->
      <div class="item-total font-bold text-lg">
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
      <small v-if="item.quantity > item.stock" class="p-error ml-2">
        {{ $t("pos.insufficientStock") }}
      </small>
    </div>

    <!-- Item-Level Additional Costs -->
    <div class="item-additional-costs">
      <div class="flex justify-content-between align-items-center mb-2">
        <h5 class="m-0">
          <i class="pi pi-wrench mr-1"></i>
          {{ $t("pos.itemOperations") }}
        </h5>
        <Button
          :label="$t('pos.addOperation')"
          icon="pi pi-plus"
          @click="addAdditionalCost"
          class="p-button-warning p-button-sm"
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
          class="cost-item p-2 mb-2 surface-50 border-round"
        >
          <div class="grid">
            <div class="col-12 md:col-4">
              <InputText
                v-model="cost.name"
                :placeholder="$t('pos.operationName')"
                class="w-full"
                size="small"
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
                @input="updateAdditionalCost(cost)"
              />
            </div>
            <div class="col-12 md:col-2">
              <Button
                icon="pi pi-paperclip"
                @click="uploadOperationImage(cost)"
                class="p-button-text p-button-sm"
                size="small"
                v-tooltip.top="$t('pos.uploadImage')"
              />
            </div>
            <div class="col-12 md:col-2">
              <Button
                icon="pi pi-times"
                @click="removeAdditionalCost(index)"
                class="p-button-danger p-button-text p-button-sm"
                size="small"
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-color-secondary text-sm p-2">
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
.pos-cart-item {
  border: 1px solid #dee2e6;
  background: white;
  transition: all 0.3s ease;
}

.pos-cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
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
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px dashed #dee2e6;
  border-radius: 6px;
  color: #6c757d;
}

.original-price {
  font-size: 0.85rem;
}

.current-price {
  font-size: 1rem;
  color: #28a745;
}

.quantity-controls {
  background: #f8f9fa;
  padding: 4px;
  border-radius: 6px;
}

.quantity-input {
  width: 70px !important;
}

:deep(.quantity-input .p-inputnumber-input) {
  text-align: center;
  font-weight: bold;
}

.item-total {
  color: #007bff;
  min-width: 80px;
  text-align: right;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cost-item {
  border-left: 3px solid #ffc107;
  background: #fff8e1;
}

.cost-item:nth-child(even) {
  border-left-color: #fd7e14;
  background: #fff3e0;
}

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
