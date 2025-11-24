<template>
  <div class="company-show-wrapper">
    <CompanyStatistics :company="company" />
    <Divider />
    <CompanyDetails :company="company" />
  </div>
</template>

<script>
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";
import Divider from "primevue/divider";
import CompanyDetails from "../parts/details/CompanyDetails.vue";


import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyShow",
  components: {
    Divider,
    CompanyDetails,
    CompanyStatistics,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      company: {},
      loading: false,
    };
  },
  mounted() {
    this.fetchCompany();
  },

  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}
</style>
