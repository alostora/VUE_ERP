import MeasurementUnitTable from "../parts/MeasurementUnitTable.vue";

const measurement_unit_routes = [
     {
          path: "/company/:company_id/measurement-units",
          name: "company-measurement-units",
          component: MeasurementUnitTable,
          props: true,
     }
];

export default measurement_unit_routes;