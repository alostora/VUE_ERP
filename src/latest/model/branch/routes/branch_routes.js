import BranchTable from "../parts/BranchTable.vue";

const branch_routes = [
     {
          path: "/company/:company_id/branches",
          name: "company-branches",
          component: BranchTable,
          props: true,
     }
];

export default branch_routes;