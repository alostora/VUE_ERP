export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.client_id) {
                    this.errors.client_id = this.$t("validation.clientRequired");
               }

               if (!this.formData.country_id) {
                    this.errors.country_id = this.$t("validation.countryRequired");
               }

               if (!this.formData.governorate_id) {
                    this.errors.governorate_id = this.$t("validation.governorateRequired");
               }

               if (!this.formData.city_id) {
                    this.errors.city_id = this.$t("validation.cityRequired");
               }

               if (!this.formData.currency_id) {
                    this.errors.currency_id = this.$t("validation.currencyRequired");
               }

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.nameArRequired");
               }

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.phoneRequired");
               }

               if (!this.formData.email?.trim()) {
                    this.errors.email = this.$t("validation.emailRequired");
               } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = this.$t("validation.emailInvalid");
               }

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.addressRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.country_id) {
                    this.errors.country_id = this.$t("validation.countryRequired");
               }

               if (!this.formData.governorate_id) {
                    this.errors.governorate_id = this.$t("validation.governorateRequired");
               }

               if (!this.formData.city_id) {
                    this.errors.city_id = this.$t("validation.cityRequired");
               }

               if (!this.formData.currency_id) {
                    this.errors.currency_id = this.$t("validation.currencyRequired");
               }

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("validation.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("validation.nameArRequired");
               }

               if (!this.formData.phone?.trim()) {
                    this.errors.phone = this.$t("validation.phoneRequired");
               }

               if (!this.formData.email?.trim()) {
                    this.errors.email = this.$t("validation.emailRequired");
               } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = this.$t("validation.emailInvalid");
               }

               if (!this.formData.address?.trim()) {
                    this.errors.address = this.$t("validation.addressRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          isValidEmail(email) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               return emailRegex.test(email);
          },
     }
}