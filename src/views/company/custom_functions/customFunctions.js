export default {
     methods: {

          viewCompany(company) {
               this.$router.push({
                    name: "company-show",
                    params: { company_id: company.id },
               });
          },
     }
}