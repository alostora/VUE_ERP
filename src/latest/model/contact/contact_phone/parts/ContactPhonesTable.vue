<template>
  <div class="contact-phones p-3">
    <div class="mb-3 flex justify-content-between align-items-center">
      <h3 class="m-0">{{ $t("contacts.phones") }}</h3>
      <Button
        :label="$t('contacts.addPhone')"
        icon="pi pi-plus"
        @click="openCreateModal"
        class="p-button-sm p-button-primary"
      />
    </div>

    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :loading="loading"
      :lazy="true"
    >
      <Column field="phone" :header="$t('contacts.phone')" />
      <Column field="is_default" :header="$t('contacts.isDefault')">
        <template #body="slotProps">{{
          slotProps.data.is_default ? $t("common.yes") : $t("common.no")
        }}</template>
      </Column>
      <Column :header="$t('contacts.actions')">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-danger"
            @click="deletePhone(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-phone text-4xl text-color-secondary mb-3"></i>
      <div class="text-color-secondary">{{ $t("contacts.noPhones") }}</div>
    </div>

    <ContactPhoneCreateModal
      ref="createModal"
      :contact_id="contact_id"
      @created="handleCreated"
    />
    <Toast />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ContactPhoneCreateModal from "./ContactPhoneCreateModal.vue";
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

export default {
  name: "ContactPhonesTable",
  components: {
    DataTable,
    Column,
    Button,
    Toast,
    ContactPhoneCreateModal,
  },
  mixins: [useTable(), useCrud()],
  props: {
    company_id: { type: String, required: true },
    contact_id: { type: String, required: true },
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/contact-phones/search/${this.contact_id}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/contact-phone`;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    openCreateModal() {
      this.$refs.createModal.openModal();
    },
    handleCreated() {
      this.getData();
    },
    deletePhone(phone) {
      this.deleteItem(
        phone,
        this.propMainUrl,
        this.$t("contacts.phoneDeleted"),
        this.$t("contacts.deleteError")
      );
    },
  },
};
</script>

<style scoped>
.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 8px;
}
</style>
