import Table from "../parts/Table.vue";

const tax_routes = [
  {
    path: "/company/:company_id/taxes",
    name: "company-taxes",
    component: Table,
    props: true,
  }
];

export default tax_routes;