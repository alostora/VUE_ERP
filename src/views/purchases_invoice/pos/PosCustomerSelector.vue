<template>
  <div class="pos-customer-selector">
    <!-- Customer Selector -->
    <div class="customer-selector mb-3">
      <label class="block font-bold text-sm mb-2">
        <i class="pi pi-user mr-1"></i>
        {{ $t("pos.customer") }}
      </label>

      <Select
        v-model="selectedCustomerModel"
        :options="customers"
        optionLabel="name"
        :placeholder="$t('pos.selectCustomer')"
        :filter="true"
        filterPlaceholder="Search..."
        :showClear="true"
        @change="onCustomerChange"
        @clear="clearCustomer"
        class="w-full"
        :loading="loadingCustomers"
      >
        <template #option="slotProps">
          <div class="flex align-items-center gap-2 p-2">
            <i class="pi pi-user text-primary"></i>
            <div>
              <div class="font-bold">{{ slotProps.option.name }}</div>
              <div class="text-xs text-color-secondary">
                {{ slotProps.option.phone }}
                <span v-if="slotProps.option.email">
                  • {{ slotProps.option.email }}</span
                >
              </div>
            </div>
          </div>
        </template>

        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <div>
              <div class="font-bold">{{ slotProps.value.name }}</div>
              <div class="text-xs text-color-secondary">
                {{ slotProps.value.phone }}
              </div>
            </div>
          </div>
        </template>
      </Select>

      <!-- Create Customer Button -->
      <Button
        :label="$t('pos.createNewCustomer')"
        icon="pi pi-user-plus"
        @click="showCreateModal = true"
        class="p-button-outlined p-button-primary w-full mt-2"
        :disabled="!companyId"
      />
    </div>

    <!-- Create Customer Modal -->
    <Dialog
      v-model:visible="showCreateModal"
      :header="$t('pos.createNewCustomer')"
      :modal="true"
      :style="{ width: '400px' }"
    >
      <div class="p-fluid">
        <div class="field mb-3">
          <label class="block font-bold mb-2">{{ $t("pos.name") }} *</label>
          <InputText
            v-model="newCustomer.name"
            :placeholder="$t('pos.enterName')"
            class="w-full"
            :class="{ 'p-invalid': errors.name }"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label class="block font-bold mb-2">{{ $t("pos.phone") }} *</label>
          <InputText
            v-model="newCustomer.phone"
            :placeholder="$t('pos.enterPhone')"
            class="w-full"
            :class="{ 'p-invalid': errors.phone }"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <div class="field mb-3">
          <label class="block font-bold mb-2">{{ $t("pos.email") }}</label>
          <InputText
            v-model="newCustomer.email"
            :placeholder="$t('pos.enterEmail')"
            class="w-full"
          />
        </div>

        <div class="field mb-3">
          <label class="block font-bold mb-2">{{ $t("pos.address") }}</label>
          <InputText
            v-model="newCustomer.address"
            :placeholder="$t('pos.enterAddress')"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button
          :label="$t('common.cancel')"
          @click="showCreateModal = false"
          class="p-button-text"
        />
        <Button
          :label="$t('common.save')"
          @click="createCustomer"
          class="p-button-primary"
          :loading="creatingCustomer"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

import PosService from "./PosService.js";

export default {
  name: "PosCustomerSelector",
  components: {
    Select,
    InputText,
    Button,
    Dialog,
  },
  props: {
    companyId: {
      type: String,
      required: true,
    },
    selectedCustomer: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selectedCustomerModel: this.selectedCustomer,
      customers: [],
      showCreateModal: false,
      newCustomer: {
        name: "",
        phone: "",
        email: "",
        address: "",
      },
      errors: {},
      creatingCustomer: false,
      loadingCustomers: false,
      posService: null,
    };
  },
  watch: {
    selectedCustomer(newVal) {
      this.selectedCustomerModel = newVal;
    },
    companyId(newCompanyId) {
      if (newCompanyId) {
        this.loadCustomers();
      }
    },
  },
  mounted() {
    if (this.companyId) {
      this.loadCustomers();
    }
  },
  methods: {
    async loadCustomers() {
      if (!this.companyId) return;

      this.loadingCustomers = true;
      try {
        this.posService = new PosService(this.companyId, null);
        const customersData = await this.posService.getContacts();

        this.customers = customersData.map((customer) => ({
          id: customer.id,
          name: customer.name || "",
          phone: customer.phone || "",
          email: customer.email || "",
          address: customer.address || "",
        }));
      } catch (error) {
        console.error("Error loading customers:", error);
        this.customers = [];
      } finally {
        this.loadingCustomers = false;
      }
    },

    onCustomerChange(event) {
      this.$emit("select-customer", event.value);
    },

    clearCustomer() {
      this.$emit("select-customer", null);
    },

    validateCustomer() {
      this.errors = {};

      if (!this.newCustomer.name.trim()) {
        this.errors.name = this.$t("pos.nameRequired");
      }

      if (!this.newCustomer.phone.trim()) {
        this.errors.phone = this.$t("pos.phoneRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async createCustomer() {
      if (!this.validateCustomer()) return;

      this.creatingCustomer = true;

      try {
        const customerData = {
          company_id: this.companyId,
          name: this.newCustomer.name.trim(),
          phone: this.newCustomer.phone.trim(),
          email: this.newCustomer.email.trim() || "",
          address: this.newCustomer.address.trim() || "",
        };

        const createdCustomer = await this.posService.createContact(
          customerData
        );

        if (createdCustomer) {
          // Add to local list
          this.customers.unshift({
            id: createdCustomer.id,
            name: createdCustomer.name,
            phone: createdCustomer.phone,
            email: createdCustomer.email || "",
            address: createdCustomer.address || "",
          });

          // Select the new customer
          this.$emit("select-customer", createdCustomer);

          // Close modal and reset
          this.showCreateModal = false;
          this.newCustomer = {
            name: "",
            phone: "",
            email: "",
            address: "",
          };
          this.errors = {};
        }
      } catch (error) {
        console.error("Error creating customer:", error);
      } finally {
        this.creatingCustomer = false;
      }
    },
  },
};
</script>

<style scoped>
.pos-customer-selector {
  width: 100%;
}

:deep(.p-select) {
  width: 100%;
}

:deep(.p-select .p-select-label) {
  padding: 0.5rem 0.75rem;
}

:deep(.p-select-items-wrapper) {
  max-height: 200px;
}

.customer-option {
  transition: background-color 0.2s;
}

.customer-option:hover {
  background-color: #f8f9fa;
}
</style>
