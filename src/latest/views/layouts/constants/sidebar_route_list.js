const sidebar_routes = {
  general_events: {
    name: "general_events",
    params: {
      propSearchUrl: "/admin/system-events/search",
      propMainUrl: "/admin/system-event",
    },
  },
  alarm_events: {
    name: "alarm_events",
    params: {
      propSearchUrl: "/admin/users/search",
      propMainUrl: "/admin/user",
    },
  },
  fault_events: {
    name: "fault_events",
    params: {
      propSearchUrl: "/admin/users/search",
      propMainUrl: "/admin/user",
    },
  },
  users: {
    name: "users",
    params: {
      propSearchUrl: "/admin/users/search",
      propMainUrl: "/admin/user",
    },
  },
  building_types: {
    name: "building_types",
    params: {
      propSearchUrl: "/admin/building-types/search",
      propMainUrl: "/admin/building-type",
    },
  },
  countries: {
    name: "countries",
    params: {
      propSearchUrl: "/admin/countries/search",
      propMainUrl: "/admin/country",
    },
  },
  governorates: {
    name: "governorates",
    params: {
      propSearchUrl: "/admin/governorates-search-all",
      propMainUrl: "/admin/governorate",
    },
  },
  cities: {
    name: "cities",
    params: {
      propSearchUrl: "/admin/cities-search-all",
      propMainUrl: "/admin/city",
    },
  },
  zones: {
    name: "zones",
    params: {
      propSearchUrl: "/admin/zones-search-all",
      propMainUrl: "/admin/zone",
    },
  },
  districts: {
    name: "districts",
    params: {
      propSearchUrl: "/admin/districts-search-all",
      propMainUrl: "/admin/district",
    },
  },
  manufactures: {
    name: "manufactures",
    params: {
      propSearchUrl: "/admin/manufactures/search",
      propMainUrl: "/admin/manufacture",
    },
  },
  manufacture_brands: {
    name: "manufacture_brands",
    params: {
      propSearchUrl: "/admin/manufacture-brands-search-all",
      propMainUrl: "/admin/manufacture-brand",
    },
  },
  manufacture_brand_models: {
    name: "manufacture_brand_models",
    params: {
      propSearchUrl: "/admin/manufacture-brand-models-search-all",
      propMainUrl: "/admin/manufacture-brand-model",
    },
  },
  manufacture_brand_protocols: {
    name: "manufacture_brand_protocols",
    params: {
      propSearchUrl: "/admin/manufacture-brand-protocols-search-all",
      propMainUrl: "/admin/manufacture-brand-protocol",
    },
  },
  manufacture_brand_software_versions: {
    name: "manufacture_brand_software_versions",
    params: {
      propSearchUrl: "/admin/manufacture-brand-software-versions-search-all",
      propMainUrl: "/admin/manufacture-brand-software-version",
    },
  },
  manufacture_brand_firmware_versions: {
    name: "manufacture_brand_firmware_versions",
    params: {
      propSearchUrl: "/admin/manufacture-brand-firmware-versions-search-all",
      propMainUrl: "/admin/manufacture-brand-firmware-version",
    },
  },
  baud_rates: {
    name: "baud_rates",
    params: {
      propSearchUrl: "/admin/baud-rates/search",
      propMainUrl: "/admin/baud-rate",
    },
  },
};

export default sidebar_routes;
