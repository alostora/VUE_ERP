<template>
  <div class="pos-customer-selector">
    <!-- Customer Search & Select -->
    <div class="customer-search">
      <AutoComplete
        v-model="searchQuery"
        :suggestions="filteredCustomers"
        :placeholder="$t('pos.searchCustomer')"
        field="name"
        :dropdown="true"
        @complete="searchCustomers"
        @item-select="selectCustomer"
        class="w-full mb-2"
      >
        <template #item="slotProps">
          <div class="customer-option">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-user"></i>
              <div>
                <div class="font-bold">{{ slotProps.item.name }}</div>
                <div class="text-sm text-color-secondary">
                  {{ slotProps.item.phone }} • {{ slotProps.item.email }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </AutoComplete>

      <!-- Selected Customer Display -->
      <div
        v-if="selectedCustomer"
        class="selected-customer p-3 surface-100 border-round mb-3"
      >
        <div class="flex justify-content-between align-items-center">
          <div>
            <h5 class="m-0 mb-1">{{ selectedCustomer.name }}</h5>
            <p class="m-0 text-sm text-color-secondary">
              <i class="pi pi-phone mr-1"></i>{{ selectedCustomer.phone }}
              <span v-if="selectedCustomer.email"> • </span>
              <i v-if="selectedCustomer.email" class="pi pi-envelope mr-1"></i
              >{{ selectedCustomer.email }}
            </p>
            <p
              v-if="selectedCustomer.address"
              class="m-0 text-sm text-color-secondary mt-1"
            >
              <i class="pi pi-map-marker mr-1"></i
              >{{ selectedCustomer.address }}
            </p>
          </div>
          <Button
            icon="pi pi-times"
            @click="clearCustomer"
            class="p-button-text p-button-danger"
          />
        </div>
      </div>

      <!-- Quick Create Customer -->
      <div v-if="!selectedCustomer" class="quick-create mt-2">
        <Button
          :label="$t('pos.createNewCustomer')"
          icon="pi pi-user-plus"
          @click="showCreateModal = true"
          class="p-button-outlined p-button-sm w-full"
        />
      </div>
    </div>

    <!-- Create Customer Modal -->
    <Dialog
      v-model:visible="showCreateModal"
      :header="$t('pos.createNewCustomer')"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="create-customer-form">
        <div class="grid">
          <div class="col-12 field">
            <label class="block font-bold mb-2"
              >{{ $t("pos.customerName") }} *</label
            >
            <InputText
              v-model="newCustomer.name"
              :placeholder="$t('pos.enterCustomerName')"
              class="w-full"
              :class="{ 'p-invalid': errors.name }"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="col-12 md:col-6 field">
            <label class="block font-bold mb-2">{{ $t("pos.phone") }} *</label>
            <InputText
              v-model="newCustomer.phone"
              :placeholder="$t('pos.enterPhone')"
              class="w-full"
              :class="{ 'p-invalid': errors.phone }"
            />
            <small v-if="errors.phone" class="p-error">{{
              errors.phone
            }}</small>
          </div>

          <div class="col-12 md:col-6 field">
            <label class="block font-bold mb-2">{{ $t("pos.email") }}</label>
            <InputText
              v-model="newCustomer.email"
              :placeholder="$t('pos.enterEmail')"
              type="email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
            />
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>

          <div class="col-12 field">
            <label class="block font-bold mb-2">{{ $t("pos.address") }}</label>
            <Textarea
              v-model="newCustomer.address"
              :placeholder="$t('pos.enterAddress')"
              rows="2"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          :label="$t('common.cancel')"
          @click="showCreateModal = false"
          class="p-button-text"
        />
        <Button
          :label="$t('common.create')"
          @click="createCustomer"
          class="p-button-primary"
          :loading="creatingCustomer"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import AutoComplete from "primevue/autocomplete";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
  name: "PosCustomerSelector",
  components: {
    AutoComplete,
    InputText,
    Textarea,
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
      searchQuery: "",
      filteredCustomers: [],
      customers: [],

      // Create Customer
      showCreateModal: false,
      newCustomer: {
        name: "",
        phone: "",
        email: "",
        address: "",
      },
      errors: {},
      creatingCustomer: false,
    };
  },
  created() {
    this.loadCustomers();
  },
  methods: {
    async loadCustomers() {
      try {
        // TODO: Replace with real API
        this.customers = [
          {
            id: "cust1",
            name: "John Doe",
            phone: "0123456789",
            email: "john@example.com",
            address: "123 Main St",
          },
          {
            id: "cust2",
            name: "Jane Smith",
            phone: "0987654321",
            email: "jane@example.com",
            address: "456 Oak Ave",
          },
          {
            id: "cust3",
            name: "Bob Johnson",
            phone: "0555555555",
            email: "bob@example.com",
            address: "789 Pine Rd",
          },
        ];
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    },

    searchCustomers(event) {
      const query = event.query.toLowerCase();
      this.filteredCustomers = this.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.email?.toLowerCase().includes(query)
      );
    },

    selectCustomer(event) {
      this.$emit("select-customer", event.value);
      this.searchQuery = "";
    },

    clearCustomer() {
      this.$emit("select-customer", null);
    },

    validateCustomer() {
      this.errors = {};

      if (!this.newCustomer.name.trim()) {
        this.errors.name = this.$t("pos.customerNameRequired");
      }

      if (!this.newCustomer.phone.trim()) {
        this.errors.phone = this.$t("pos.phoneRequired");
      }

      if (
        this.newCustomer.email &&
        !this.isValidEmail(this.newCustomer.email)
      ) {
        this.errors.email = this.$t("pos.invalidEmail");
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    async createCustomer() {
      if (!this.validateCustomer()) {
        return;
      }

      this.creatingCustomer = true;

      try {
        // Emit the new customer data to parent
        this.$emit("create-customer", { ...this.newCustomer });

        // Close modal and reset form
        this.showCreateModal = false;
        this.resetNewCustomerForm();

        this.$toast.add({
          severity: "success",
          summary: this.$t("pos.customerCreated"),
          detail: this.$t("pos.newCustomerAddedSuccessfully"),
          life: 3000,
        });
      } catch (error) {
        console.error("Error creating customer:", error);
        this.$toast.add({
          severity: "error",
          summary: this.$t("pos.createError"),
          detail: error.message || this.$t("pos.failedToCreateCustomer"),
          life: 3000,
        });
      } finally {
        this.creatingCustomer = false;
      }
    },

    resetNewCustomerForm() {
      this.newCustomer = {
        name: "",
        phone: "",
        email: "",
        address: "",
      };
      this.errors = {};
    },
  },
};
</script>

<style scoped>
.pos-customer-selector {
  width: 100%;
}

.customer-option {
  padding: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.customer-option:last-child {
  border-bottom: none;
}

.customer-option:hover {
  background: #f8f9fa;
}

.selected-customer {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #bbdefb;
}

.create-customer-form .field {
  margin-bottom: 1rem;
}

:deep(.p-autocomplete) {
  width: 100%;
}

:deep(.p-autocomplete-input) {
  width: 100%;
}
</style>
