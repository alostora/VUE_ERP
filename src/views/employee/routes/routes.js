import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/employees",
    name: "company-employees",
    component: Table,
    props: true,
  }
];

export default routes;
