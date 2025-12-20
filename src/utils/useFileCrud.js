import general_request from "./general_request";

export function useFileCrud() {
     return {
          data() {
               return {

                    //file states
                    uploading: false,
                    uploadProgress: 0,
                    imagePreview: null,

                    selectedFile: null,
                    generalFile: null,

                    logoFile: null,
                    coverFile: null,
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

               onFileSelect(event, generalFile, formFileId = "file_id") {
                    this[generalFile] = event.files[0];
                    if (this[generalFile]) {
                         this.selectedFile = this[generalFile];

                         // Create preview
                         const reader = new FileReader();
                         reader.onload = (e) => {
                              this.imagePreview = e.target.result;
                         };
                         reader.readAsDataURL(this[generalFile]);
                    }

                    this.getSelectedFileId(generalFile, formFileId);
               },

               async getSelectedFileId(generalFile, formFileId = "file_id") {
                    let generalFileId = null;

                    if (this[generalFile]) {
                         generalFileId = await this.uploadFile(this[generalFile]);
                    }

                    if (generalFileId) {
                         this.formData[formFileId] = generalFileId;
                    }
               },

               getFilePreview(file) {
                    return URL.createObjectURL(file);
               },

               removeImage() {
                    this.generalFile = null;
                    this.selectedFile = null;
                    this.imagePreview = null;
                    this.formData.file_id = "";
               },
          }
     }
}