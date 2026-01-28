export default {

     methods: {
          validateCreateForm() {
               this.errors = {};


               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("taxes.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("taxes.nameArRequired");
               }

               if (!this.formData.value && this.formData.value !== 0) {
                    this.errors.value = this.$t("taxes.valueRequired");
               } else if (this.formData.value < 0 || this.formData.value > 100) {
                    this.errors.value = this.$t("taxes.valueInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("taxes.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("taxes.nameArRequired");
               }

               if (!this.formData.value && this.formData.value !== 0) {
                    this.errors.value = this.$t("taxes.valueRequired");
               } else if (this.formData.value < 0 || this.formData.value > 100) {
                    this.errors.value = this.$t("taxes.valueInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },
     }
}