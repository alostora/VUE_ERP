// src/latest/model/governorate/routes/governorate-routes.js
import GovernorateTable from "../parts/GovernorateTable.vue";

const governorate_routes = [
     {
          path: "/governorates/:country_id?",
          name: "governorates",
          component: GovernorateTable,
          props: (route) => ({
               country_id: route.params.country_id || null
          }),
     }
];

export default governorate_routes;