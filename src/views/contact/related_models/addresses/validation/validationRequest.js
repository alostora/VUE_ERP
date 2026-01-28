export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.addressRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.addressRequired");
               }

               return Object.keys(this.errors).length === 0;
          },
     }
}