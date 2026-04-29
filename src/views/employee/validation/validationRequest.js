export default {
     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.email?.trim()) {
                    this.errors.email = this.$t("validation.emailRequired");
               } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = this.$t("validation.emailInvalid");
               }

               if (!this.formData.password) {
                    this.errors.password = this.$t("validation.passwordRequired");
               } else if (this.formData.password.length < 6) {
                    this.errors.password = this.$t("validation.passwordMinLength");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.validation.nameRequired");
               }

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