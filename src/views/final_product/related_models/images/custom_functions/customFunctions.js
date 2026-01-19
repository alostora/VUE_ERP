import moduleUrl from "@/constants/moduleUrl";

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
               const url = `${moduleUrl.URLS.FINAL_PRODUCT_IMAGE.propMainUrl}/set-main`;
               await this.updateItem(image.id, {}, url);
               await this.getData(this.propSearchUrl);
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