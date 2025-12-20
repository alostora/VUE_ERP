export default {

     methods: {
          validateCreateForm() {
               this.errors = {};

               if (!this.formData.value?.trim()) {
                    this.errors.value = this.$t("validation.valueRequired");
               }

               if (!this.formData.value_ar?.trim()) {
                    this.errors.value_ar = this.$t("validation.value_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateUpdateForm() {
               this.errors = {};

               if (!this.formData.value?.trim()) {
                    this.errors.value = this.$t("validation.valueRequired");
               }

               if (!this.formData.value_ar?.trim()) {
                    this.errors.value_ar = this.$t("validation.value_arRequired");
               }

               return Object.keys(this.errors).length === 0;
          },

          validateMultipleForm() {
               this.error = [];
               let isValid = true;

               if (this.formData.values.length === 0) {
                    this.error = this.$t("variants.atLeastOneValue");
                    return false;
               }

               this.formData.values.forEach((value, index) => {
                    const valueError = {};

                    if (!value.value?.trim()) {
                         valueError.value = this.$t("variants.valueRequired");
                         isValid = false;
                    }

                    if (!value.value_ar?.trim()) {
                         valueError.value_ar = this.$t("variants.valueArRequired");
                         isValid = false;
                    }

                    if (Object.keys(valueError).length > 0) {
                         this.error[index] = valueError;
                    }
               });

               return isValid;
          },
     }

}