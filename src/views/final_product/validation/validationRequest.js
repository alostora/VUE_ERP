export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.company_id?.trim()) {
                    this.errors.company_id = this.$t("validation.company_idRequired");
               }

               if (!this.formData.category_id?.trim()) {
                    this.errors.category_id = this.$t("validation.category_idRequired");
               }

               if (!this.formData.purchases_measurement_unit_id?.trim()) {
                    this.errors.purchases_measurement_unit_id = this.$t("validation.purchases_measurement_unit_idRequired");
               }

               if (!this.formData.sales_measurement_unit_id?.trim()) {
                    this.errors.sales_measurement_unit_id = this.$t("validation.sales_measurement_unit_idRequired");
               }

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.name_arRequired");
               }

               if (!this.formData.details?.trim()) {
                    this.errors.details = this.$t("validation.detailsRequired");
               }

               if (!this.formData.details_ar?.trim()) {
                    this.errors.details_ar = this.$t("validation.details_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.id?.trim()) {
                    this.errors.id = this.$t("validation.idRequired");
               }

               if (!this.formData.purchases_measurement_unit_id?.trim()) {
                    this.errors.purchases_measurement_unit_id = this.$t("validation.purchases_measurement_unit_idRequired");
               }

               if (!this.formData.sales_measurement_unit_id?.trim()) {
                    this.errors.sales_measurement_unit_id = this.$t("validation.sales_measurement_unit_idRequired");
               }

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.name_arRequired");
               }

               if (!this.formData.details?.trim()) {
                    this.errors.details = this.$t("validation.detailsRequired");
               }

               if (!this.formData.details_ar?.trim()) {
                    this.errors.details_ar = this.$t("validation.details_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },
     }
}