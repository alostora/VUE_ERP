<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <!-- Category Edit Form -->
    <CategoryEditForm
      :category="category"
      :company_id="company_id"
      @category-updated="handleCategoryUpdated"
      @cancel="closeModal"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import CategoryEditForm from "./CategoryEditForm.vue";

export default {
  name: "CategoryEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    CategoryEditForm,
  },
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  computed: {
    headerText() {
      return this.category?.id
        ? this.$t("categories.editCategory")
        : this.$t("categories.createCategory");
    },
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleCategoryUpdated(updatedCategory) {
      this.$emit("category-updated", updatedCategory);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
