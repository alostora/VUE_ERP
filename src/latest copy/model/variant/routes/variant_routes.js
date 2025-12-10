import VariantTable from "../parts/VariantTable.vue";

const variant_routes = [
     {
          path: "/company/:company_id/variants",
          name: "company-variants",
          component: VariantTable,
          props: (route) => ({
               company_id: route.params.company_id
          }),
     }
];

export default variant_routes;