<template>
  <div
    class="final-product-images-table"
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
            :label="$t('final_product_images.backToProducts')"
          />
          <h2 class="m-0">
            {{ $t("final_product_images.title") }} -
            <span class="text-primary">{{
              finalProduct?.name || "Loading..."
            }}</span>
          </h2>
        </div>
        <Button
          :label="$t('final_product_images.uploadImages')"
          icon="pi pi-plus"
          @click="openUploadModal"
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
            {{ $t("final_product_images.manageImages") }}
          </p>
        </div>
        <Button
          :label="$t('final_product_images.uploadImages')"
          icon="pi pi-plus"
          @click="openUploadModal"
          class="p-button-primary p-button-sm"
        />
      </div>
    </div>

    <!-- Images Gallery -->
    <Card :class="{ 'embedded-card': embedded }">
      <template #content>
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-6">
          <ProgressSpinner />
          <p class="mt-2">{{ $t("common.loading") }}</p>
        </div>

        <!-- Images Grid -->
        <div v-else-if="tableItems.length > 0" class="images-grid p-4">
          <div
            v-for="image in tableItems"
            :key="image.id"
            class="image-card"
            :class="{ 'main-image': image.is_main }"
          >
            <div class="image-container">
              <img
                :src="image.file.file_path"
                :alt="image.file.original_name"
                class="product-image"
                @click="previewImage(image)"
              />

              <!-- Main Image Badge -->
              <div v-if="image.is_main" class="main-badge">
                <i class="pi pi-star-fill"></i>
                <span>{{ $t("final_product_images.mainImage") }}</span>
              </div>

              <!-- Actions Overlay -->
              <div class="image-actions">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-plain action-btn"
                  @click="previewImage(image)"
                  v-tooltip.top="$t('final_product_images.viewLarge')"
                />

                <Button
                  v-if="!image.is_main"
                  icon="pi pi-star"
                  class="p-button-rounded p-button-text p-button-warning action-btn"
                  @click="setAsMain(image)"
                  v-tooltip.top="$t('final_product_images.setAsMainTooltip')"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger action-btn"
                  @click="deleteImage(image)"
                  v-tooltip.top="$t('final_product_images.deleteTooltip')"
                />
              </div>
            </div>

            <!-- Image Info -->
            <div class="image-info">
              <div class="image-name" :title="image.file.original_name">
                {{ truncateName(image.file.original_name) }}
              </div>
              <div class="image-meta">
                <small class="text-color-secondary">
                  {{ formatFileSize(image.file) }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="empty-state text-center py-6"
          :class="{ 'embedded-empty': embedded }"
        >
          <i class="pi pi-image text-6xl text-color-secondary mb-3"></i>
          <h3 class="text-color-secondary">
            {{ $t("final_product_images.noImages") }}
          </h3>
          <p class="text-color-secondary mb-4">
            {{ $t("final_product_images.addFirstImage") }}
          </p>
          <Button
            :label="$t('final_product_images.uploadImages')"
            icon="pi pi-plus"
            @click="openUploadModal"
            class="p-button-primary"
          />
        </div>
      </template>
    </Card>

    <!-- Upload Modal -->
    <FinalProductImageUploadModal
      ref="uploadModal"
      :final_product_id="effectiveFinalProductId"
      :company_id="effectiveCompanyId"
      @images-uploaded="handleImagesUploaded"
    />

    <!-- Preview Modal -->
    <FinalProductImagePreviewModal ref="previewModal" :image="selectedImage" />

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

// Components
import Card from "primevue/card";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";

// Modals
import FinalProductImageUploadModal from "./FinalProductImageUploadModal.vue";
import FinalProductImagePreviewModal from "./FinalProductImagePreviewModal.vue";

export default {
  name: "FinalProductImageTable",
  components: {
    Card,
    Button,
    ProgressSpinner,
    Toast,
    FinalProductImageUploadModal,
    FinalProductImagePreviewModal,
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
      selectedImage: null,
    };
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-images/search/${this.effectiveFinalProductId}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-image`;
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

    // Ensure we have the IDs
    this.effectiveCompanyId = this.company_id;
    this.effectiveFinalProductId = this.final_product_id;

    if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
      
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
      } catch (error) {
        if (!this.embedded) {
          this.showToast(
            "error",
            this.$t("common.error"),
            this.$t("errors.failedToLoadData")
          );
        }
      }
    },

    openUploadModal() {

      if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          "Missing company or product ID"
        );
        return;
      }

      this.$refs.uploadModal.openModal();
    },

    previewImage(image) {
      this.selectedImage = image;
      this.$refs.previewModal.openModal();
    },

    async setAsMain(image) {
      try {
        this.loading = true;

        const url = `${general_request.BASE_URL}/admin/company/product/final-product-image/set-main/${image.id}`;
        await this.$http.patch(
          url,
          {},
          {
            headers: general_request.headers,
          }
        );

        // Refresh the data to get updated main image status
        await this.getData();

        this.showToast(
          "success",
          this.$t("common.success"),
          this.$t("final_product_images.setMainSuccess")
        );
      } catch (error) {
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product_images.setMainError")
        );
      } finally {
        this.loading = false;
      }
    },

    deleteImage(image) {
      this.deleteItem(
        image,
        this.propMainUrl,
        this.$t("final_product_images.deleteSuccess"),
        this.$t("final_product_images.deleteError")
      );
    },

    handleImagesUploaded(newImages) {
      // Add new images to the table
      newImages.forEach((image) => {
        this.tableItems.unshift(image);
      });
      this.meta.total += newImages.length;

      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("final_product_images.uploadSuccess")
      );
    },

    truncateName(name, length = 20) {
      if (name.length <= length) return name;
      return name.substring(0, length) + "...";
    },

    formatFileSize(file) {
      // This is a placeholder - you might need to get file size from your API
      return "2.5 MB"; // You can enhance this with actual file size data
    },

    goBack() {
      if (this.embedded) {
        this.$emit("close-requested");
      } else {
        this.$router.push({
          name: "company-final-products",
          params: { company_id: this.effectiveCompanyId },
        });
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
  },
};
</script>

<style scoped>
.final-product-images-table {
  height: 100%;
}

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

.embedded-empty {
  margin: 2rem;
}

/* Page Header */
.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.modal-header {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--surface-border);
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  align-content: start;
  padding: 1.5rem;
}

.image-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--surface-card);
}

.image-card.main-image {
  border: 2px solid var(--primary-500);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.main-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--primary-500);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.main-badge i {
  font-size: 0.7rem;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-actions {
  opacity: 1;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.image-info {
  padding: 0.75rem;
  border-top: 1px solid var(--surface-border);
}

.image-name {
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-meta {
  font-size: 0.75rem;
}

/* Empty State */
.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
  text-align: center;
  padding: 3rem;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

/* Buttons */
.p-button-primary {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.p-button-primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

.p-button-text {
  color: var(--text-color-secondary);
}

.p-button-text:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}

/* Progress Spinner */
:deep(.p-progress-spinner) {
  width: 50px;
  height: 50px;
}

:deep(.p-progress-spinner-circle) {
  stroke: var(--primary-500);
}

/* Card Styles */
:deep(.p-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--surface-border);
}

:deep(.p-card-content) {
  padding: 0;
}

/* Tooltip */
:deep(.p-tooltip) {
  max-width: 200px;
}

:deep(.p-tooltip-text) {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .image-actions {
    opacity: 1;
  }

  .action-btn {
    width: 1.75rem;
    height: 1.75rem;
  }

  .main-badge {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
  }

  .image-card {
    border-radius: 6px;
  }

  .product-image {
    border-radius: 6px 6px 0 0;
  }
}

/* Dark Mode Support */
.dark-mode .image-card {
  background: var(--surface-800);
  border-color: var(--surface-700);
}

.dark-mode .action-btn {
  background: rgba(0, 0, 0, 0.8) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.dark-mode .action-btn:hover {
  background: rgba(0, 0, 0, 0.9) !important;
}

.dark-mode .empty-state {
  background: var(--surface-800);
  border-color: var(--surface-700);
}

/* Animation for image cards */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-card {
  animation: fadeIn 0.3s ease;
}

/* Scrollbar for images grid */
.images-grid::-webkit-scrollbar {
  width: 6px;
}

.images-grid::-webkit-scrollbar-track {
  background: var(--surface-ground);
}

.images-grid::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 3px;
}

.images-grid::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-secondary);
}
</style>
