import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/measurement-units",
    name: "company-measurement-units",
    component: Table,
    props: true,
  }
];

export default routes;
