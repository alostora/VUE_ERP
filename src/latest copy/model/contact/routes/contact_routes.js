import ContactTable from "../parts/ContactTable.vue";
import ContactPhonesTableModal from "../contact_phone/parts/ContactPhonesTableModal.vue";
import ContactAddressesTableModal from "../contact_address/parts/ContactAddressesTableModal.vue";
import ContactEmailsTableModal from "../contact_email/parts/ContactEmailsTableModal.vue";

const contact_routes = [
  {
    path: "/company/:company_id/contacts",
    name: "company-contacts",
    component: ContactTable,
    props: true,
  },
  {
    path: "/company/:company_id/contacts/:contact_id/phones",
    name: "company-contact-phones",
    component: ContactPhonesTableModal,
    props: true,
  },
  {
    path: "/company/:company_id/contacts/:contact_id/addresses",
    name: "company-contact-addresses",
    component: ContactAddressesTableModal,
    props: true,
  },
  {
    path: "/company/:company_id/contacts/:contact_id/emails",
    name: "company-contact-emails",
    component: ContactEmailsTableModal,
    props: true,
  },
];

export default contact_routes;
