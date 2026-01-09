export default {

     computed: {
     },
     data() {
          return {
               selectedImage: null
          };
     },
     methods: {

          truncateName(name, length = 20) {
               if (name.length <= length) return name;
               return name.substring(0, length) + "...";
          },

          openUploadModal() {

               if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
                    this.showToast(
                         "error",
                         this.$t("common.error"),
                         "Missing company or product ID"
                    );
                    return;
               }

               this.$refs.uploadModal.openModal();
          },

          previewImage(image) {
               this.selectedImage = image;
               this.$refs.previewModal.openModal();
          },

          async setAsMain(image) {
               try {
                    this.loading = true;

                    const url = `${general_request.BASE_URL}/admin/company/product/final-product-image/set-main/${image.id}`;
                    await this.$http.patch(
                         url,
                         {},
                         {
                              headers: general_request.headers,
                         }
                    );

                    // Refresh the data to get updated main image status
                    await this.getData();

                    this.showToast(
                         "success",
                         this.$t("common.success"),
                         this.$t("final_product_images.setMainSuccess")
                    );
               } catch (error) {
                    this.showToast(
                         "error",
                         this.$t("common.error"),
                         this.$t("final_product_images.setMainError")
                    );
               } finally {
                    this.loading = false;
               }
          },

          handleImagesUploaded(newImages) {
               // Add new images to the table
               newImages.forEach((image) => {
                    this.tableItems.unshift(image);
               });
               this.meta.total += newImages.length;

               this.showToast(
                    "success",
                    this.$t("common.success"),
                    this.$t("final_product_images.uploadSuccess")
               );
          },
     }
}