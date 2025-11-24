<template>
  <Dialog
    :header="$t('cities.editCity')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <CityEditForm
      :city="city"
      :countryId="countryId"
      :governorateId="governorateId"
      @city-updated="handleCityUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CityEditForm from "./CityEditForm.vue";

export default {
  name: "CityEditModal",
  components: {
    Dialog,
    CityEditForm,
  },
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
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

    handleCityUpdated(updatedCity) {
      this.$emit("city-updated", updatedCity);
      this.closeModal();
    },
  },
};
</script>
