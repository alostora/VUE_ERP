export default {

     methods: {
          validateCreateForm() {

               this.errors = {};

               if (this.selectedBranches.length === 0) {
                    this.errors.branch_ids = this.$t('discounts.productsRequired') || 'At least one branch is required';
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               return Object.keys(this.errors).length === 0;
          },
     }
}