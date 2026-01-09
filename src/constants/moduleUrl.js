import general_request from "@/utils/general_request";

export default {
     URLS: {
          LOOK_UP: {
               propSearchUrl: `${general_request.BASE_URL}/system-lookups`,
               propGetUrl: `${general_request.BASE_URL}/system-lookups`,
               propMainUrl: `${general_request.BASE_URL}/system-lookups`,
               propCreateMultiUrl: ``,
          },
          USER: {
               propSearchUrl: `${general_request.BASE_URL}/admin/users/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/users`,
               propMainUrl: `${general_request.BASE_URL}/admin/user`,
               propCreateMultiUrl: ``,
          },
          COUNTRY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/countries/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/countries/search`,
               propMainUrl: `${general_request.BASE_URL}/admin/country`,
               propCreateMultiUrl: ``,
          },
          GOVERNORATE: {
               propSearchUrl: `${general_request.BASE_URL}/admin/governorates-search-all`,
               propGetUrl: `${general_request.BASE_URL}/admin/governorates`,
               propMainUrl: `${general_request.BASE_URL}/admin/governorate`,
               propCreateMultiUrl: ``,
          },
          CITY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/cities-search-all`,
               propGetUrl: `${general_request.BASE_URL}/admin/cities`,
               propMainUrl: `${general_request.BASE_URL}/admin/city`,
               propCreateMultiUrl: ``,
          },
          CLIENT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/clients/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/clients`,
               propMainUrl: `${general_request.BASE_URL}/admin/client`,
               propCreateMultiUrl: ``,
          },
          COMPANY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/companies/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/companies`,
               propMainUrl: `${general_request.BASE_URL}/admin/company`,
               propCreateMultiUrl: ``,
          },
          CATEGORY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/categories/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/categories`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/category`,
               propCreateMultiUrl: ``,
          },
          MEASUREMENT_UNIT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/measurement-units/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/measurement-units`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/measurement-unit`,
               propCreateMultiUrl: ``,
          },
          VARIANT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/variants/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/variants`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/variant`,
               propCreateMultiUrl: ``,
          },
          VARIANT_VALUE: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/variant-values/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/variant-values`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/variant-value`,
               propCreateMultiUrl: `${general_request.BASE_URL}/admin/company/variant-values`,
          },
          PRODUCT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/products/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/products`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/product`,
               propCreateMultiUrl: ``,
          },
          FINAL_PRODUCT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/product/company-final-products/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/product/company-final-products`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/product/final-product`,
               propCreateMultiUrl: ``,
          },
          FINAL_PRODUCT_VARIANT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/product/final-product-variant-values/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`,
               propCreateMultiUrl: `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`,
          },
          FINAL_PRODUCT_IMAGE: {
               propSearchUrl: `${general_request.BASE_URL}/admin/company/product/final-product-images/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/company/product/final-product-image`,
               propMainUrl: `${general_request.BASE_URL}/admin/company/product/final-product-image`,
               propCreateMultiUrl: `${general_request.BASE_URL}/admin/company/product/final-product-image`,
          },
     }
}