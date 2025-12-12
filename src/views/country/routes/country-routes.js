import Table from "../parts/Table.vue";

const country_routes = [
  {
    path: "/countries/",
    name: "countries",
    component: Table,
    props: true,
  }
];

export default country_routes;
