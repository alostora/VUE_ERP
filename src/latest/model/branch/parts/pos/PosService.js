// src/latest/model/branch/parts/pos/PosService.js
import general_request from "../../../../views/layouts/constants/general_request";

class PosService {
     constructor(companyId, branchId) {
          this.companyId = companyId;
          this.branchId = branchId;
          this.baseUrl = general_request.BASE_URL;
          this.headers = general_request.headers;
     }

     // ========== PRODUCTS ==========
     async getProducts(params = {}) {
          try {
               const url = `${this.baseUrl}/admin/company/product/company-final-products/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { ...params, paginate: true },
                    headers: this.headers
               });
               return response.data;
          } catch (error) {
               console.error('Error fetching products:', error);
               throw error;
          }
     }

     async getProductDetails(productId) {
          try {
               const url = `${this.baseUrl}/admin/company/product/final-product/${productId}`;
               const response = await this.$http.get(url, { headers: this.headers });
               return response.data;
          } catch (error) {
               console.error('Error fetching product details:', error);
               throw error;
          }
     }

     // ========== CATEGORIES ==========
     async getCategories() {
          try {
               const url = `${this.baseUrl}/admin/company/categories/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { paginate: false },
                    headers: this.headers
               });
               return response.data.data || [];
          } catch (error) {
               console.error('Error fetching categories:', error);
               return [];
          }
     }

     // ========== PAYMENT METHODS ==========
     async getPaymentMethods() {
          try {
               const url = `${this.baseUrl}/system-lookups/15`;
               const response = await this.$http.get(url, { headers: this.headers });
               return response.data.data || [];
          } catch (error) {
               console.error('Error fetching payment methods:', error);
               return [];
          }
     }

     // ========== WAREHOUSES ==========
     async getWarehouses() {
          try {
               const url = `${this.baseUrl}/admin/company/branch/warehouses/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { branch_id: this.branchId, paginate: false },
                    headers: this.headers
               });
               return response.data.data || [];
          } catch (error) {
               console.error('Error fetching warehouses:', error);
               return [];
          }
     }

     // ========== MEASUREMENT UNITS ==========
     async getMeasurementUnits() {
          try {
               const url = `${this.baseUrl}/admin/company/measurement-units/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { paginate: false },
                    headers: this.headers
               });
               return response.data.data || [];
          } catch (error) {
               console.error('Error fetching measurement units:', error);
               return [];
          }
     }

     // ========== CONTACTS/CUSTOMERS ==========
     async getContacts(search = '') {
          try {
               const url = `${this.baseUrl}/admin/company/contacts/search/${this.companyId}`;
               const response = await this.$http.get(url, {
                    params: { query_string: search, paginate: false },
                    headers: this.headers
               });
               return response.data.data || [];
          } catch (error) {
               console.error('Error fetching contacts:', error);
               return [];
          }
     }

     async createContact(contactData) {
          try {
               const url = `${this.baseUrl}/admin/company/contact`;
               const payload = {
                    company_id: this.companyId,
                    ...contactData
               };
               const response = await this.$http.post(url, payload, { headers: this.headers });
               return response.data;
          } catch (error) {
               console.error('Error creating contact:', error);
               throw error;
          }
     }

     // ========== CREATE INVOICE ==========
     async createInvoice(invoiceData) {
          try {
               // TODO: Replace with actual invoice creation endpoint
               const url = `${this.baseUrl}/admin/company/sale`; // NEED ENDPOINT
               const payload = {
                    company_id: this.companyId,
                    branch_id: this.branchId,
                    ...invoiceData
               };
               const response = await this.$http.post(url, payload, { headers: this.headers });
               return response.data;
          } catch (error) {
               console.error('Error creating invoice:', error);
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

     // ========== DUMMY DATA ==========
     getDummyProducts() {
          return [
               {
                    id: "prod1",
                    name: "Laptop",
                    name_ar: "لابتوب",
                    price: 1500,
                    has_discount: true,
                    discount_value: "10.00",
                    price_after_discount: 1350,
                    category: { id: "cat1", name: "Electronics", name_ar: "إلكترونيات" },
                    main_image: { file: { file_path: "https://via.placeholder.com/150" } },
                    stock: 15,
                    details: "High performance laptop",
                    details_ar: "لابتوب عالي الأداء"
               },
               {
                    id: "prod2",
                    name: "Mouse",
                    name_ar: "ماوس",
                    price: 50,
                    has_discount: false,
                    price_after_discount: 50,
                    category: { id: "cat1", name: "Electronics", name_ar: "إلكترونيات" },
                    main_image: { file: { file_path: "https://via.placeholder.com/150" } },
                    stock: 100,
                    details: "Wireless mouse",
                    details_ar: "ماوس لاسلكي"
               },
               {
                    id: "prod3",
                    name: "Notebook",
                    name_ar: "دفتر",
                    price: 10,
                    has_discount: true,
                    discount_value: "20.00",
                    price_after_discount: 8,
                    category: { id: "cat2", name: "Stationery", name_ar: "قرطاسية" },
                    main_image: null,
                    stock: 200,
                    details: "A4 size notebook",
                    details_ar: "دفتر حجم A4"
               }
          ];
     }

     getDummyCategories() {
          return [
               { id: "cat1", name: "Electronics", name_ar: "إلكترونيات", file: null },
               { id: "cat2", name: "Stationery", name_ar: "قرطاسية", file: null },
               { id: "cat3", name: "Food", name_ar: "طعام", file: null }
          ];
     }

     getDummyPaymentMethods() {
          return [
               { id: "pm1", name: "Cash", name_ar: "نقداً", prefix: "CASH" },
               { id: "pm2", name: "Credit Card", name_ar: "بطاقة ائتمان", prefix: "CREDIT_CARD" },
               { id: "pm3", name: "Bank Transfer", name_ar: "تحويل بنكي", prefix: "BANK_TRANSFER" }
          ];
     }

     getDummyContacts() {
          return [
               { id: "cust1", name: "John Doe", email: "john@example.com", phone: "0123456789", address: "123 Main St" },
               { id: "cust2", name: "Jane Smith", email: "jane@example.com", phone: "0987654321", address: "456 Oak Ave" }
          ];
     }
}

export default PosService;