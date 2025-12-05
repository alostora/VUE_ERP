// src/latest/views/layouts/constants/composables/useTable.js

import general_request from "../general_request";

/**
 * Enhanced table composable with better error handling and performance
 */
export function useTable() {
     return {
          data() {
               return {
                    // Data state
                    tableItems: [],
                    loading: false,
                    error: null,

                    // Pagination state
                    meta: {
                         total: 0,
                         current_page: 1,
                         last_page: 1,
                         per_page: 10,
                         from: 0,
                         to: 0
                    },
                    links: {},

                    // Filtering and sorting
                    query_string: '',
                    sortField: null,
                    sortOrder: null,

                    // UI state
                    selectedItem: null,
                    selectedItems: [],
                    expandedRows: {},

                    // Configuration
                    per_page: 10,
                    perPageOptions: [
                         { label: '5', value: 5 },
                         { label: '10', value: 10 },
                         { label: '25', value: 25 },
                         { label: '50', value: 50 },
                         { label: '100', value: 100 }
                    ],

                    // Performance optimization
                    searchTimeout: null,
                    debounceDelay: 500,
                    cacheKey: null,
                    dataCache: {}
               };
          },

          computed: {
               /**
                * Build axios parameters for API requests
                */
               axiosParams() {
                    const params = {
                         per_page: this.per_page,
                         page: this.meta.current_page || 1,
                    };

                    // Add search query if exists
                    if (this.query_string && this.query_string.trim() !== '') {
                         params.search = this.query_string.trim();
                    }

                    // Add sorting if enabled
                    if (this.sortField && this.sortOrder) {
                         params.sort_by = this.sortField;
                         params.sort_order = this.sortOrder === 1 ? 'asc' : 'desc';
                    }

                    return params;
               },

               /**
                * Check if there's more data to load
                */
               hasMoreData() {
                    return this.meta.current_page < this.meta.last_page;
               },

               /**
                * Check if table is empty
                */
               isEmpty() {
                    return this.tableItems.length === 0 && !this.loading && !this.error;
               },

               /**
                * Check if search is active
                */
               isSearching() {
                    return this.query_string && this.query_string.trim() !== '';
               }
          },

          methods: {
               // ==================== DATA FETCHING ====================

               /**
                * Main data fetching method
                */
               async getData(url = this.propSearchUrl, forceRefresh = false) {
                    // Use cache if available and not forcing refresh
                    const cacheKey = `${url}?${new URLSearchParams(this.axiosParams).toString()}`;

                    if (!forceRefresh && this.dataCache[cacheKey]) {
                         this.tableItems = this.dataCache[cacheKey].data;
                         this.meta = this.dataCache[cacheKey].meta;
                         this.links = this.dataCache[cacheKey].links;
                         return;
                    }

                    await this.fetchData(url);
               },

               /**
                * Fetch data from API
                */
               async fetchData(url, customErrorMessage = null) {
                    this.loading = true;
                    this.error = null;

                    try {
                         const response = await this.$http.get(url, {
                              params: this.axiosParams,
                              headers: general_request.headers,
                         });

                         // Handle different response formats
                         if (response.data && typeof response.data === 'object') {
                              // Laravel pagination format
                              if (response.data.data !== undefined) {
                                   this.tableItems = response.data.data || [];
                                   this.meta = response.data.meta || { total: 0 };
                                   this.links = response.data.links || {};
                              }
                              // Simple array format
                              else if (Array.isArray(response.data)) {
                                   this.tableItems = response.data;
                                   this.meta = { total: response.data.length };
                                   this.links = {};
                              }
                              // Custom format
                              else {
                                   this.tableItems = response.data.items || [];
                                   this.meta = response.data.meta || { total: 0 };
                                   this.links = response.data.links || {};
                              }
                         } else {
                              this.tableItems = [];
                              this.meta = { total: 0 };
                         }

                         // Cache the response
                         const cacheKey = `${url}?${new URLSearchParams(this.axiosParams).toString()}`;
                         this.dataCache[cacheKey] = {
                              data: this.tableItems,
                              meta: this.meta,
                              links: this.links,
                              timestamp: Date.now()
                         };

                         // Clean old cache entries (older than 5 minutes)
                         this.cleanCache();

                    } catch (error) {
                         this.error = error;
                         const errorMessage = customErrorMessage || this.$t("errors.fetchError") || "Failed to fetch data";
                         this.showToast("error", this.$t("common.error") || "Error", errorMessage);

                         // Clear data on error
                         this.tableItems = [];
                         this.meta = { total: 0 };

                         // Handle specific errors
                         if (error.response?.status === 401) {
                              this.handleUnauthorizedError();
                         }
                    } finally {
                         this.loading = false;
                    }
               },

               // ==================== SEARCH & FILTERS ====================

               /**
                * Handle search input with debounce
                */
               handleSearchInput() {
                    this.onSearchInput(() => {
                         this.meta.current_page = 1;
                         this.getData();
                    });
               },

               /**
                * Generic search input handler
                */
               onSearchInput(callback) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                         callback();
                    }, this.debounceDelay);
               },

               /**
                * Clear search and reset filters
                */
               clearSearch() {
                    this.query_string = '';
                    this.meta.current_page = 1;
                    this.getData();
               },

               // ==================== PAGINATION ====================

               /**
                * Handle page change
                */
               handlePageChange(event) {
                    this.onPageChange(event, () => {
                         this.getData();
                    });
               },

               /**
                * Generic page change handler
                */
               onPageChange(event, callback) {
                    this.per_page = event.rows;
                    this.meta.current_page = event.page + 1;
                    callback();
               },

               /**
                * Go to specific page
                */
               goToPage(pageNumber) {
                    if (pageNumber >= 1 && pageNumber <= this.meta.last_page) {
                         this.meta.current_page = pageNumber;
                         this.getData();
                    }
               },

               /**
                * Load more data (infinite scroll)
                */
               async loadMore() {
                    if (this.loading || !this.hasMoreData) return;

                    this.meta.current_page += 1;
                    try {
                         const response = await this.$http.get(this.propSearchUrl, {
                              params: this.axiosParams,
                              headers: general_request.headers,
                         });

                         if (response.data.data) {
                              this.tableItems = [...this.tableItems, ...response.data.data];
                              this.meta = response.data.meta;
                              this.links = response.data.links;
                         }
                    } catch (error) {
                         this.meta.current_page -= 1;
                         this.showToast("error", "Error", "Failed to load more data");
                    }
               },

               // ==================== SORTING ====================

               /**
                * Handle sorting
                */
               onSort(event) {
                    this.sortField = event.sortField;
                    this.sortOrder = event.sortOrder;
                    this.getData();
               },

               /**
                * Clear sorting
                */
               clearSorting() {
                    this.sortField = null;
                    this.sortOrder = null;
                    this.getData();
               },

               // ==================== SELECTION ====================

               /**
                * Select all items
                */
               selectAll() {
                    this.selectedItems = [...this.tableItems];
               },

               /**
                * Clear selection
                */
               clearSelection() {
                    this.selectedItems = [];
               },

               /**
                * Check if item is selected
                */
               isSelected(item) {
                    return this.selectedItems.some(selected => selected.id === item.id);
               },

               /**
                * Toggle item selection
                */
               toggleSelection(item) {
                    const index = this.selectedItems.findIndex(selected => selected.id === item.id);
                    if (index === -1) {
                         this.selectedItems.push(item);
                    } else {
                         this.selectedItems.splice(index, 1);
                    }
               },

               // ==================== CACHE MANAGEMENT ====================

               /**
                * Clean old cache entries
                */
               cleanCache() {
                    const now = Date.now();
                    const cacheLifetime = 5 * 60 * 1000; // 5 minutes

                    Object.keys(this.dataCache).forEach(key => {
                         if (now - this.dataCache[key].timestamp > cacheLifetime) {
                              delete this.dataCache[key];
                         }
                    });
               },

               /**
                * Clear entire cache
                */
               clearCache() {
                    this.dataCache = {};
               },

               /**
                * Invalidate cache for specific URL
                */
               invalidateCache(url) {
                    Object.keys(this.dataCache).forEach(key => {
                         if (key.startsWith(url)) {
                              delete this.dataCache[key];
                         }
                    });
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
                * Format date string
                */
               formatDate(dateString, format = "medium") {
                    if (!dateString) return "-";

                    try {
                         const date = new Date(dateString);

                         if (format === "short") {
                              return date.toLocaleDateString("en-US", {
                                   month: "short",
                                   day: "numeric",
                              });
                         } else if (format === "long") {
                              return date.toLocaleDateString("en-US", {
                                   year: "numeric",
                                   month: "long",
                                   day: "numeric",
                              });
                         } else {
                              return date.toLocaleDateString("en-US", {
                                   year: "numeric",
                                   month: "short",
                                   day: "numeric",
                              });
                         }
                    } catch (error) {
                         return dateString;
                    }
               },

               /**
                * Handle unauthorized error
                */
               handleUnauthorizedError() {
                    general_request.clearAuthTokens();
                    this.showToast("warn", "Session Expired", "Please login again");

                    // Redirect to login after delay
                    setTimeout(() => {
                         if (this.$router && window.location.pathname !== '/login') {
                              this.$router.push('/login');
                         }
                    }, 2000);
               },

               /**
                * Reset to initial state
                */
               reset() {
                    this.tableItems = [];
                    this.loading = false;
                    this.error = null;
                    this.meta = { total: 0, current_page: 1 };
                    this.links = {};
                    this.query_string = '';
                    this.sortField = null;
                    this.sortOrder = null;
                    this.selectedItem = null;
                    this.selectedItems = [];
                    this.clearCache();
               }
          }
     };
}