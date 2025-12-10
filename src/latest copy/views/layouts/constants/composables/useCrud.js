import general_request from "../general_request";

export function useCrud() {
     return {
          data() {
               return {
                    selectedItem: null,
                    formData: {},
                    formErrors: {},
                    formLoading: false
               }
          },

          methods: {
               async createItem(data, url, successMessage = null, errorMessage = null) {
                    this.formLoading = true;
                    try {
                         const response = await this.$http.post(url, data, {
                              headers: general_request.headers,
                         });

                         const newItem = response.data.data || response.data;

                         // Call handleItemCreated if it exists
                         if (typeof this.handleItemCreated === 'function') {
                              this.handleItemCreated(newItem);
                         }

                         this.showToast("success", "Success", successMessage || "Item created successfully");
                         return newItem;
                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to create item");
                         throw error;
                    } finally {
                         this.formLoading = false;
                    }
               },

               async updateItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.formLoading = true;
                    try {
                         const response = await this.$http.put(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         // Call handleItemUpdated if it exists
                         if (typeof this.handleItemUpdated === 'function') {
                              this.handleItemUpdated(updatedItem);
                         }

                         this.showToast("success", "Success", successMessage || "Item updated successfully");
                         return updatedItem;
                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to update item");
                         throw error;
                    } finally {
                         this.formLoading = false;
                    }
               },

               async patchItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.formLoading = true;
                    try {
                         const response = await this.$http.patch(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         if (typeof this.handleItemUpdated === 'function') {
                              this.handleItemUpdated(updatedItem);
                         }

                         this.showToast("success", "Success", successMessage || "Item updated successfully");
                         return updatedItem;
                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to update item");
                         throw error;
                    } finally {
                         this.formLoading = false;
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

                                        this.showToast("success", "Success", successMessage || "Item deleted successfully");
                                        resolve(true);
                                   } catch (error) {
                                        this.handleCrudError(error, errorMessage || "Failed to delete item");
                                        resolve(false);
                                   } finally {
                                        this.loading = false;
                                   }
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", "Deletion cancelled");
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
                                             successMessage || `${successCount} items deleted successfully`);
                                   }

                                   if (failCount > 0) {
                                        this.showToast("warn", "Partial Success",
                                             `${successCount} deleted, ${failCount} failed`);
                                   }

                                   resolve({ successCount, failCount });
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", "Bulk deletion cancelled");
                                   resolve({ successCount: 0, failCount: 0 });
                              }
                         });
                    });
               },

               handleCrudError(error, defaultMessage) {
                    console.error('CRUD Error:', error);

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
               },

               loadItemForEdit(item) {
                    this.selectedItem = { ...item };
                    this.formData = { ...item };
                    this.formErrors = {};
               },

               validateForm() {
                    this.formErrors = {};
                    // Add your validation logic here
                    return true;
               }
          }
     }
}