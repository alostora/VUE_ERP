export default {

     computed: {

          availableVariantsForRow() {

               return (currentIndex) => {
                    const selectedVariantIds = this.variantRows
                         .filter((_, index) => index !== currentIndex) // return result without duplicated values ->> the (_) is to ignore the first parameter (row), we only need the index
                         .map((row) => row.variant_id) // return variant_id
                         .filter((id) => id); // return variant_id that are not null/undefined

                    return this.variants.filter(
                         (variant) => !selectedVariantIds.includes(variant.id) // exclude already selected variants
                    );
               };
          },
     },
     data() {
          return {
               variants: [], // all available variants from loadVariants function
               variantValues: {},
               variantRows: [
                    {
                         variant_id: null,
                         variant_value_id: null,
                    },
               ],
          };
     },
     methods: {

          addVariantRow() {
               this.variantRows.push({
                    variant_id: null,
                    variant_value_id: null,
               });
          },

          removeVariantRow(index) {
               if (this.variantRows.length > 1) {
                    this.variantRows.splice(index, 1);

                    this.formData.variants = this.variantRows.filter(
                         (row) => row.variant_id && row.variant_value_id
                    );
               }

               console.log("rowIndex", index);
               console.log("ssssssssssssssssssss", this.formData.variants);
               console.log("rowIndex", index);
          },

          validatePrice() {
               if (!this.formData.price || this.formData.price <= 0) {
                    this.errors.price = this.$t("final_product.priceRequired");
               } else {
                    delete this.errors.price;
               }
          },

          getSelectedVariantName(variantId) {
               if (!variantId) return "";
               const variant = this.variants.find((v) => v.id === variantId);
               return variant ? variant.name : "";
          },

          getSelectedVariantValueName(valueId, variantId) {
               if (!valueId || !variantId) return "";
               const values = this.variantValues[variantId] || [];
               const value = values.find((v) => v.id === valueId);
               return value ? value.value : "";
          },

          getVariantValues(variantId) {
               if (!variantId) return [];
               return this.variantValues[variantId] || [];
          },

          getVariantLabel(variant) {
               return `${variant.variant?.name}: ${variant.variant_value.value}`;
          },
     }
}