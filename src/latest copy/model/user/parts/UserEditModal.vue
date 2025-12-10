<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <!-- User Edit Form -->
    <UserEditForm
      :user="user"
      @user-updated="handleUserUpdated"
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
import UserEditForm from "./UserEditForm.vue";

export default {
  name: "UserEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    UserEditForm,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
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
      return this.user?.id
        ? this.$t("users.editUser")
        : this.$t("users.createUser");
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

    handleUserUpdated(updatedUser) {
      this.$emit("user-updated", updatedUser);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

