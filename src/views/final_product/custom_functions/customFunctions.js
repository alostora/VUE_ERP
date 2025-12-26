export default {
     data() {
          return {
               variants: [],
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
               }
          },

          validatePrice() {
               if (!this.formData.price || this.formData.price <= 0) {
                    this.errors.price = this.$t("final_product.priceRequired");
               } else {
                    delete this.errors.price;
               }
          },

          async onVariantChange(rowIndex, event) {
               const variantId = event.value;

               this.variantRows[rowIndex].variant_value_id = null;

               if (variantId) {
                    await this.loadVariantValues(variantId);
               }

               this.$forceUpdate();
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
     }
}