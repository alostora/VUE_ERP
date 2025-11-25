<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: singleVariant ? '50vw' : '70vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <VariantCreateForm
      :single-variant="singleVariant"
      :company_id="effectiveCompanyId"
      @variants-created="handleVariantsCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("variants.creatingVariant") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import VariantCreateForm from "./VariantCreateForm.vue";

export default {
  name: "VariantCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    VariantCreateForm,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    modalTitle() {
      return this.singleVariant
        ? this.$t("variants.createVariant")
        : this.$t("variants.createVariants");
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      singleVariant: true,
    };
  },
  methods: {
    openModal(single = true) {
      this.singleVariant = single;
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
    },

    handleVariantsCreated(newVariants) {
      this.$emit("variants-created", newVariants);
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
