export default {
     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.email?.trim()) {
                    this.errors.email = this.$t("validation.emailRequired");
               } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = this.$t("validation.emailInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.email?.trim()) {
                    this.errors.email = this.$t("validation.validation.emailRequired");
               } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = this.$t("validation.validation.emailInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },

          isValidEmail(email) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               return emailRegex.test(email);
          },
     }
}