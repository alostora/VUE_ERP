// @/utils/sidebarItems.js
const sidebarItems = function sidebarItems(model, company_id = null) {

     if (model === "homePage") {
          return [
               { label: "menu.home", icon: "pi pi-home", route: "/" },
               { label: "menu.users", icon: "pi pi-users", route: "/users" },
               { label: "menu.countries", icon: "pi pi-flag", route: "/countries" },
               {
                    label: "menu.governorates",
                    icon: "pi pi-map",
                    route: "/governorates",
               },
               { label: "menu.cities", icon: "pi pi-building", route: "/cities" },
               {
                    label: "menu.companies",
                    icon: "pi pi-briefcase",
                    route: "/companies",
               },
          ];
     } else if (model === "company" && company_id !== null) {

          return [
               {
                    label: "companies.companyDetails",
                    icon: "pi pi-building",
                    route: `/company/${company_id}/details`,
               },
               {
                    label: "companies.categories",
                    icon: "pi pi-folder",
                    route: `/company/${company_id}/categories`,
               },
               {
                    label: "companies.measurementUnits",
                    icon: "pi pi-calculator",
                    route: `/company/${company_id}/measurement-units`,
               },
               {
                    label: "companies.variants",
                    icon: "pi pi-palette",
                    route: `/company/${company_id}/variants`,
               },
               {
                    label: "companies.products",
                    icon: "pi pi-shopping-bag",
                    route: `/company/${company_id}/products`,
               },
               {
                    label: "companies.finalProducts",
                    icon: "pi pi-tags",
                    route: `/company/${company_id}/final-products`,
               },
               {
                    label: "companies.contacts",
                    icon: "pi pi-address-book",
                    route: `/company/${company_id}/contacts`,
               },
               {
                    label: "companies.branches",
                    icon: "pi pi-map-marker",
                    route: `/company/${company_id}/branches`,
               },
               {
                    label: "companies.invoiceStages",
                    icon: "pi pi-receipt",
                    route: `/company/${company_id}/invoice-stages`,
               },
               {
                    label: "companies.taxes",
                    icon: "pi pi-percentage",
                    route: `/company/${company_id}/taxes`,
               },
               {
                    label: "companies.discounts",
                    icon: "pi pi-pound",
                    route: `/company/${company_id}/discounts`,
               },
          ];
     }
};

export default sidebarItems;