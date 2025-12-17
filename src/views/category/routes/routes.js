import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/categories",
    name: "company-categories",
    component: Table,
    props: true,
  }
];

export default routes;
