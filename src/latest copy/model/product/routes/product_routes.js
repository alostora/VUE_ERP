import ProductTable from "../parts/ProductTable.vue";

const product_routes = [
     {
          path: "/company/:company_id/products",
          name: "company-products",
          component: ProductTable,
          props: (route) => ({
               company_id: route.params.company_id
          }),
     }
];

export default product_routes;