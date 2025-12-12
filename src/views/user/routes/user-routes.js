import Table from "../parts/Table.vue";

const user_routes = [
  {
    // path: "/users/:propSearchUrl/:propMainUrl",
    path: "/users/",
    name: "users",
    component: Table,
    props: true,
  }
];

export default user_routes;
