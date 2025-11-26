import InvoiceStageTable from "../parts/InvoiceStageTable.vue";

const invoice_stage_routes = [
     {
          path: "/company/:company_id/invoice-stages",
          name: "company-invoice-stages",
          component: InvoiceStageTable,
          props: true,
     }
];

export default invoice_stage_routes;