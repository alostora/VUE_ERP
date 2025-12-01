<template>
  <Dialog
    :header="$t('employees.createEmployee')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <EmployeeCreateForm
      :company_id="effectiveCompanyId"
      :branch_id="effectiveBranchId"
      @employee-created="handleEmployeeCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("employees.creatingEmployee") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import EmployeeCreateForm from "./EmployeeCreateForm.vue";

export default {
  name: "EmployeeCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    EmployeeCreateForm,
  },
  props: {
    company_id: {
      type: String,
      default: null,
    },
    branch_id: {
      type: String,
      default: null,
    },
  },
  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
    effectiveBranchId() {
      return this.branch_id || this.$route.params.branch_id;
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
      this.loading = false;
    },
    handleEmployeeCreated(newEmployee) {
      this.$emit("employee-created", newEmployee);
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
