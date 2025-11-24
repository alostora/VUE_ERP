import CompanyTable from "../parts/CompanyTable.vue";
import CompanyShow from "../parts/CompanyShow.vue";
import category_routes from "../../category/routes/category_routes";
import measurement_unit_routes from "../../measurement_unit/routes/measurement_unit_routes";
import details from "../parts/CompanyDetails.vue";

const company_routes = [
     {
          path: "/companies",
          name: "companies",
          component: CompanyTable,
          props: true,
     },
     {
          path: "/company/:company_id/show",
          name: "company-show",
          component: CompanyShow,
          props: (route) => ({
               company_id: route.params.company_id
          }),
          redirect: { name: 'company-details' },
          children: [
               {
                    path: "/company/:company_id/details",
                    name: "company-details",
                    component: details,
                    props: (route) => ({
                         company_id: route.params.company_id
                    }),
               },
               ...category_routes,
               ...measurement_unit_routes,
          ],
     }
];

export default company_routes;