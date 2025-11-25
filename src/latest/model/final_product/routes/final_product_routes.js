import FinalProductTable from "../parts/FinalProductTable.vue";

const final_product_routes = [
     {
          path: "/company/:company_id/final-products",
          name: "company-final-products",
          component: FinalProductTable,
          props: true,
     }
];

export default final_product_routes;