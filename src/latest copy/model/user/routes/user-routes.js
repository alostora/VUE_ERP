import UserTable from "../parts/UserTable.vue";

const user_routes = [
  {
    // path: "/users/:propSearchUrl/:propMainUrl",
    path: "/users/",
    name: "users",
    component: UserTable,
    props: true,
  }
];

export default user_routes;
