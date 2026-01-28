export default {
     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.phoneRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.validation.phoneRequired");
               }


               return Object.keys(this.errors).length === 0;
          },
     }
}