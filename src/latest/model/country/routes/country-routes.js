import CountryTable from "../parts/CountryTable.vue";

const country_routes = [
  {
    path: "/countries/",
    name: "countries",
    component: CountryTable,
    props: true,
  }
];

export default country_routes;
