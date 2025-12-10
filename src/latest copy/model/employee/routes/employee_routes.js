import EmployeeTable from "../parts/EmployeeTable.vue";

const employee_routes = [
     {
          path: "/company/:company_id/employees",
          name: "company-employees",
          component: EmployeeTable,
          props: true,
     }
];

export default employee_routes;