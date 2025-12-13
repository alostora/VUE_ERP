export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.country_id) {
                    this.errors.country_id = this.$t("validation.countryRequired");
               }

               if (!this.formData.governorate_id) {
                    this.errors.governorate_id = this.$t("validation.governorateRequired");
               }

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.nameArRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.nameArRequired");
               }

               return Object.keys(this.errors).length === 0;
          },
     }
}