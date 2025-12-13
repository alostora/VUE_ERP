import Table from "../parts/Table.vue";

const routes = [
  {
    path: "/cities/:governorate_id?",
    name: "cities",
    component: Table,
    props: (route) => ({
      governorate_id: route.params.governorate_id || null
    }),
  }
];

export default routes;
