<template>
  <Dialog
    :header="$t('cities.createCity')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <CityCreateForm
      :countryId="countryId"
      :governorateId="governorateId"
      @city-created="handleCityCreated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CityCreateForm from "./CityCreateForm.vue";

export default {
  name: "CityCreateModal",
  components: {
    Dialog,
    CityCreateForm,
  },
  props: {
    countryId: {
      type: String,
      default: null,
    },
    governorateId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCityCreated(newCity) {
      this.$emit("city-created", newCity);
      this.closeModal();
    },
  },
};
</script>
