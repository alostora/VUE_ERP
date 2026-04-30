export default {
     methods: {

          viewBranch(branch) {
               this.$router.push({
                    name: "branch-show",
                    params: {
                         company_id: branch.company_id,
                         branch_id: branch.id
                    },
               });
          },
     }
}
