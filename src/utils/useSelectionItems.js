import general_request from "./general_request";

export default {

     methods: {
          async loadAccountTypes() {
               this.loadingAccountTypes = true;
               try {
                    const response = await this.$http.get(
                         general_request.BASE_URL + "/system-lookups/1",
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