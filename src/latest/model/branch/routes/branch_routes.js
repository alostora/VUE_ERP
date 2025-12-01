import BranchTable from "../parts/BranchTable.vue";
import BranchDetails from "../parts/details/BranchDetails.vue";
import BranchShow from "../parts/BranchShow.vue";
import WarehouseTable from "../../warehouse/parts/WarehouseTable.vue";
import EmployeeTable from "../../employee/parts/EmployeeTable.vue";

const branch_routes = [
     {
          path: "/company/:company_id/branches",
          name: "company-branches",
          component: BranchTable,
          props: true,
     },
     {
          path: "/company/:company_id/branches/:branch_id",
          name: "company-branch-show",
          redirect: { name: 'branch-details' },
          component: BranchShow,
          props: true,
          children: [
               {
                    path: "branch-details",
                    name: "branch-details",
                    component: BranchDetails,
                    props: true,
               },
               {
                    path: "warehouses",
                    name: "branch-warehouses",
                    component: WarehouseTable,
                    props: true,
               },
               {
                    path: "employees",
                    name: "branch-employees",
                    component: EmployeeTable,
                    props: true,
               },
          ]
     }
];

export default branch_routes;