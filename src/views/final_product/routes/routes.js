import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/products",
    name: "company-products",
    component: Table,
    props: true,
  }
];

export default routes;
