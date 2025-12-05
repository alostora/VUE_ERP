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
                    const params = {
                         per_page: this.per_page,
                         page: this.meta.current_page || 1,
                    };

                    if (this.query_string && this.query_string.trim() !== '') {
                         params.search = this.query_string.trim();
                    }

                    if (this.sortField && this.sortOrder) {
                         params.sort_by = this.sortField;
                         params.sort_order = this.sortOrder === 1 ? 'asc' : 'desc';
                    }

                    return params;
               }
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

               // CRUD Handlers - These will be called by useCrud
               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    if (this.meta && this.meta.total !== undefined) {
                         this.meta.total++;
                    }
                    this.showToast("success", "Success", "Item created successfully");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.$set(this.tableItems, index, updatedItem);
                    }
                    this.showToast("success", "Success", "Item updated successfully");
               },

               handleItemDeleted(itemId) {
                    this.tableItems = this.tableItems.filter(item => item.id !== itemId);
                    if (this.meta && this.meta.total !== undefined) {
                         this.meta.total = Math.max(0, this.meta.total - 1);
                    }
               },

               // Search and pagination methods
               handleSearchInput() {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                         this.meta.current_page = 1;
                         this.getData();
                    }, 500);
               },

               handlePageChange(event) {
                    this.per_page = event.rows;
                    this.meta.current_page = event.page + 1;
                    this.getData();
               },

               // Sorting method
               onSort(event) {
                    this.sortField = event.sortField;
                    this.sortOrder = event.sortOrder;
                    this.getData();
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
               }
          }
     }
}