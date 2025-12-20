import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/variant-values/:variant_id",
    name: "company-variant-values",
    component: Table,
    props: true,
  }
];

export default routes;
