import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/contacts",
    name: "company-contacts",
    component: Table,
    props: true,
  }
];

export default routes;
