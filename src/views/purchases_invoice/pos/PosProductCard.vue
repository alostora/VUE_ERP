<template>
  <div class="pos-product-card" @click="$emit('view-details')">
    <div
      class="product-card-inner p-3 surface-card border-round cursor-pointer hover:surface-hover transition-all transition-duration-300"
    >
      <!-- Product Image -->
      <div class="product-image mb-2">
        <img
          v-if="product.main_image?.file?.file_path"
          :src="product.main_image.file.file_path"
          :alt="product.name"
          class="border-round w-full"
        />
        <div v-else class="no-image">
          <i class="pi pi-image"></i>
          <span class="block mt-2 text-sm">{{ $t("pos.noImage") }}</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <h4
          class="product-name m-0 mb-1 text-sm font-bold truncate"
          :title="product.name"
        >
          {{ product.name }}
        </h4>
        <p
          class="product-name-ar m-0 mb-2 text-xs text-color-secondary truncate"
          :title="product.name_ar"
        >
          {{ product.name_ar }}
        </p>

        <!-- Price -->
        <div class="product-price mb-2">
          <div class="flex align-items-center gap-1">
            <span
              v-if="product.has_discount"
              class="original-price text-line-through text-xs text-color-secondary"
            >
              {{ formatCurrency(product.price) }}
            </span>
            <span class="current-price font-bold text-primary">
              {{
                formatCurrency(
                  product.has_discount
                    ? product.price_after_discount
                    : product.price
                )
              }}
            </span>
            <Tag
              v-if="product.has_discount"
              :value="`-${product.discount_value}%`"
              severity="danger"
              size="small"
              class="ml-1"
            />
          </div>
        </div>

        <!-- Stock - Removed since API doesn't provide stock -->
        <!-- <div class="product-stock mb-3">
          <Tag
            :value="product.stock || 0"
            :severity="getStockSeverity(product.stock)"
            size="small"
            class="w-full justify-content-center"
          />
        </div> -->

        <!-- Add to Cart Button -->
        <Button
          :label="$t('pos.addToCart')"
          icon="pi pi-cart-plus"
          @click.stop="addToCart"
          class="w-full p-button-sm"
          :disabled="false"
          :loading="addingToCart"
        >
          <template #loading>
            <i class="pi pi-spin pi-spinner mr-2"></i>
            {{ $t("pos.adding") }}
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import Tag from "primevue/tag";

export default {
  name: "PosProductCard",
  components: {
    Button,
    Tag,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addingToCart: false,
    };
  },
  methods: {
    addToCart() {
      this.addingToCart = true;

      // Simulate API call
      setTimeout(() => {
        this.$emit("add-to-cart", this.product);
        this.addingToCart = false;
      }, 300);
    },

    formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
    },

    // Removed getStockSeverity since API doesn't provide stock
    // getStockSeverity(stock) {
    //   if (!stock || stock <= 0) return "danger";
    //   if (stock <= 10) return "warning";
    //   return "success";
    // },
  },
};
</script>

<style scoped>
.pos-product-card {
  height: 100%;
}

.product-card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #dee2e6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.product-image {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.no-image i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  line-height: 1.2;
  max-height: 2.4em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.product-name-ar {
  line-height: 1.2;
  max-height: 1.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.original-price {
  font-size: 0.75rem;
}

.current-price {
  font-size: 1rem;
}

.product-stock {
  margin-top: auto;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.p-button) {
  font-weight: 600;
}

:deep(.p-button.p-button-sm) {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

:deep(.p-tag.p-tag-sm) {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
}
</style>
