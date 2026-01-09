<template>
  <Dialog
    :header="this.$t('final_product_variants.table')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="table-page">
      <div class="table-wrapper">
        <div class="table-header">
          <h1 class="table-title">{{ $t("final_product_variants.title") }}</h1>
          <div class="table-actions">
            <Button
              :label="$t('final_product_variants.add')"
              icon="pi pi-plus"
              @click="openCreateModel(this.$props.selected_item)"
              class="p-button-primary"
            />
          </div>
        </div>

        <div class="table-filters">
          <div class="search-container flex-1 w-full">
            <InputText
              v-model="query_string"
              :placeholder="$t('final_product_variants.search')"
              @input="handleSearchInput"
              class="search-input w-20rem"
            />
            <i class="pi pi-search search-icon" />
          </div>

          <Select
            v-model="per_page"
            :options="perPageOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('final_product_variants.show')"
            @change="getData(propSearchUrl)"
            class="w-10rem"
          />
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
                      v-tooltip.top="
                        $t('final_product_images.setAsMainTooltip')
                      "
                    />

                    <Button
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-danger action-btn"
                      @click="deleteRow(image)"
                      v-tooltip.top="$t('final_product_images.deleteTooltip')"
                    />
                  </div>
                </div>

                <!-- Image Info -->
                <div class="image-info">
                  <div class="image-name" :title="image.file.original_name">
                    {{ truncateName(image.file.original_name) }}
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

        <CreateForm
          ref="createModalForm"
          :selected_item="selectedItem"
          @created="handleCreated"
        />
        <!-- Preview Modal -->
        <ImagePreviewModal ref="previewModal" :image="selectedImage" />

        <Toast />
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Card from "primevue/card";
import ImagePreviewModal from "./ImagePreviewModal.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import CreateForm from "./CreateForm.vue";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import customFunctions from "../custom_functions/customFunctions";

export default {
  name: "Table",

  mixins: [useTable(), useCrud(), customFunctions],

  components: {
    Dialog,
    CreateForm,
    Card,
    ImagePreviewModal,
    InputText,
    Button,
    Select,
    ProgressSpinner,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    selected_item: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    selected_item: {
      immediate: true,
      deep: true,
      handler(selectedItem) {
        if (selectedItem && selectedItem.id) {
          this.companyId = selectedItem.company_id;
          this.final_product_id = selectedItem.id;
          this.$nextTick(() => {
            this.getData(this.propSearchUrl);
          });
        }
      },
    },
  },

  computed: {
    propSearchUrl() {
      let url = `${moduleUrl.URLS.FINAL_PRODUCT_IMAGE.propSearchUrl}/${this.final_product_id}?paginate=true`;
      return url;
    },
  },

  data() {
    return {
      companyId: null,
      final_product_id: null,
      propMainUrl: moduleUrl.URLS.FINAL_PRODUCT_IMAGE.propMainUrl,
    };
  },

  methods: {
    openCreateModel(item) {
      console.log("itemitemitemitemitemitemitemitemitemitem", item);

      this.selectedItem = { ...item };
      this.$nextTick(() => {
        this.$refs.createModalForm.openModal();
      });
    },

    handleCreated(newItem) {
      this.handleItemCreated(newItem);
    },

    deleteRow(item) {
      this.deleteItem(
        item,
        this.propMainUrl,
        this.$t("common.itemDeleted"),
        this.$t("common.failedToDeleteItem")
      );
    },
  },
};
</script>

<style scoped>
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
