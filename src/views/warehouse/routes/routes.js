import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/branch/:company_id/warehouses/:branch_id",
    name: "company-warehouses",
    component: Table,
    props: true,
  }
];

export default routes;
