import Table from "../parts/Table.vue";
import Show from "../parts/Show.vue";
// import category_routes from "@/latest/model/category/routes/category_routes";
// import measurement_unit_routes from "@/latest/model/measurement_unit/routes/measurement_unit_routes";
// import variant_routes from "@/latest/model/variant/routes/variant_routes";


import product_routes from "@/latest/model/product/routes/product_routes";
import final_product_routes from "@/latest/model/final_product/routes/final_product_routes";
import branch_routes from "@/latest/model/branch/routes/branch_routes";
import invoice_stage_routes from "@/latest/model/invoice_stage/routes/invoice_stage_routes";
import tax_routes from "@/latest/model/tax/routes/tax_routes";
import discount_routes from "@/latest/model/discount/routes/discount_routes";
import contact_routes from "@/latest/model/contact/routes/contact_routes";

import category_routes from "@/views/category/routes/routes";
import measurement_unit_routes from "@/views/measurement_unit/routes/routes";
import variant_routes from "@/views/variant/routes/routes";
import variant_value_routes from "@/views/variant_value/routes/routes";

import CompanyDetails from "../parts/details/CompanyDetails.vue";

const routes = [
  {
    path: "/companies",
    name: "companies",
    component: Table,
    props: true,
  },
  {
    path: "/company/:company_id/show",
    name: "company-show",
    component: Show,
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
      ...variant_value_routes,
      ...product_routes,
      ...final_product_routes,
      ...branch_routes,
      ...contact_routes,
      ...invoice_stage_routes,
      ...tax_routes,
      ...discount_routes,
    ],
  }
];

export default routes;