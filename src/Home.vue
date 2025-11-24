<template>
  <RouterView />
</template>

<script>
export default {
  data() {
    return {
      token: "",
      error_message: "",
    };
  },
  methods: {
    checkIfAuth() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    },
  },

  beforeCreate() {},

  created() {
    this.checkIfAuth();
  },
};
</script>
