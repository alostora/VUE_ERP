import CategoryTable from "../parts/CategoryTable.vue";

const category_routes = [
     {
          path: "/company/:company_id/categories",
          name: "company-categories",
          component: CategoryTable,
          props: true,
     }
];

export default category_routes;