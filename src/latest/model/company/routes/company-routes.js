import CompanyTable from "../parts/CompanyTable.vue";
import CompanyShow from "../parts/CompanyShow.vue";

const company_routes = [
     {
          path: "/companies",
          name: "companies",
          component: CompanyTable,
          props: true,
     },
     {
          path: "/company/:company_id/show",
          name: "company-show",
          component: CompanyShow,
          props: (route) => ({
               company_id: route.params.company_id
          })
     }
];

export default company_routes;