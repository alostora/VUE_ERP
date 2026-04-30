export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.name_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.name_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },
     }
}