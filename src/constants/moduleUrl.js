import general_request from "@/utils/general_request";
import lookupTypes from "@/constants/lookupTypes";

export default {
     URLS: {
          LOOK_UP: {
               propSearchUrl: `${general_request.BASE_URL}/system-lookups`,
               propGetUrl: `${general_request.BASE_URL}/system-lookups`,
               propMainUrl: `${general_request.BASE_URL}/system-lookups`,
          },
          USER: {
               propSearchUrl: `${general_request.BASE_URL}/admin/users/search`,
               propGetUrl: `${general_request.BASE_URL}/admin/users`,
               propMainUrl: `${general_request.BASE_URL}/admin/user`,
          },
          COUNTRY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/countries/search`,
               propGethUrl: `${general_request.BASE_URL}/admin/countries/search`,
               propMainUrl: `${general_request.BASE_URL}/admin/country`,
          },
          GOVERNORATE: {
               propSearchUrl: `${general_request.BASE_URL}/admin/governorates-search-all`,
               propGethUrl: `${general_request.BASE_URL}/admin/governorates`,
               propMainUrl: `${general_request.BASE_URL}/admin/governorate`,
          },
          CITY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/cities-search-all`,
               propGethUrl: `${general_request.BASE_URL}/admin/cities`,
               propMainUrl: `${general_request.BASE_URL}/admin/city`,
          },
          CLIENT: {
               propSearchUrl: `${general_request.BASE_URL}/admin/clients/search`,
               propGethUrl: `${general_request.BASE_URL}/admin/clients`,
               propMainUrl: `${general_request.BASE_URL}/admin/client`,
          },
          COMPANY: {
               propSearchUrl: `${general_request.BASE_URL}/admin/companies/search`,
               propGethUrl: `${general_request.BASE_URL}/admin/companies`,
               propMainUrl: `${general_request.BASE_URL}/admin/company`,
          },
     }
}