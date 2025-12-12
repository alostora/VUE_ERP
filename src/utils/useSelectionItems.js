import general_request from "./general_request";
import lookup_types from "@/constants/lookup_types";

export default {

     methods: {
          async loadAccountTypes() {
               this.loadingAccountTypes = true;
               try {
                    const response = await this.$http.get(
                         general_request.BASE_URL + `/system-lookups/${lookup_types.LOOKUP_TYPES.USER_ACCOUNT_TYPE}`,
                         {
                              params: { per_page: 100 },
                              headers: general_request.headers,
                         }
                    );
                    this.accountTypes = response.data.data || [];
               } catch (error) {
                    this.error = this.$t("users.loadAccountTypesError");
               } finally {
                    this.loadingAccountTypes = false;
               }
          },
     }
}