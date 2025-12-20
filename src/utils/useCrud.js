import general_request from "./general_request";

export function useCrud() {
     return {
          data() {
               return {
                    error: "",
                    errors: {},
                    formData: {},
                    formErrors: {},

                    visible: false,
                    loading: false,
                    selectedItem: null,

                    //optional for some models
                    selectedClient: null,
                    selectedCountry: null,
                    selectedGovernorate: null,
                    selectedCity: null,
                    selectedCurrency: null,
               }
          },

          methods: {
               async createItem(data, url, successMessage = null, errorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.post(url, data, {
                              headers: general_request.headers,
                         });

                         const newItem = response.data.data || response.data;

                         // Call handleItemCreated if it exists
                         if (typeof this.handleItemCreated === 'function') {
                              this.handleItemCreated(newItem);
                         }

                         this.showToast("success", "Success", successMessage || this.$t("common.itemCreated"));
                         return newItem;
                    } catch (error) {
                         this.handleCrudError(error, error.response.data.message || this.$t("common.failedToCreateItem"));
                         throw error;
                    } finally {
                         this.loading = false;
                    }
               },

               async updateItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.patch(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         // Call handleItemUpdated if it exists
                         if (typeof this.handleItemUpdated === 'function') {
                              this.handleItemUpdated(updatedItem);
                         }

                         this.showToast("success", "Success", successMessage || this.$t("common.itemUpdatedSuccessfully"));
                         return updatedItem;
                    } catch (error) {
                         this.handleCrudError(error, error.response.data.message || this.$t("common.failedToUpdateItem"));
                         throw error;
                    } finally {
                         this.loading = false;
                    }
               },

               async patchItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.patch(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         if (typeof this.handleItemUpdated === 'function') {
                              this.handleItemUpdated(updatedItem);
                         }

                         this.showToast("success", "Success", successMessage || this.$t("common.itemUpdatedSuccessfully"));
                         return updatedItem;
                    } catch (error) {
                         this.handleCrudError(error, error.response.data.message || this.$t("common.failedToUpdateItem"));
                         throw error;
                    } finally {
                         this.loading = false;
                    }
               },

               async deleteItem(item, baseUrl, successMessage = null, errorMessage = null) {
                    return new Promise((resolve) => {
                         this.$confirm.require({
                              message: `Delete ${item.name || item.title || 'this item'}?`,
                              header: 'Confirmation',
                              icon: "pi pi-exclamation-triangle",
                              acceptClass: "p-button-danger",
                              accept: async () => {
                                   try {
                                        this.loading = true;
                                        const url = `${baseUrl}/${item.id}`;
                                        await this.$http.delete(url, {
                                             headers: general_request.headers,
                                        });

                                        // Call handleItemDeleted if it exists
                                        if (typeof this.handleItemDeleted === 'function') {
                                             this.handleItemDeleted(item.id);
                                        }

                                        this.showToast("success", "Success", successMessage || this.$t("common.itemDeletedSuccessfully"));
                                        resolve(true);
                                   } catch (error) {
                                        this.handleCrudError(error, error.response.data.message || this.$t("common.failedToDeleteItem"));
                                        resolve(false);
                                   } finally {
                                        this.loading = false;
                                   }
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", this.$t("common.deletionCancelled"));
                                   resolve(false);
                              }
                         });
                    });
               },

               async bulkDelete(items, baseUrl, successMessage = null, errorMessage = null) {
                    if (!items || items.length === 0) return;

                    return new Promise((resolve) => {
                         this.$confirm.require({
                              message: `Delete ${items.length} selected items?`,
                              header: 'Confirmation',
                              icon: "pi pi-exclamation-triangle",
                              acceptClass: "p-button-danger",
                              accept: async () => {
                                   this.loading = true;
                                   let successCount = 0;
                                   let failCount = 0;

                                   for (const item of items) {
                                        try {
                                             await this.$http.delete(`${baseUrl}/${item.id}`, {
                                                  headers: general_request.headers,
                                             });
                                             successCount++;

                                             if (typeof this.handleItemDeleted === 'function') {
                                                  this.handleItemDeleted(item.id);
                                             }
                                        } catch (error) {
                                             failCount++;
                                        }
                                   }

                                   this.loading = false;

                                   if (successCount > 0) {
                                        this.showToast("success", "Success",
                                             successMessage || `${successCount} ` + this.$t("common.itemDeletedSuccessfully"));
                                   }

                                   if (failCount > 0) {
                                        this.showToast("warn", "Partial Success",
                                             `${successCount} deleted, ${failCount} ` + this.$t("common.failedToDeleteItem"));
                                   }

                                   resolve({ successCount, failCount });
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", this.$t("common.deletionCancelled"));
                                   resolve({ successCount: 0, failCount: 0 });
                              }
                         });
                    });
               },

               handleCrudError(error, defaultMessage) {

                    if (error.response?.status === 422 && error.response.data.errors) {
                         this.formErrors = error.response.data.errors;

                         const errorMessages = Object.values(error.response.data.errors)
                              .flat()
                              .join(', ');

                         this.showToast("error", "Validation Error", errorMessages);
                         return;
                    }

                    let message = defaultMessage;

                    switch (error.response?.status) {
                         case 401:
                              message = "Your session has expired. Please login again.";
                              break;
                         case 403:
                              message = "You don't have permission to perform this action.";
                              break;
                         case 404:
                              message = "The requested resource was not found.";
                              break;
                         case 500:
                              message = "Internal server error. Please try again later.";
                              break;
                    }

                    this.showToast("error", "Error", message);
               },

               showToast(severity, summary, detail) {
                    if (this.$toast) {
                         this.$toast.add({
                              severity: severity,
                              summary: summary,
                              detail: detail,
                              life: 3000,
                         });
                    }
               },

               initFormData(defaultData = {}) {
                    this.formData = { ...defaultData };
                    this.formErrors = {};
               },

               resetForm() {
                    this.formData = {};
                    this.formErrors = {};
                    this.selectedItem = null;


                    this.selectedClient = null;
                    this.selectedCountry = null;
                    this.selectedGovernorate = null;
                    this.selectedCity = null;
                    this.selectedCurrency = null;
                    this.logoFile = null;
                    this.coverFile = null;
                    this.generalFile = null;
               },

               openModal() {
                    this.visible = true;
               },

               closeModal() {
                    this.visible = false;
                    this.loading = false;
                    this.formErrors = {};
                    this.errors = {};
                    this.resetForm();
               },
          }
     }
}