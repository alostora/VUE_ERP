import Table from "../parts/Table.vue";

const routes = [
  {
    // path: "/users/:propSearchUrl/:propMainUrl",
    path: "/users/",
    name: "users",
    component: Table,
    props: true,
  }
];

export default routes;
