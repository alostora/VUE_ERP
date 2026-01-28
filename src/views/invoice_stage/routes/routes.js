import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/invoice-stages",
    name: "company-invoice-stages",
    component: Table,
    props: true,
  }
];

export default routes;
