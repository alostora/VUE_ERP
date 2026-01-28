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

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.phoneRequired");
               }

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.addressRequired");
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

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.validation.phoneRequired");
               }

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.validation.addressRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          isValidEmail(email) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               return emailRegex.test(email);
          },
     }
}