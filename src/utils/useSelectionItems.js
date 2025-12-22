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
     }
}