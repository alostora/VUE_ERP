// src/latest/model/branch/parts/pos/PosService.js
import general_request from "../../../../views/layouts/constants/general_request";
import axios from 'axios';

class PosService {
     constructor(companyId, branchId) {
          // Ensure companyId and branchId are provided
          if (!companyId) {
               console.warn('PosService: companyId is required');
          }
          if (!branchId) {
               console.warn('PosService: branchId is required');
          }

          this.companyId = companyId;
          this.branchId = branchId;
          this.baseUrl = general_request.BASE_URL;
          this.headers = general_request.headers;

          // Create axios instance
          this.$http = axios.create({
               baseURL: this.baseUrl,
               timeout: 30000,
               headers: this.headers
          });

          // Add request interceptor for auth token
          this.$http.interceptors.request.use(
               (config) => {
                    const token = localStorage.getItem('token');
                    if (token) {
                         config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
               },
               (error) => {
                    return Promise.reject(error);
               }
          );
     }

     // ========== HELPER METHOD FOR API RESPONSES ==========
     handleApiResponse(response) {
          if (!response || !response.data) {
               console.warn('No data in API response');
               return [];
          }
          if (response.data.data && Array.isArray(response.data.data)) {
               return response.data.data;
          }
          if (Array.isArray(response.data)) {
               return response.data;
          }
          console.warn('Unexpected API response format:', response.data);
          return [];
     }

     // ========== PRODUCTS ==========
     async getProducts(params = {}) {
          try {
               if (!this.companyId) {
                    console.error('Company ID is required for getProducts');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/product/company-final-products/search/${this.companyId}`;
               console.log('Fetching products from:', url, 'with params:', params);

               const response = await this.$http.get(url, {
                    params: { ...params, paginate: false },
                    headers: this.headers
               });

               const products = this.handleApiResponse(response);
               console.log('Products loaded:', products.length);
               return products;
          } catch (error) {
               console.error('Error fetching products:', error.message);
               return [];
          }
     }

     async getProductDetails(productId) {
          try {
               if (!productId) {
                    console.error('Product ID is required');
                    return null;
               }
               const url = `${this.baseUrl}/admin/company/product/final-product/${productId}`;
               const response = await this.$http.get(url, { headers: this.headers });
               return response.data.data || response.data;
          } catch (error) {
               console.error('Error fetching product details:', error.message);
               return null;
          }
     }

     // ========== CATEGORIES ==========
     async getCategories() {
          try {
               if (!this.companyId) {
                    console.error('Company ID is required for getCategories');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/categories/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { paginate: false },
                    headers: this.headers
               });
               return this.handleApiResponse(response);
          } catch (error) {
               console.error('Error fetching categories:', error.message);
               return [];
          }
     }

     // ========== PAYMENT METHODS ==========
     async getPaymentMethods() {
          try {
               const url = `${this.baseUrl}/system-lookups/15`;
               const response = await this.$http.get(url, { headers: this.headers });
               const methods = this.handleApiResponse(response);
               
               // Ensure we have at least cash as default
               if (methods.length === 0) {
                    return [
                         { id: "1", name: "Cash", name_ar: "نقداً" },
                         { id: "2", name: "Credit Card", name_ar: "بطاقة ائتمان" }
                    ];
               }
               return methods;
          } catch (error) {
               console.error('Error fetching payment methods:', error.message);
               // Return default payment methods if API fails
               return [
                    { id: "1", name: "Cash", name_ar: "نقداً" },
                    { id: "2", name: "Credit Card", name_ar: "بطاقة ائتمان" }
               ];
          }
     }

     // ========== WAREHOUSES ==========
     async getWarehouses() {
          try {
               if (!this.companyId || !this.branchId) {
                    console.error('Company ID and Branch ID are required for getWarehouses');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/branch/warehouses/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: {
                         branch_id: this.branchId,
                         paginate: false
                    },
                    headers: this.headers
               });
               const warehouses = this.handleApiResponse(response);

               // If no warehouses from API, return default
               if (warehouses.length === 0) {
                    return [
                         { 
                              id: "default", 
                              name: "Main Warehouse", 
                              name_ar: "المخزن الرئيسي",
                              branch_id: this.branchId 
                         }
                    ];
               }

               return warehouses;
          } catch (error) {
               console.error('Error fetching warehouses:', error.message);
               // Return default warehouse if API fails
               return [
                    { 
                         id: "default", 
                         name: "Main Warehouse", 
                         name_ar: "المخزن الرئيسي",
                         branch_id: this.branchId 
                    }
               ];
          }
     }

     // ========== BRANCHES (for fallback) ==========
     async getBranches() {
          try {
               if (!this.companyId) {
                    console.error('Company ID is required for getBranches');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/branches/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { paginate: false },
                    headers: this.headers
               });
               return this.handleApiResponse(response);
          } catch (error) {
               console.error('Error fetching branches:', error.message);
               return [];
          }
     }

     // ========== MEASUREMENT UNITS ==========
     async getMeasurementUnits() {
          try {
               if (!this.companyId) {
                    console.error('Company ID is required for getMeasurementUnits');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/measurement-units/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { paginate: false },
                    headers: this.headers
               });
               return this.handleApiResponse(response);
          } catch (error) {
               console.error('Error fetching measurement units:', error.message);
               return [];
          }
     }

     // ========== CONTACTS/CUSTOMERS ==========
     async getContacts(search = '') {
          try {
               if (!this.companyId) {
                    console.error('Company ID is required for getContacts');
                    return [];
               }
               const url = `${this.baseUrl}/admin/company/contacts/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: {
                         query_string: search,
                         paginate: false
                    },
                    headers: this.headers
               });
               const contacts = this.handleApiResponse(response);
               
               // Ensure all contacts have required fields
               return contacts.map(contact => ({
                    ...contact,
                    name: contact.name || 'Unknown Customer',
                    phone: contact.phone || 'N/A',
                    email: contact.email || '',
                    address: contact.address || ''
               }));
          } catch (error) {
               console.error('Error fetching contacts:', error.message);
               return [];
          }
     }

     async createContact(contactData) {
          try {
               if (!this.companyId) {
                    throw new Error('Company ID is required');
               }
               const url = `${this.baseUrl}/admin/company/contact`;
               const payload = {
                    company_id: this.companyId,
                    ...contactData
               };
               const response = await this.$http.post(url, payload, { headers: this.headers });
               return response.data.data || response.data;
          } catch (error) {
               console.error('Error creating contact:', error.message);
               throw error;
          }
     }

     // ========== CREATE INVOICE ==========
     async createInvoice(invoiceData) {
          try {
               if (!this.companyId || !this.branchId) {
                    throw new Error('Company ID and Branch ID are required');
               }
               const url = `${this.baseUrl}/admin/company/sale`;
               const payload = {
                    company_id: this.companyId,
                    branch_id: this.branchId,
                    ...invoiceData
               };
               const response = await this.$http.post(url, payload, { headers: this.headers });
               return response.data.data || response.data;
          } catch (error) {
               console.error('Error creating invoice:', error.message);
               throw error;
          }
     }

     // ========== CALCULATIONS ==========
     calculateItemTotal(item) {
          const price = item.has_discount ? item.price_after_discount : item.price;
          const quantity = item.quantity || 1;
          let total = price * quantity;

          // Add item-level additional costs
          if (item.additional_costs && Array.isArray(item.additional_costs)) {
               item.additional_costs.forEach(cost => {
                    total += parseFloat(cost.value) || 0;
               });
          }

          return parseFloat(total.toFixed(2));
     }

     calculateInvoiceTotals(cartItems, invoiceDiscounts = [], invoiceAdditionalCosts = [], taxRate = 0) {
          let subtotal = 0;

          // Calculate items subtotal
          cartItems.forEach(item => {
               subtotal += this.calculateItemTotal(item);
          });

          // Apply invoice-level discounts
          let discountTotal = 0;
          if (invoiceDiscounts && Array.isArray(invoiceDiscounts)) {
               invoiceDiscounts.forEach(discount => {
                    discountTotal += parseFloat(discount.value) || 0;
               });
          }

          // Apply invoice-level additional costs
          let additionalCostsTotal = 0;
          if (invoiceAdditionalCosts && Array.isArray(invoiceAdditionalCosts)) {
               invoiceAdditionalCosts.forEach(cost => {
                    additionalCostsTotal += parseFloat(cost.value) || 0;
               });
          }

          // Calculate tax
          const taxableAmount = subtotal - discountTotal + additionalCostsTotal;
          const taxAmount = (taxableAmount * taxRate) / 100;

          // Calculate grand total
          const grandTotal = taxableAmount + taxAmount;

          return {
               subtotal: parseFloat(subtotal.toFixed(2)),
               discountTotal: parseFloat(discountTotal.toFixed(2)),
               additionalCostsTotal: parseFloat(additionalCostsTotal.toFixed(2)),
               taxAmount: parseFloat(taxAmount.toFixed(2)),
               grandTotal: parseFloat(grandTotal.toFixed(2)),
               taxableAmount: parseFloat(taxableAmount.toFixed(2))
          };
     }

     // ========== HELD INVOICES ==========
     saveHeldInvoice(invoice) {
          const heldInvoices = this.getHeldInvoices();
          invoice.id = `held_${Date.now()}`;
          invoice.heldAt = new Date().toISOString();
          heldInvoices.push(invoice);
          localStorage.setItem(`pos_held_invoices_${this.companyId}_${this.branchId}`, JSON.stringify(heldInvoices));
          return invoice;
     }

     getHeldInvoices() {
          const stored = localStorage.getItem(`pos_held_invoices_${this.companyId}_${this.branchId}`);
          return stored ? JSON.parse(stored) : [];
     }

     deleteHeldInvoice(invoiceId) {
          const heldInvoices = this.getHeldInvoices();
          const updated = heldInvoices.filter(inv => inv.id !== invoiceId);
          localStorage.setItem(`pos_held_invoices_${this.companyId}_${this.branchId}`, JSON.stringify(updated));
     }
}

export default PosService;