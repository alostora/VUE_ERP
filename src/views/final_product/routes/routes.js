import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/final-products",
    name: "company-final-products",
    component: Table,
    props: true,
  }
];

export default routes;
