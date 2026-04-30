import Table from "../parts/Table.vue";
import Show from "../parts/Show.vue";


import warehouse_routes from "@/views/warehouse/routes/routes";
// import employee_routes from "@/views/employee/routes/routes";

import BranchDetails from "../parts/details/BranchDetails.vue";

const routes = [
  {
    path: "/company/:company_id/branches",
    name: "company-branches",
    component: Table,
    props: true,
  },
  {
    path: "/branch/:company_id/show/:branch_id",
    name: "branch-show",
    component: Show,
    props: (route) => ({
      company_id: route.params.company_id,
      branch_id: route.params.branch_id,
    }),
  },
  ...warehouse_routes,
  // ...employee_routes,
];

export default routes;