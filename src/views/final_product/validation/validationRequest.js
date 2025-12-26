export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.selectedCategory) {
                    this.errors.category_id = this.$t("final_product.categoryRequired");
               }

               if (!this.selectedProduct) {
                    this.errors.product_id = this.$t("final_product.productRequired");
               }

               if (!this.formData.price || this.formData.price <= 0) {
                    this.errors.price = this.$t("final_product.priceRequired");
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

               this.variantRows.forEach((row, index) => {
                    if (row.variant_id && !row.variant_value_id) {
                         this.errors[`variant_row_${index}`] = this.$t(
                              "final_product.variantValueRequired"
                         );
                    }
               });

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.id?.trim()) {
                    this.errors.id = this.$t("validation.idRequired");
               }

               if (!this.formData.price || this.formData.price <= 0) {
                    this.errors.price = this.$t("final_product.priceRequired");
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