import general_request from "../general_request";

export function useTable() {
     return {
          data() {
               return {
                    tableItems: [],
                    loading: false,
                    meta: { total: 0, current_page: 1 },
                    links: {},
                    per_page: 10,
                    query_string: '',
                    sortField: null,
                    sortOrder: null,
                    selectedItem: null,
                    perPageOptions: [
                         { label: '5', value: 5 },
                         { label: '10', value: 10 },
                         { label: '25', value: 25 },
                         { label: '50', value: 50 },
                         { label: '100', value: 100 }
                    ],
                    searchTimeout: null
               }
          },

          computed: {
               axiosParams() {
                    return {
                         per_page: this.per_page,
                         query_string: this.query_string,
                         page: this.meta.current_page || 1,
                    }
               },
          },

          methods: {
               // Data fetching methods
               async getData(url = this.propSearchUrl) {
                    await this.fetchData(url);
               },

               async fetchData(url, customErrorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.get(url, {
                              params: this.axiosParams,
                              headers: general_request.headers,
                         });

                         this.tableItems = response.data.data || [];
                         this.links = response.data.links || {};
                         this.meta = response.data.meta || { total: 0 };
                    } catch (error) {
                         const errorMessage = customErrorMessage || this.$t("errors.fetchError");
                         this.showToast("error", this.$t("common.error"), errorMessage);
                    } finally {
                         this.loading = false;
                    }
               },

               // Search and pagination methods
               handleSearchInput() {
                    this.onSearchInput(this.getData);
               },

               onSearchInput(callback) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                         this.meta.current_page = 1;
                         callback();
                    }, 500);
               },

               handlePageChange(event) {
                    this.onPageChange(event, this.getData);
               },

               onPageChange(event, callback) {
                    this.per_page = event.rows;
                    this.meta.current_page = event.page + 1;
                    callback();
               },

               // Sorting method
               onSort(event) {
                    this.sortField = event.sortField;
                    this.sortOrder = event.sortOrder;
               },

               // CRUD operations
               async deleteItem(item, baseUrl, successMessage, customErrorMessage = null) {
                    this.$confirm.require({
                         message: `هل أنت متأكد من حذف ${item.name || item.title || 'هذا العنصر'}؟`,
                         header: this.$t("common.confirmation"),
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", this.$t("common.success"), successMessage);
                              } catch (error) {
                                   const errorMessage = customErrorMessage || this.$t("errors.deleteError");
                                   this.showToast("error", this.$t("common.error"), errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", this.$t("common.success"), "تم الإنشاء بنجاح");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", this.$t("common.success"), "تم التحديث بنجاح");
               },

               // Utility methods
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

               formatDate(dateString) {
                    if (!dateString) return "-";
                    try {
                         return new Date(dateString).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                         });
                    } catch (error) {
                         return dateString;
                    }
               },

               // Navigation helper
               navigateToPage(url, fetchCallback) {
                    if (url && !this.loading) {
                         fetchCallback(url);
                    }
               },

               // Reset form data
               resetFormData() {
                    return {
                         id: "",
                         name: "",
                         name_ar: "",
                         email: "",
                         phone: "",
                         password: "",
                         address: "",
                         user_account_type_id: "",
                         phone_code: "",
                         prefix: "",
                         flag: ""
                    };
               }
          }
     }
}