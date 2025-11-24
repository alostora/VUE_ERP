import CityTable from "../parts/CityTable.vue";

const city_routes = [
     {
          path: "/cities/:country_id?/:governorate_id?",
          name: "cities",
          component: CityTable,
          props: (route) => ({
               country_id: route.params.country_id || null,
               governorate_id: route.params.governorate_id || null
          }),
     }
];

export default city_routes;