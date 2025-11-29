WARHOUSE ENDPOINTS

GET Warehouses
url => {{base_url}}/admin/company/branch/warehouses/search/{{company_id}}?per_page=&query_string&branch_id={{branch_id}}&paginate
method => GET
response => {
    "data": [
        {
            "id": "9fa6d01d-2254-4716-92ee-dac0eeaa1b76",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "branch_id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "name": "warehouse new new",
            "name_ar": "مخزن جديد جديد",
            "details": "warehouse new new",
            "details_ar": "مخزن جديد جديد",
        "is_default": true,
            "created_at": "2025-08-16T23:47:29.000000Z"
        },
        {
            "id": "9fa6cf9c-a0bf-413f-a71f-ebc51c1343b3",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "branch_id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "name": "new branch branch",
            "name_ar": "فرع جديد اوي",
            "details": "new branch branch",
            "details_ar": "فرع جديد اوي",
        "is_default": true,
            "created_at": "2025-08-16T23:46:05.000000Z"
        },
        {
            "id": "9f97119a-caf9-44f7-a398-fd0977c4cebf",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "branch_id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "name": "dsds",
            "name_ar": "dsds",
            "details": "dsds",
            "details_ar": "dsds",
        "is_default": true,
            "created_at": "2025-08-09T03:57:22.000000Z"
        },
        {
            "id": "9f53ee0c-3493-4e6e-9fe6-96ca51638cc7",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "branch_id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "name": "sasa",
            "name_ar": "السعودية",
            "details": "branch address",
            "details_ar": "عنوان المخزن",
        "is_default": true,
            "created_at": "2025-07-06T18:57:29.000000Z"
        },
        {
            "id": "9f4bf205-ebd0-4761-a025-23dc8868cb0b",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "branch_id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "name": "new branch1",
            "name_ar": "مخزن جديد1",
            "details": "branch address1",
            "details_ar": "عنوان المخزن1",
        "is_default": true,
            "created_at": "2025-07-02T19:41:58.000000Z"
        }
    ],
    "links": {
        "first": "https://www.ngcis.com/ERP/public/api/admin/company/branch/warehouses/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
        "last": "https://www.ngcis.com/ERP/public/api/admin/company/branch/warehouses/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
        "prev": null,
        "next": null
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/branch/warehouses/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "https://www.ngcis.com/ERP/public/api/admin/company/branch/warehouses/search/9f440efe-2b3a-46bb-9319-090027c5a773",
        "per_page": 10,
        "to": 5,
        "total": 5
    }
}

________________________________________________________________________________________
________________________________________________________________________________________
CREATE WAREHOUSE

url => {{base_url}}/admin/company/branch/warehouse
method => POST
body =>{
    "company_id": "{{company_id}}",
    "branch_id": "{{branch_id}}",
    "name": "main warehouse",
    "name_ar": "main warehouse",
    "details": "warehouse details",
    "details_ar": "warehouse details",
    "is_default": true,
}

response =>{
    "status_code": 200,
    "message": "company.company_warehouse_created_successfully",
    "data": {
        "id": "a0780109-d8d6-46c8-b901-ffea74e6731e",
        "name": "main warehouse",
        "name_ar": "main warehouse",
        "details": "warehouse details",
        "details_ar": "warehouse details",
        "is_default": true,
        "company": {
            "id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "Hosam Company",
            "name_ar": "شركة حسام",
            "phone": "0103465811878",
            "email": "dolsika57664442@gmail.com",
            "address": "almadarees st",
            "longitude": null,
            "latitude": null,
            "website_url": null,
            "facebook_url": null,
            "twitter_url": null,
            "currency": {
                "id": "232a6c6e-ec4d-4412-9fa0-d62503324b49",
                "type": "Currency",
                "code": 3,
                "key": "3",
                "prefix": "EGYPTIAN_POUND",
                "name": "Egyptian pound",
                "name_ar": "جنيه مصري"
            },
            "logo": {
                "id": "a06e22db-e3cd-4d35-9359-e90117769e25",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/FpnKkmxrJ0__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "FpnKkmxrJ0__t-shirt.jpg"
            },
            "cover": {
                "id": "a06e22e0-4ef5-42e5-9c25-7948f6b9c1dc",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/oYHquuLRah__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "oYHquuLRah__t-shirt.jpg"
            },
            "country": {
                "id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "egypt",
                "name_ar": "مصر",
                "phone_code": "020",
                "flag": null,
                "prefix": "ُEG"
            },
            "governorate": {
                "id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "elgharbia",
                "name_ar": "الغربية",
                "prefix": "garbia"
            },
            "city": {
                "id": "9e3a4843-0265-4f0b-8a53-adc722f7acc4",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "governorate_id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "name": "Tanta",
                "name_ar": "طنطا",
                "prefix": "tanta"
            },
            "creator_id": "9df1cdf7-d6cb-434b-8d66-f73b24c6e989"
        },
        "branch": {
            "id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "new branch",
            "name_ar": "فرع  جديد_",
            "phone": "01010101010",
            "address": "address en",
            "address_ar": "العنوان عربي",
            "created_at": "2025-07-02T01:12:24.000000Z"
        },
        "created_at": "2025-11-28T23:32:19.000000Z"
    }
}
_________________________________________________________________________________________________
_________________________________________________________________________________________________
UPDATE WAREHOUSE

url => {{base_url}}/admin/company/branch/warehouse/{{warehouse_id}}
method => PATCH
body =>{
    "name": "main warehouse",
    "name_ar": "main warehouse",
    "details": "warehouse details",
    "details_ar": "warehouse details",
    "is_default": true,
}

response =>{
    "status_code": 200,
    "message": "company.company_warehouse_updated_successfully",
    "data": {
        "id": "a0780109-d8d6-46c8-b901-ffea74e6731e",
        "name": "main warehouse",
        "name_ar": "main warehouse",
        "details": "warehouse details",
        "details_ar": "warehouse details",
        "is_default": false,
        "company": {
            "id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "Hosam Company",
            "name_ar": "شركة حسام",
            "phone": "0103465811878",
            "email": "dolsika57664442@gmail.com",
            "address": "almadarees st",
            "longitude": null,
            "latitude": null,
            "website_url": null,
            "facebook_url": null,
            "twitter_url": null,
            "currency": {
                "id": "232a6c6e-ec4d-4412-9fa0-d62503324b49",
                "type": "Currency",
                "code": 3,
                "key": "3",
                "prefix": "EGYPTIAN_POUND",
                "name": "Egyptian pound",
                "name_ar": "جنيه مصري"
            },
            "logo": {
                "id": "a06e22db-e3cd-4d35-9359-e90117769e25",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/FpnKkmxrJ0__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "FpnKkmxrJ0__t-shirt.jpg"
            },
            "cover": {
                "id": "a06e22e0-4ef5-42e5-9c25-7948f6b9c1dc",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/oYHquuLRah__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "oYHquuLRah__t-shirt.jpg"
            },
            "country": {
                "id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "egypt",
                "name_ar": "مصر",
                "phone_code": "020",
                "flag": null,
                "prefix": "ُEG"
            },
            "governorate": {
                "id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "elgharbia",
                "name_ar": "الغربية",
                "prefix": "garbia"
            },
            "city": {
                "id": "9e3a4843-0265-4f0b-8a53-adc722f7acc4",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "governorate_id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "name": "Tanta",
                "name_ar": "طنطا",
                "prefix": "tanta"
            },
            "creator_id": "9df1cdf7-d6cb-434b-8d66-f73b24c6e989"
        },
        "branch": {
            "id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "new branch",
            "name_ar": "فرع  جديد_",
            "phone": "01010101010",
            "address": "address en",
            "address_ar": "العنوان عربي",
            "created_at": "2025-07-02T01:12:24.000000Z"
        },
        "created_at": "2025-11-28T23:32:19.000000Z"
    }
}
_________________________________________________________________________________________________
_________________________________________________________________________________________________
Set Default Warehouse

url => {{base_url}}/admin/company/branch/warehouse-set-default/{{warehouse_id}}
method => PATCH
response => {
    "status_code": 200,
    "message": "company.company_warehouse_has_been_default_successfully",
    "data": {
        "id": "a0780109-d8d6-46c8-b901-ffea74e6731e",
        "name": "main warehouse",
        "name_ar": "main warehouse",
        "details": "warehouse details",
        "details_ar": "warehouse details",
        "is_default": true,
        "company": {
            "id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "Hosam Company",
            "name_ar": "شركة حسام",
            "phone": "0103465811878",
            "email": "dolsika57664442@gmail.com",
            "address": "almadarees st",
            "longitude": null,
            "latitude": null,
            "website_url": null,
            "facebook_url": null,
            "twitter_url": null,
            "currency": {
                "id": "232a6c6e-ec4d-4412-9fa0-d62503324b49",
                "type": "Currency",
                "code": 3,
                "key": "3",
                "prefix": "EGYPTIAN_POUND",
                "name": "Egyptian pound",
                "name_ar": "جنيه مصري"
            },
            "logo": {
                "id": "a06e22db-e3cd-4d35-9359-e90117769e25",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/FpnKkmxrJ0__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "FpnKkmxrJ0__t-shirt.jpg"
            },
            "cover": {
                "id": "a06e22e0-4ef5-42e5-9c25-7948f6b9c1dc",
                "file_path": "https://www.ngcis.com/ERP/public/uploads/oYHquuLRah__t-shirt.jpg",
                "original_name": "t-shirt.jpg",
                "new_name": "oYHquuLRah__t-shirt.jpg"
            },
            "country": {
                "id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "egypt",
                "name_ar": "مصر",
                "phone_code": "020",
                "flag": null,
                "prefix": "ُEG"
            },
            "governorate": {
                "id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "name": "elgharbia",
                "name_ar": "الغربية",
                "prefix": "garbia"
            },
            "city": {
                "id": "9e3a4843-0265-4f0b-8a53-adc722f7acc4",
                "country_id": "9df1d19b-b430-45c2-af2d-17a4ab3dc148",
                "governorate_id": "9e3a4711-31d4-472f-9e1f-63b9e546ba4e",
                "name": "Tanta",
                "name_ar": "طنطا",
                "prefix": "tanta"
            },
            "creator_id": "9df1cdf7-d6cb-434b-8d66-f73b24c6e989"
        },
        "branch": {
            "id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "new branch",
            "name_ar": "فرع  جديد_",
            "phone": "01010101010",
            "address": "address en",
            "address_ar": "العنوان عربي",
            "created_at": "2025-07-02T01:12:24.000000Z"
        },
        "created_at": "2025-11-28T23:32:19.000000Z"
    }
}

____________________________________________________________________________________
____________________________________________________________________________________
DELETE WAREHOUSE
URL=>{{base_url}}/admin/company/branch/warehouse/9aa4559f-0116-4ca5-ba6b-42dc02387d43
METHOD => DELETE
