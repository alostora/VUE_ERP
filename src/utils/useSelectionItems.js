import general_request from "./general_request";
import moduleUrl from "@/constants/moduleUrl";
import lookupTypes from "@/constants/lookupTypes";

export default {

     data() {
          return {
               loadingItems: false,
               accountTypes: [],
               currencies: [],
               countries: [],
               governorates: [],
               cities: [],
               clients: [],
               measurementUnits: [],
               categories: [],
               products: [],
          }
     },

     methods: {
          async loadAccountTypes() {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.LOOK_UP.propSearchUrl}/${lookupTypes.LOOKUP_TYPES.USER_ACCOUNT_TYPE}`,
                         {
                              params: { per_page: 100 },
                              headers: general_request.headers,
                         }
                    );
                    this.accountTypes = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadCurrencies() {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.LOOK_UP.propSearchUrl}/${lookupTypes.LOOKUP_TYPES.CURRENCY}`,
                         {
                              params: { per_page: 100 },
                              headers: general_request.headers,
                         }
                    );
                    this.currencies = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadCountries() {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.COUNTRY.propSearchUrl}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.countries = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadGovernorates(country_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.GOVERNORATE.propSearchUrl}?country_id=${country_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.governorates = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadCities(governorate_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.CITY.propSearchUrl}?governorate_id=${governorate_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.cities = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadClients() {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.CLIENT.propSearchUrl}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.clients = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadMeasurementUnits(company_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.MEASUREMENT_UNIT.propSearchUrl}/${company_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.measurementUnits = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadCategories(company_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.CATEGORY.propSearchUrl}/${company_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.categories = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadProducts(company_id, category_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.PRODUCT.propSearchUrl}/${company_id}?category_id=${category_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.products = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadVariants(company_id) {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.VARIANT.propSearchUrl}/${company_id}`,
                         {
                              headers: general_request.headers,
                         }
                    );
                    this.variants = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("common.error");
               } finally {
                    this.loadingItems = false;
               }
          },

          async loadVariantValues(variantId) {
               this.loadingVariantValues = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.VARIANT_VALUE.propSearchUrl}/${variantId}`,
                         {
                              headers: general_request.headers,
                         }
                    );

                    const variantValuesData = response.data.data || [];

                    this.variantValues = {
                         ...this.variantValues,
                         [variantId]: variantValuesData,
                    };

                    this.$forceUpdate();
               } catch (error) {
                    this.variantValues = {
                         ...this.variantValues,
                         [variantId]: [],
                    };
               } finally {
                    this.loadingVariantValues = false;
               }
          },

          //handel on change event
          //handel on change event

          onAccountTypeChange(value) {
               this.selectedAccountType = value;
               this.formData.user_account_type_id = value;
          },

          onCountryChange(value) {
               this.selectedCountry = value;
               this.formData.country_id = value;
               this.formData.governorate_id = ""; // Reset governorate
               this.formData.city_id = ""; // Reset city
               this.selectedGovernorate = null; // Clear selection
               this.selectedCity = null; // Clear selection
               this.governorates = []; // Clear list
               this.cities = []; // Clear list

               if (value) {
                    this.loadGovernorates(value);
               }
          },

          onGovernorateChange(value) {
               this.selectedGovernorate = value;
               this.formData.governorate_id = value;
               this.formData.city_id = ""; // Reset city
               this.selectedCity = null; // Clear selection
               this.cities = []; // Clear list

               if (value) {
                    this.loadCities(value);
               }
          },

          onCityChange(value) {
               this.selectedCity = value;
               this.formData.city_id = value;
          },

          onCurrencyChange(value) {
               this.selectedCurrency = value;
               this.formData.currency_id = value;
          },

          onMeasurementUnitChange(value) {
               this.selectedMeasurementUnit = value;
               this.formData.measurement_unit_id = value;
          },

          onCategoryChange(value) {
               this.selectedCategory = value;
               this.formData.category_id = value;
          },

          onProductChange(value) {
               this.selectedProduct = value;
               this.formData.product_id = value;
          },

          async onVariantChange(rowIndex, event) {
               const variantId = event.value;

               this.variantRows[rowIndex].variant_value_id = null;

               if (variantId) {
                    await this.loadVariantValues(variantId);
               }

               // this.$forceUpdate();
          },

          async onVariantValueChange(rowIndex, event, variantId) {

               // let formDataVariants = this.formData.variants.filter((variant) => variant.variant_id !== variantId);

               // formDataVariants.push({ variant_id: variantId, variant_value_id: event.value });

               // this.formData.variants = formDataVariants;


               this.formData.variants = this.variantRows.filter(
                    (row) => row.variant_id && row.variant_value_id
               );



               console.log("rowIndex", rowIndex);
               console.log("ssssssssssssssssssss", this.formData.variants);
               console.log("rowIndex", rowIndex);
          },
     }
}