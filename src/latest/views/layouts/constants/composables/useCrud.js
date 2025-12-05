// src/latest/views/layouts/constants/composables/useCrud.js

import general_request from "../general_request";

/**
 * Enhanced CRUD operations composable with better error handling
 */
export function useCrud() {
     return {
          data() {
               return {
                    // CRUD state
                    selectedItem: null,
                    isCreating: false,
                    isUpdating: false,
                    isDeleting: false,

                    // Form state
                    formData: {},
                    formErrors: {},
                    formLoading: false,

                    // Validation
                    validationRules: {},
                    isValid: false
               };
          },

          methods: {
               // ==================== CREATE OPERATIONS ====================

               /**
                * Create new item
                */
               async createItem(data, url, successMessage = null, errorMessage = null) {
                    this.isCreating = true;
                    this.formLoading = true;
                    this.formErrors = {};

                    try {
                         const response = await this.$http.post(url, data, {
                              headers: general_request.headers,
                         });

                         const newItem = response.data.data || response.data;

                         // Show success message
                         const message = successMessage || this.$t("common.createdSuccess") || "Item created successfully";
                         this.showToast("success", this.$t("common.success") || "Success", message);

                         // Emit event
                         this.$emit('item-created', newItem);

                         // Call handler if exists
                         if (this.handleItemCreated) {
                              this.handleItemCreated(newItem);
                         }

                         return newItem;

                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to create item");
                         throw error;
                    } finally {
                         this.isCreating = false;
                         this.formLoading = false;
                    }
               },

               // ==================== READ OPERATIONS ====================

               /**
                * Get single item by ID
                */
               async getItem(id, url, errorMessage = null) {
                    try {
                         const response = await this.$http.get(`${url}/${id}`, {
                              headers: general_request.headers,
                         });

                         return response.data.data || response.data;

                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to fetch item");
                         throw error;
                    }
               },

               // ==================== UPDATE OPERATIONS ====================

               /**
                * Update existing item
                */
               async updateItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.isUpdating = true;
                    this.formLoading = true;
                    this.formErrors = {};

                    try {
                         const response = await this.$http.put(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         // Show success message
                         const message = successMessage || this.$t("common.updatedSuccess") || "Item updated successfully";
                         this.showToast("success", this.$t("common.success") || "Success", message);

                         // Emit event
                         this.$emit('item-updated', updatedItem);

                         // Call handler if exists
                         if (this.handleItemUpdated) {
                              this.handleItemUpdated(updatedItem);
                         }

                         return updatedItem;

                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to update item");
                         throw error;
                    } finally {
                         this.isUpdating = false;
                         this.formLoading = false;
                    }
               },

               /**
                * Partial update (PATCH)
                */
               async patchItem(id, data, url, successMessage = null, errorMessage = null) {
                    this.isUpdating = true;
                    this.formLoading = true;

                    try {
                         const response = await this.$http.patch(`${url}/${id}`, data, {
                              headers: general_request.headers,
                         });

                         const updatedItem = response.data.data || response.data;

                         // Show success message
                         const message = successMessage || this.$t("common.updatedSuccess") || "Item updated successfully";
                         this.showToast("success", this.$t("common.success") || "Success", message);

                         return updatedItem;

                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to update item");
                         throw error;
                    } finally {
                         this.isUpdating = false;
                         this.formLoading = false;
                    }
               },

               // ==================== DELETE OPERATIONS ====================

               /**
                * Delete item with confirmation
                */
               async deleteItem(item, baseUrl, successMessage = null, errorMessage = null) {
                    return new Promise((resolve) => {
                         this.$confirm.require({
                              message: this.$t("common.deleteConfirm", {
                                   item: item.name || item.title || 'this item'
                              }) || `Delete ${item.name || item.title || 'this item'}?`,
                              header: this.$t("common.confirmation") || "Confirmation",
                              icon: "pi pi-exclamation-triangle",
                              acceptClass: "p-button-danger",
                              accept: async () => {
                                   await this.executeDelete(item.id, baseUrl, successMessage, errorMessage);
                                   resolve(true);
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", "Deletion cancelled");
                                   resolve(false);
                              }
                         });
                    });
               },

               /**
                * Execute delete operation
                */
               async executeDelete(id, baseUrl, successMessage = null, errorMessage = null) {
                    this.isDeleting = true;

                    try {
                         await this.$http.delete(`${baseUrl}/${id}`, {
                              headers: general_request.headers,
                         });

                         // Show success message
                         const message = successMessage || this.$t("common.deletedSuccess") || "Item deleted successfully";
                         this.showToast("success", this.$t("common.success") || "Success", message);

                         // Emit event
                         this.$emit('item-deleted', id);

                         // Call handler if exists
                         if (this.handleItemDeleted) {
                              this.handleItemDeleted(id);
                         }

                         return true;

                    } catch (error) {
                         this.handleCrudError(error, errorMessage || "Failed to delete item");
                         throw error;
                    } finally {
                         this.isDeleting = false;
                    }
               },

               /**
                * Bulk delete items
                */
               async bulkDelete(items, baseUrl, successMessage = null, errorMessage = null) {
                    if (!items || items.length === 0) return;

                    return new Promise((resolve) => {
                         this.$confirm.require({
                              message: this.$t("common.bulkDeleteConfirm", { count: items.length }) ||
                                   `Delete ${items.length} selected items?`,
                              header: this.$t("common.confirmation") || "Confirmation",
                              icon: "pi pi-exclamation-triangle",
                              acceptClass: "p-button-danger",
                              accept: async () => {
                                   this.isDeleting = true;
                                   let successCount = 0;
                                   let failCount = 0;

                                   for (const item of items) {
                                        try {
                                             await this.$http.delete(`${baseUrl}/${item.id}`, {
                                                  headers: general_request.headers,
                                             });
                                             successCount++;

                                             // Remove from local data
                                             if (this.handleItemDeleted) {
                                                  this.handleItemDeleted(item.id);
                                             }

                                        } catch (error) {
                                             failCount++;
                                             console.error(`Failed to delete item ${item.id}:`, error);
                                        }
                                   }

                                   this.isDeleting = false;

                                   // Show results
                                   if (successCount > 0) {
                                        const message = successMessage ||
                                             this.$t("common.bulkDeleteSuccess", { count: successCount }) ||
                                             `${successCount} items deleted successfully`;
                                        this.showToast("success", "Success", message);
                                   }

                                   if (failCount > 0) {
                                        this.showToast("warn", "Partial Success",
                                             `${successCount} deleted, ${failCount} failed`);
                                   }

                                   // Emit event
                                   this.$emit('bulk-delete-completed', { successCount, failCount });

                                   resolve({ successCount, failCount });
                              },
                              reject: () => {
                                   this.showToast("info", "Cancelled", "Bulk deletion cancelled");
                                   resolve({ successCount: 0, failCount: 0 });
                              }
                         });
                    });
               },

               // ==================== FORM HANDLING ====================

               /**
                * Initialize form data
                */
               initFormData(defaultData = {}) {
                    this.formData = { ...defaultData };
                    this.formErrors = {};
                    this.isValid = false;
               },

               /**
                * Reset form to initial state
                */
               resetForm() {
                    this.formData = {};
                    this.formErrors = {};
                    this.isValid = false;
                    this.selectedItem = null;
               },

               /**
                * Load item into form for editing
                */
               loadItemForEdit(item) {
                    this.selectedItem = { ...item };
                    this.formData = { ...item };
                    this.formErrors = {};
               },

               /**
                * Validate form data
                */
               validateForm() {
                    this.formErrors = {};
                    this.isValid = true;

                    // Basic required field validation
                    if (this.validationRules) {
                         Object.keys(this.validationRules).forEach(field => {
                              const rule = this.validationRules[field];

                              if (rule.required && (!this.formData[field] || this.formData[field].toString().trim() === '')) {
                                   this.formErrors[field] = rule.message || `${field} is required`;
                                   this.isValid = false;
                              }

                              if (rule.pattern && this.formData[field]) {
                                   const regex = new RegExp(rule.pattern);
                                   if (!regex.test(this.formData[field])) {
                                        this.formErrors[field] = rule.message || `${field} format is invalid`;
                                        this.isValid = false;
                                   }
                              }

                              if (rule.minLength && this.formData[field] && this.formData[field].length < rule.minLength) {
                                   this.formErrors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
                                   this.isValid = false;
                              }

                              if (rule.maxLength && this.formData[field] && this.formData[field].length > rule.maxLength) {
                                   this.formErrors[field] = rule.message || `${field} must not exceed ${rule.maxLength} characters`;
                                   this.isValid = false;
                              }
                         });
                    }

                    return this.isValid;
               },

               // ==================== ERROR HANDLING ====================

               /**
                * Handle CRUD errors
                */
               handleCrudError(error, defaultMessage) {
                    console.error('CRUD Error:', error);

                    // Handle validation errors (422)
                    if (error.response?.status === 422 && error.response.data.errors) {
                         this.formErrors = error.response.data.errors;

                         const errorMessages = Object.values(error.response.data.errors)
                              .flat()
                              .join(', ');

                         this.showToast("error", "Validation Error", errorMessages);
                         return;
                    }

                    // Handle specific status codes
                    let message = defaultMessage;
                    let title = "Error";

                    switch (error.response?.status) {
                         case 401:
                              title = "Unauthorized";
                              message = "Your session has expired. Please login again.";
                              general_request.clearAuthTokens();
                              setTimeout(() => {
                                   if (this.$router) {
                                        this.$router.push('/login');
                                   }
                              }, 2000);
                              break;

                         case 403:
                              title = "Forbidden";
                              message = "You don't have permission to perform this action.";
                              break;

                         case 404:
                              title = "Not Found";
                              message = "The requested resource was not found.";
                              break;

                         case 409:
                              title = "Conflict";
                              message = "This item conflicts with existing data.";
                              break;

                         case 500:
                              title = "Server Error";
                              message = "Internal server error. Please try again later.";
                              break;
                    }

                    // Show error toast
                    this.showToast("error", title, message);

                    // Re-throw for further handling
                    throw error;
               },

               // ==================== UTILITIES ====================

               /**
                * Show toast notification
                */
               showToast(severity, summary, detail) {
                    if (this.$toast) {
                         this.$toast.add({
                              severity: severity,
                              summary: summary,
                              detail: detail,
                              life: 3000,
                         });
                    } else {
                         console.log(`[${severity.toUpperCase()}] ${summary}: ${detail}`);
                    }
               },

               /**
                * Export data to CSV
                */
               exportToCSV(data, filename = 'export.csv') {
                    if (!data || data.length === 0) {
                         this.showToast('warn', 'Export Failed', 'No data to export');
                         return;
                    }

                    try {
                         // Convert data to CSV
                         const headers = Object.keys(data[0]);
                         const csvRows = [
                              headers.join(','),
                              ...data.map(row =>
                                   headers.map(header =>
                                        JSON.stringify(row[header] || '')
                                   ).join(',')
                              )
                         ];

                         const csvString = csvRows.join('\n');
                         const blob = new Blob([csvString], { type: 'text/csv' });
                         const url = window.URL.createObjectURL(blob);
                         const a = document.createElement('a');

                         a.setAttribute('hidden', '');
                         a.setAttribute('href', url);
                         a.setAttribute('download', filename);
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);

                         this.showToast('success', 'Export Successful', `Data exported to ${filename}`);
                    } catch (error) {
                         this.showToast('error', 'Export Failed', 'Failed to export data');
                         console.error('Export error:', error);
                    }
               },

               /**
                * Generate unique ID (for temporary items)
                */
               generateTempId() {
                    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
               },

               /**
                * Check if item is temporary
                */
               isTempId(id) {
                    return typeof id === 'string' && id.startsWith('temp_');
               }
          },

          computed: {
               /**
                * Check if form is dirty (has changes)
                */
               isFormDirty() {
                    if (!this.selectedItem) return Object.keys(this.formData).length > 0;

                    return Object.keys(this.formData).some(key => {
                         return this.formData[key] !== this.selectedItem[key];
                    });
               },

               /**
                * Check if any operation is in progress
                */
               isProcessing() {
                    return this.isCreating || this.isUpdating || this.isDeleting || this.formLoading;
               },

               /**
                * Get form field error
                */
               fieldError() {
                    return (field) => this.formErrors[field]?.[0] || this.formErrors[field] || '';
               }
          }
     };
}