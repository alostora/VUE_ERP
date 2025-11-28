import CompanyTable from "../parts/CompanyTable.vue";
import CompanyShow from "../parts/CompanyShow.vue";
import category_routes from "../../category/routes/category_routes";
import measurement_unit_routes from "../../measurement_unit/routes/measurement_unit_routes";
import variant_routes from "../../variant/routes/variant_routes";
import product_routes from "../../product/routes/product_routes";
import final_product_routes from "../../final_product/routes/final_product_routes";
import branch_routes from "../../branch/routes/branch_routes";
import invoice_stage_routes from "../../invoice_stage/routes/invoice_stage_routes";
import tax_routes from "../../tax/routes/tax_routes";
import discount_routes from "../../discount/routes/discount_routes";
import CompanyDetails from "../parts/CompanyDetails.vue";

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
                    component: CompanyDetails,
                    props: (route) => ({
                         company_id: route.params.company_id
                    }),
               },
               ...category_routes,
               ...measurement_unit_routes,
               ...variant_routes,
               ...product_routes,
               ...final_product_routes,
               ...branch_routes,
               ...invoice_stage_routes,
               ...tax_routes,
               ...discount_routes,
          ],
     }
];

export default company_routes;