import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/company/:company_id/discounts",
    name: "company-discounts",
    component: Table,
    props: true,
  }
];

export default routes;
