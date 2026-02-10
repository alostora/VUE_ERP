export default {
     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("discounts.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("discounts.nameArRequired");
               }

               if (!this.formData.type_id) {
                    this.errors.type_id = this.$t("discounts.typeRequired");
               }

               if (!this.formData.value && this.formData.value !== 0) {
                    this.errors.value = this.$t("discounts.valueRequired");
               } else if (this.formData.value < 0) {
                    this.errors.value = this.$t("discounts.valueInvalid");
               }

               if (!this.formData.date_from) {
                    this.errors.date_from = this.$t("discounts.dateFromRequired");
               }

               if (!this.formData.date_to) {
                    this.errors.date_to = this.$t("discounts.dateToRequired");
               } else if (
                    this.formData.date_from &&
                    this.formData.date_to < this.formData.date_from
               ) {
                    this.errors.date_to = this.$t("discounts.dateToInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.name?.trim()) {
                    this.errors.name = this.$t("discounts.nameRequired");
               }

               if (!this.formData.name_ar?.trim()) {
                    this.errors.name_ar = this.$t("discounts.nameArRequired");
               }

               if (!this.formData.type_id) {
                    this.errors.type_id = this.$t("discounts.typeRequired");
               }

               if (!this.formData.value && this.formData.value !== 0) {
                    this.errors.value = this.$t("discounts.valueRequired");
               } else if (this.formData.value < 0) {
                    this.errors.value = this.$t("discounts.valueInvalid");
               }

               if (!this.formData.date_from) {
                    this.errors.date_from = this.$t("discounts.dateFromRequired");
               }

               if (!this.formData.date_to) {
                    this.errors.date_to = this.$t("discounts.dateToRequired");
               } else if (
                    this.formData.date_from &&
                    this.formData.date_to < this.formData.date_from
               ) {
                    this.errors.date_to = this.$t("discounts.dateToInvalid");
               }

               return Object.keys(this.errors).length === 0;
          },

          isValidEmail(email) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               return emailRegex.test(email);
          },
     }
}