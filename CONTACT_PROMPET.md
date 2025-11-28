






CONTACTS APIS
GET CONTACTS
METHOD => GET
URL => {{base_url}}/admin/company/contacts/search/{{company_id}}?per_page=&query_string&email=&phone&address&paginate=true
RESPONSE =>{
    "data": [
        {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "contact name",
            "email": "contact@contact.contact",
            "phone": "01067188489121",
            "address": "address 1212",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        {
            "id": "9f6c38ce-a960-4269-8dc1-0f2c557a1b70",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "Talaat",
            "email": "hossam_2@gmail.com",
            "phone": "01167188489",
            "address": "address 2",
            "created_at": "2025-07-18T20:46:23.000000Z"
        },
        {
            "id": "9f6a5543-0829-49fe-9871-fac4c97cb019",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "hosam zakiربربر",
            "email": "hossam_1@gmail.com",
            "phone": "01067188489",
            "address": "العنوان _3",
            "created_at": "2025-07-17T22:14:19.000000Z"
        }
    ],
    "links": {
        "first": "https://www.ngcis.com/ERP/public/api/admin/company/contacts/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
        "last": "https://www.ngcis.com/ERP/public/api/admin/company/contacts/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
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
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/contacts/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "https://www.ngcis.com/ERP/public/api/admin/company/contacts/search/9f440efe-2b3a-46bb-9319-090027c5a773",
        "per_page": 10,
        "to": 3,
        "total": 3
    }
}
____________________________________________________
____________________________________________________

CREATE CONTACT
METHOD => POST
URL => {{base_url}}/admin/company/contact
BODY => {
    "company_id": "{{company_id}}",
    "name": "contact name",
    "email": "contac12t@contact.contact",
    "phone": "010671812189",
    "address": "addresses123 1"
}

RESPONSE => {
    "status_code": 200,
    "message": "company.company_contact_created_successfully",
    "data": {
        "id": "a0775305-1e61-44fa-8454-49c4450df72a",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "contact name",
        "email": "contac12t@contact.contact",
        "phone": "010671812189",
        "address": "addresses123 1",
        "created_at": "2025-11-28T15:25:43.000000Z"
    }
}
____________________________________________________
____________________________________________________

UPDATE CONTACT
METHOD => PATCH
URL => {{base_url}}/admin/company/contact/{{contact_id}}
BODY => {
    "name": "contact name",
    "email": "contac12t@contact.contact",
    "phone": "010671812189",
    "address": "addresses123 1"
}

RESPONSE => {
    "status_code": 200,
    "message": "company.company_contact_created_successfully",
    "data": {
        "id": "a0775305-1e61-44fa-8454-49c4450df72a",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "contact name",
        "email": "contac12t@contact.contact",
        "phone": "010671812189",
        "address": "addresses123 1",
        "created_at": "2025-11-28T15:25:43.000000Z"
    }
}
____________________________________________________
____________________________________________________
DELETE CONTACT
METHOD => DELETE
URL => {{base_url}}/admin/company/contact/{{contact_id}}

_______________________________________________________
_______________________________________________________
_______________________________________________________

RELATED PHONES

GET CONTACT PHONES
METHOD => GET
URL => {{base_url}}/admin/company/contact-phones/search/{{contact_id}}?per_page=&query_string=&paginate=true
RESPONSE => {
    "data": [
        {
            "id": "a07751be-c8d7-47cd-b1d2-3b688126bfa7",
            "contact_id": {
                "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "ali",
                "email": "hossam_3@gmail.com",
                "phone": "01267188489",
                "address": "address 3",
                "created_at": "2025-11-28T14:48:18.000000Z"
            },
            "phone": "01267188489",
            "is_default": true,
            "created_at": "2025-11-28T15:22:10.000000Z"
        },
        {
            "id": "a0774ccd-08a9-4f16-9f07-f8a1a65cc70f",
            "contact_id": {
                "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "ali",
                "email": "hossam_3@gmail.com",
                "phone": "01267188489",
                "address": "address 3",
                "created_at": "2025-11-28T14:48:18.000000Z"
            },
            "phone": "0106718848912",
            "is_default": false,
            "created_at": "2025-11-28T15:08:20.000000Z"
        },
        {
            "id": "a07745a2-1483-4ebf-959e-3f2ac7fd72cb",
            "contact_id": {
                "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
                "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
                "name": "ali",
                "email": "hossam_3@gmail.com",
                "phone": "01267188489",
                "address": "address 3",
                "created_at": "2025-11-28T14:48:18.000000Z"
            },
            "phone": "010671884189",
            "is_default": false,
            "created_at": "2025-11-28T14:48:18.000000Z"
        }
    ],
    "links": {
        "first": "https://www.ngcis.com/ERP/public/api/admin/company/contact-phones/search/a07745a2-136a-42c5-93da-fbd63415aaa1?page=1",
        "last": "https://www.ngcis.com/ERP/public/api/admin/company/contact-phones/search/a07745a2-136a-42c5-93da-fbd63415aaa1?page=1",
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
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/contact-phones/search/a07745a2-136a-42c5-93da-fbd63415aaa1?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "https://www.ngcis.com/ERP/public/api/admin/company/contact-phones/search/a07745a2-136a-42c5-93da-fbd63415aaa1",
        "per_page": 10,
        "to": 3,
        "total": 3
    }
}

______________________________________________
______________________________________________
______________________________________________
CREATE CONTACT PHONE
METHOD => POST
URL => {{base_url}}/admin/company/contact-phone
BODY => {
    "contact_id": "{{contact_id}}",
    "phone": "01067188489121",
    "is_default": true
}
RESPOSE => {
    "status_code": 200,
    "message": "company.company_contact_phones_created_successfully",
    "data": {
        "id": "a0775475-9a02-46e7-bac6-af3b58c87265",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "01067188489121",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "phone": "01067188489121",
        "is_default": true,
        "created_at": "2025-11-28T15:29:45.000000Z"
    }
}
_________________________________________________________
_________________________________________________________
UPDATE CONTACT PHONE
URL => {{base_url}}/admin/company/contact-phone/{{contact_phone_id}}
METHOD => PATCH
BODY => {
    "phone": "010671884189",
    "is_default": true
}
RESPONSE => {
    "status_code": 200,
    "message": "company.company_contact_phone_updated_successfully",
    "data": {
        "id": "a07751be-c8d7-47cd-b1d2-3b688126bfa7",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "010671884189",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "phone": "010671884189",
        "is_default": true,
        "created_at": "2025-11-28T15:22:10.000000Z"
    }
}
________________________________________________________________
________________________________________________________________
DELETE CONTACT PHONE
URL => {{base_url}}/admin/company/contact-phone/{{contact_phone_id}}
METHOD => DELETE

______________________________________________
______________________________________________
______________________________________________
CREATE CONTACT ADDRESS
METHOD => POST
URL => {{base_url}}/admin/company/contact-address
BODY => {
    "contact_id": "{{contact_id}}",
    "address": "address address",
    "is_default": true
}
RESPOSE => {
    "status_code": 200,
    "message": "company.company_contact_addresses_created_successfully",
    "data": {
        "id": "a0775475-9a02-46e7-bac6-af3b58c87265",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "01067188489121",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "address": "address 3",
        "is_default": true,
        "created_at": "2025-11-28T15:29:45.000000Z"
    }
}
_________________________________________________________
_________________________________________________________
UPDATE CONTACT ADDRESS
URL => {{base_url}}/admin/company/contact-address/{{contact_address_id}}
METHOD => PATCH
BODY => {
    "address": "010671884189",
    "is_default": true
}
RESPONSE => {
    "status_code": 200,
    "message": "company.company_contact_address_updated_successfully",
    "data": {
        "id": "a07751be-c8d7-47cd-b1d2-3b688126bfa7",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "010671884189",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "address": "address 3",
        "is_default": true,
        "created_at": "2025-11-28T15:22:10.000000Z"
    }
}
________________________________________________________________
________________________________________________________________
DELETE CONTACT ADDRESS
URL => {{base_url}}/admin/company/contact-address/{{contact_phone_id}}
METHOD => DELETE

______________________________________________
______________________________________________
______________________________________________
CREATE CONTACT ADDRESS
METHOD => POST
URL => {{base_url}}/admin/company/contact-email
BODY => {
    "contact_id": "{{contact_id}}",
    "email": "email@email.com",
    "is_default": true
}
RESPOSE => {
    "status_code": 200,
    "message": "company.company_contact_emailes_created_successfully",
    "data": {
        "id": "a0775475-9a02-46e7-bac6-af3b58c87265",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "01067188489121",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "email": "01067188489121",
        "is_default": true,
        "created_at": "2025-11-28T15:29:45.000000Z"
    }
}
_________________________________________________________
_________________________________________________________
UPDATE CONTACT ADDRESS
URL => {{base_url}}/admin/company/contact-email/{{contact_email_id}}
METHOD => PATCH
BODY => {
    "email": "email@email.com",
    "is_default": true
}
RESPONSE => {
    "status_code": 200,
    "message": "company.company_contact_email_updated_successfully",
    "data": {
        "id": "a07751be-c8d7-47cd-b1d2-3b688126bfa7",
        "contact_id": {
            "id": "a07745a2-136a-42c5-93da-fbd63415aaa1",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "ali",
            "email": "hossam_3@gmail.com",
            "phone": "010671884189",
            "address": "address 3",
            "created_at": "2025-11-28T14:48:18.000000Z"
        },
        "email": "hossam_3@gmail.com",
        "is_default": true,
        "created_at": "2025-11-28T15:22:10.000000Z"
    }
}
________________________________________________________________
________________________________________________________________
DELETE CONTACT email
URL => {{base_url}}/admin/company/contact-email/{{contact_phone_id}}
METHOD => DELETE