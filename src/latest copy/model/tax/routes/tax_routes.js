import TaxTable from "../parts/TaxTable.vue";

const tax_routes = [
     {
          path: "/company/:company_id/taxes",
          name: "company-taxes",
          component: TaxTable,
          props: true,
     }
];

export default tax_routes;