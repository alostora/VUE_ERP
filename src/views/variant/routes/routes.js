import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/variants",
    name: "company-variants",
    component: Table,
    props: true,
  }
];

export default routes;
