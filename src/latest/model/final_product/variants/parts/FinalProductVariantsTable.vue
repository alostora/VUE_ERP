<template>
  <div
    class="final-product-variants-table"
    :class="{ 'embedded-mode': embedded }"
  >
    <!-- Page Header - Conditionally show based on embedded mode -->
    <div class="page-header mb-4" v-if="!embedded">
      <div class="flex justify-content-between align-items-center">
        <div>
          <Button
            icon="pi pi-arrow-left"
            class="p-button-text mb-2"
            @click="goBack"
            :label="$t('final_product_variants.backToProducts')"
          />
          <h2 class="m-0">
            {{ $t("final_product_variants.title") }} -
            <span class="text-primary">{{
              finalProduct?.name || "Loading..."
            }}</span>
          </h2>
        </div>
        <Button
          :label="$t('final_product_variants.addVariants')"
          icon="pi pi-plus"
          @click="openCreateModal"
          class="p-button-primary"
        />
      </div>
    </div>

    <!-- Modal Header - Show when embedded -->
    <div class="modal-header mb-4" v-if="embedded">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h3 class="m-0 text-primary">
            {{ finalProduct?.name || "Loading..." }}
          </h3>
          <p class="m-0 text-color-secondary mt-1">
            {{ $t("final_product_variants.assignedVariants") }}
          </p>
        </div>
        <Button
          :label="$t('final_product_variants.addVariants')"
          icon="pi pi-plus"
          @click="openCreateModal"
          class="p-button-primary p-button-sm"
        />
      </div>
    </div>

    <!-- Variants Table -->
    <Card :class="{ 'embedded-card': embedded }">
      <template #content>
        <DataTable
          :value="tableItems"
          :loading="loading"
          :paginator="true"
          :rows="per_page"
          :totalRecords="meta.total"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          @page="handlePageChange"
          class="p-datatable-sm table-scroll-container"
          :class="{ 'embedded-table': embedded }"
        >
          <!-- Variant Type Column -->
          <Column
            :header="$t('final_product_variants.variantType')"
            style="min-width: 200px"
          >
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <span>{{ slotProps.data.variant.name }}</span>
                <small class="text-color-secondary">
                  ({{ slotProps.data.variant.name_ar }})
                </small>
              </div>
            </template>
          </Column>

          <!-- Variant Value Column -->
          <Column
            :header="$t('final_product_variants.variantValue')"
            style="min-width: 200px"
          >
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <span>{{ slotProps.data.variant_value.value }}</span>
                <small class="text-color-secondary">
                  ({{ slotProps.data.variant_value.value_ar }})
                </small>
              </div>
            </template>
          </Column>

          <!-- Created At Column -->
          <Column
            field="created_at"
            header="Created At"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>

          <!-- Actions Column -->
          <Column
            :header="$t('final_product_variants.actions')"
            style="min-width: 100px"
          >
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-text p-button-sm"
                @click="deleteVariant(slotProps.data)"
                v-tooltip.top="$t('final_product_variants.deleteVariant')"
              />
            </template>
          </Column>
        </DataTable>

        <!-- Empty State -->
        <div
          v-if="!loading && tableItems.length === 0"
          class="empty-state text-center py-6"
          :class="{ 'embedded-empty': embedded }"
        >
          <i class="pi pi-palette text-6xl text-color-secondary mb-3"></i>
          <h3 class="text-color-secondary">
            {{ $t("final_product_variants.noVariants") }}
          </h3>
          <p class="text-color-secondary mb-4">
            {{ $t("final_product_variants.addFirstVariant") }}
          </p>
          <Button
            :label="$t('final_product_variants.addVariants')"
            icon="pi pi-plus"
            @click="openCreateModal"
            class="p-button-primary"
          />
        </div>
      </template>
    </Card>

    <!-- Create Modal -->
    <FinalProductVariantCreateModal
      ref="createModal"
      :final_product_id="effectiveFinalProductId"
      :company_id="effectiveCompanyId"
      @variants-added="handleVariantsAdded"
    />

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

// Components
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";

// Modals
import FinalProductVariantCreateModal from "./FinalProductVariantCreateModal.vue";

export default {
  name: "FinalProductVariantsTable",
  components: {
    Card,
    DataTable,
    Column,
    Button,
    Toast,
    FinalProductVariantCreateModal,
  },
  directives: {
    tooltip: Tooltip,
  },
  mixins: [useTable(), useCrud()],
  props: {
    company_id: {
      type: String,
      required: true,
    },
    final_product_id: {
      type: String,
      required: true,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      finalProduct: null,
      effectiveCompanyId: null,
      effectiveFinalProductId: null,
    };
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-variant-values/search/${this.effectiveFinalProductId}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`;
    },
  },
  watch: {
    company_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveCompanyId = newVal;
        }
      },
    },
    final_product_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveFinalProductId = newVal;
        }
      },
    },
  },
  mounted() {
    console.log("🔍 Variants Table Mounted with embedded:", this.embedded, {
      company_id: this.company_id,
      final_product_id: this.final_product_id,
    });

    // Ensure we have the IDs
    this.effectiveCompanyId = this.company_id;
    this.effectiveFinalProductId = this.final_product_id;

    if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
      console.error("❌ Missing required IDs:", {
        company_id: this.effectiveCompanyId,
        final_product_id: this.effectiveFinalProductId,
      });
      return;
    }

    this.loadFinalProduct();
    this.getData();
  },
  methods: {
    async loadFinalProduct() {
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/product/final-product/${this.effectiveFinalProductId}`,
          {
            headers: general_request.headers,
          }
        );
        this.finalProduct = response.data.data;
        console.log("✅ Final product loaded:", this.finalProduct?.name);
      } catch (error) {
        console.error("Error loading final product:", error);
        if (!this.embedded) {
          this.showToast(
            "error",
            this.$t("common.error"),
            this.$t("final_product_variants.failedToLoadData")
          );
        }
      }
    },

    openCreateModal() {
      console.log("🔧 Opening create modal with:", {
        company_id: this.effectiveCompanyId,
        final_product_id: this.effectiveFinalProductId,
      });

      if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          "Missing company or product ID"
        );
        return;
      }

      this.$refs.createModal.openModal();
    },

    handleVariantsAdded(newVariants) {
      console.log("✅ New variants added:", newVariants);

      // Add new variants to the table
      newVariants.forEach((variant) => {
        this.tableItems.unshift(variant);
      });
      this.meta.total += newVariants.length;

      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("final_product_variants.variantsAdded")
      );
    },

    /**
     * Delete variant - uses useCrud confirmation dialog
     */
    deleteVariant(variant) {
      this.deleteItem(
        variant,
        this.propMainUrl,
        this.$t("final_product_variants.variantDeleted"),
        this.$t("final_product_variants.deleteError")
      );
    },

    goBack() {
      if (this.embedded) {
        // If embedded in modal, emit close event
        this.$emit("close-requested");
      } else {
        // If standalone page, navigate back
        this.$router.push({
          name: "company-final-products",
          params: { company_id: this.effectiveCompanyId },
        });
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return dateString;
      }
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },

    handlePageChange(event) {
      this.per_page = event.rows;
      this.meta.current_page = event.page + 1;
      this.getData();
    },
  },
};
</script>

<style scoped>
/* Embedded mode styles */
.embedded-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.embedded-mode .modal-header {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--surface-border);
}

.embedded-card {
  flex: 1;
  border: none;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.embedded-card :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.embedded-table {
  flex: 1;
  border-radius: 0;
}

.embedded-empty {
  margin: 2rem;
}

/* Original styles */
.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>
