import general_request from "./general_request";

export function useFileCrud() {
     return {
          data() {
               return {

                    //file states
                    uploading: false,
                    uploadProgress: 0,

                    generalFile: null, // for any file
                    logoFile: null, // only company logo
                    coverFile: null, //only company cover
               }
          },

          methods: {

               async uploadFile(file) {

                    this.uploading = true;
                    this.uploadProgress = 0;

                    try {
                         const formData = new FormData();
                         formData.append("file", file);

                         const response = await this.$http.post(
                              `${general_request.BASE_URL}/storage/file`,
                              formData,
                              {
                                   headers: {
                                        ...general_request.headers,
                                        "Content-Type": "multipart/form-data",
                                   },
                                   onUploadProgress: (progressEvent) => {
                                        if (progressEvent.total) {
                                             this.uploadProgress = Math.round(
                                                  (progressEvent.loaded * 100) / progressEvent.total
                                             );
                                        }
                                   },
                              }
                         );

                         return response.data.data.id;
                    } catch (error) {
                         this.handleCrudError(error, error.response.data.message || this.$t("common.failedToUploadFile"));
                         resolve(false);
                    } finally {
                         this.uploading = false;
                         this.uploadProgress = 0;
                    }
               },

               onFileSelect(event, fileModule = 'generalFile', formFileId = "file_id") {

                    this[fileModule] = event.files[0];

                    if (this[fileModule]) {

                         const reader = new FileReader();

                         reader.readAsDataURL(this[fileModule]);
                    }

                    this.getSelectedFileId(fileModule, formFileId);
               },

               async getSelectedFileId(fileModule = 'generalFile', formFileId = "file_id") {
                    let fileId = null;

                    if (this[fileModule]) {
                         fileId = await this.uploadFile(this[fileModule]);
                    }

                    if (fileId) {
                         this.formData[formFileId] = fileId;
                    }
               },

               getFilePreview(file) {
                    return URL.createObjectURL(file);
               },

               removeImage() {
                    this.generalFile = null;
                    this.logoFile = null;
                    this.coverFile = null;
                    this.formData.file_id = "";
                    this.formData.logo_id = "";
                    this.formData.cover_id = "";
               },
          }
     }
}