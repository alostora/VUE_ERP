<template>
  <Dialog
    :header="$t('users.createUser')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- User Create Form -->
    <UserCreateForm @user-created="handleUserCreated" @cancel="closeModal" />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("users.creatingUser") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import UserCreateForm from "./UserCreateForm.vue";

export default {
  name: "UserCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    UserCreateForm,
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

    handleUserCreated(newUser) {
      this.$emit("user-created", newUser);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>
