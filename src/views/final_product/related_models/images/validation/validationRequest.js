export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.final_product_id?.trim()) {
                    this.errors.final_product_id = this.$t("validation.final_product_idRequired");
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

          validateUpdateForm() { },
     }
}