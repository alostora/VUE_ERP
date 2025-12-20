export default {
     methods: {

          viewVariants(companyId) {
               this.$router.push({
                    name: "company-variants",
                    params: {
                         company_id: companyId,
                    },
               });
          },

          addValue() {
               this.formData.values.push({ value: "", value_ar: "" });
          },

          removeValue(index) {
               this.formData.values.splice(index, 1);
          },
     }
}