import general_request from "./general_request";
import moduleUrl from "@/constants/moduleUrl";

export default {

     data() {
          return {
               loadingItems: false,
               accountTypes: [],
               countries: [],
               governorates: [],
          }
     },

     methods: {
          async loadAccountTypes() {
               this.loadingItems = true;
               try {
                    const response = await this.$http.get(
                         `${moduleUrl.URLS.LOOK_UP.propSearchUrl}`,
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
     }
}