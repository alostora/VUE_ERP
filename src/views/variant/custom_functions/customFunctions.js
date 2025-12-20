
export default {
     methods: {

          viewVariantValues(variant) {
               this.$router.push({
                    name: "company-variant-values",
                    params: {
                         company_id: variant.company_id,
                         variant_id: variant.id
                    },
               });
          },
     }
}