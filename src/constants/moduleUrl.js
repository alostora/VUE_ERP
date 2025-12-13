import general_request from "@/utils/general_request";
import lookupTypes from "@/constants/lookupTypes";

export default {
     URLS: {
          LOOK_UP: {
               propSearchUrl: `${general_request.BASE_URL}/system-lookups/${lookupTypes.LOOKUP_TYPES.USER_ACCOUNT_TYPE}`,
               propGetUrl: `${general_request.BASE_URL}/system-lookups/${lookupTypes.LOOKUP_TYPES.USER_ACCOUNT_TYPE}`,
               propMainUrl: `${general_request.BASE_URL}/system-lookups/${lookupTypes.LOOKUP_TYPES.USER_ACCOUNT_TYPE}`,
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
     }
}