<template>
  <div class="contact-table p-3">
    <div class="mb-3 flex justify-content-between align-items-center">
      <h2 class="m-0">{{ $t("contacts.title") }}</h2>
      <Button
        :label="$t('contacts.addContact')"
        icon="pi pi-plus"
        @click="openCreateModal"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('contacts.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <Select
        v-model="per_page"
        :options="perPageOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('contacts.show')"
        @change="handlePerPageChange"
        class="w-10rem"
      />
    </div>

    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      :loading="loading"
      :lazy="true"
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <Column field="id" :header="$t('contacts.id')" style="min-width: 70px">
        <template #body="slotProps"
          ><span class="font-mono text-sm">{{
            slotProps.index + 1
          }}</span></template
        >
      </Column>

      <Column
        field="name"
        :header="$t('contacts.name')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div>
            <div class="font-medium">{{ slotProps.data.name }}</div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.email }}
            </div>
          </div>
        </template>
      </Column>

      <Column
        field="phone"
        :header="$t('contacts.phone')"
        style="min-width: 150px"
      >
        <template #body="slotProps">{{ slotProps.data.phone || "-" }}</template>
      </Column>

      <Column
        field="address"
        :header="$t('contacts.address')"
        style="min-width: 200px"
      >
        <template #body="slotProps">{{
          slotProps.data.address || "-"
        }}</template>
      </Column>

      <Column
        field="created_at"
        :header="$t('contacts.createdAt')"
        style="min-width: 130px"
      >
        <template #body="slotProps">{{
          formatDate(slotProps.data.created_at)
        }}</template>
      </Column>

      <Column
        :header="$t('contacts.actions')"
        :exportable="false"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-phone"
              class="p-button-text p-button-sm"
              @click.prevent="openPhonesModal(slotProps.data)"
              v-tooltip.top="$t('contacts.phones')"
            />
            <Button
              icon="pi pi-map-marker"
              class="p-button-text p-button-sm"
              @click.prevent="openAddressesModal(slotProps.data)"
              v-tooltip.top="$t('contacts.addresses')"
            />
            <Button
              icon="pi pi-envelope"
              class="p-button-text p-button-sm"
              @click.prevent="openEmailsModal(slotProps.data)"
              v-tooltip.top="$t('contacts.emails')"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editContact(slotProps.data)"
              v-tooltip.top="$t('contacts.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteContact(slotProps.data)"
              v-tooltip.top="$t('contacts.delete')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-address-book text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">{{ $t("contacts.noContacts") }}</h3>
      <p class="text-color-secondary">
        {{ $t("contacts.createFirstContact") }}
      </p>
      <Button
        :label="$t('contacts.addContact')"
        icon="pi pi-plus"
        @click="openCreateModal"
        class="p-button-primary mt-3"
      />
    </div>

    <ContactCreateModal
      ref="createModal"
      :company_id="companyId"
      @contact-created="handleContactCreated"
    />
    <ContactEditModal
      ref="editModal"
      :contact="selectedItem"
      :company_id="companyId"
      @contact-updated="handleContactUpdated"
    />
    <!-- Per-resource modal wrappers (open inline without using routes) -->
    <ContactPhonesTableModal
      v-if="phonesContactId"
      :company_id="companyId"
      :contact_id="phonesContactId"
      @closed="phonesContactId = null"
    />
    <ContactAddressesTableModal
      v-if="addressesContactId"
      :company_id="companyId"
      :contact_id="addressesContactId"
      @closed="addressesContactId = null"
    />
    <ContactEmailsTableModal
      v-if="emailsContactId"
      :company_id="companyId"
      :contact_id="emailsContactId"
      @closed="emailsContactId = null"
    />
    <!-- Related resource modals are now located in their own folders; navigation uses routes -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";
import ConfirmDialog from "primevue/confirmdialog";

import ContactCreateModal from "./ContactCreateModal.vue";
import ContactEditModal from "./ContactEditModal.vue";
import ContactPhonesTableModal from "../contact_phone/parts/ContactPhonesTableModal.vue";
import ContactAddressesTableModal from "../contact_address/parts/ContactAddressesTableModal.vue";
import ContactEmailsTableModal from "../contact_email/parts/ContactEmailsTableModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "ContactTable",
  components: {
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ContactCreateModal,
    ContactEditModal,
    ContactPhonesTableModal,
    ContactAddressesTableModal,
    ContactEmailsTableModal,
    ConfirmDialog,
  },
  directives: { tooltip: Tooltip },
  mixins: [useTable(), useCrud()],
  props: { company_id: { type: String, required: false } },
  data() {
    return {
      selectedItem: null,
      phonesContactId: null,
      addressesContactId: null,
      emailsContactId: null,
    };
  },
  computed: {
    companyId() {
      return this.company_id || this.$route.params.company_id || "";
    },
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/contacts/search/${this.companyId}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/contact`;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    openCreateModal() {
      this.$refs.createModal.openModal();
    },
    handleContactCreated(newContact) {
      this.handleItemCreated(newContact);
    },
    editContact(contact) {
      this.selectedItem = { ...contact };
      this.$nextTick(() => this.$refs.editModal.openModal());
    },
    openPhonesModal(contact) {
      this.phonesContactId = contact.id;
    },
    openAddressesModal(contact) {
      this.addressesContactId = contact.id;
    },
    openEmailsModal(contact) {
      this.emailsContactId = contact.id;
    },
    handleContactUpdated(updated) {
      this.handleItemUpdated(updated);
    },
    deleteContact(contact) {
      this.deleteItem(
        contact,
        this.propMainUrl,
        this.$t("contacts.contactDeleted"),
        this.$t("contacts.deleteError")
      );
    },
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  display: inline-block;
}
.search-input {
  padding-left: 2.5rem;
  width: 20rem;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  pointer-events: none;
}
.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
}
:deep(.p-datatable) {
  width: 100%;
}
</style>
