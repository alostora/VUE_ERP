<template>
  <div class="discount-branches-create-form">
    <Message v-if="error" severity="error" class="mb-3">{{ error }}</Message>

    <Message severity="info" class="mb-4" v-if="availableBranches.length > 0">
      {{ $t('discounts.availableBranches') || $t('discounts.branches') }}: {{ availableBranches.length }}
    </Message>

    <Message severity="warn" class="mb-4" v-else-if="!loadingBranches">
      {{ $t('discounts.noBranches') }}
    </Message>

    <form @submit.prevent="submitForm">
      <div class="field">
        <label class="font-bold block mb-2">{{ $t('discounts.selectBranches') }} *</label>
        <MultiSelect
          v-model="selectedBranches"
          :options="availableBranches"
          option-label="name"
          option-value="id"
          :class="{ 'p-invalid': errors.branch_ids }"
          :placeholder="loadingBranches ? $t('discounts.loadingBranches') : $t('discounts.branchesPlaceholder')"
          class="w-full"
          :loading="loadingBranches"
          :disabled="loadingBranches || availableBranches.length === 0"
          display="chip"
          :maxSelectedLabels="3"
          :filter="true"
        />
        <small class="p-error" v-if="errors.branch_ids">{{ errors.branch_ids }}</small>
      </div>

      <div v-if="selectedBranches.length > 0" class="selected-branches-preview mt-3">
        <label class="font-medium block mb-2">{{ $t('discounts.selectedProducts') }}:</label>
        <div class="selected-chips">
          <Chip v-for="b in getSelectedBranchesDetails()" :key="b.id" :label="b.name" class="mr-2 mb-2">
            <span class="ml-2 text-xs text-color-secondary">({{ b.name_ar }})</span>
          </Chip>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button type="button" :label="$t('common.cancel')" @click="$emit('cancel')" class="p-button-text" :disabled="loading" />
        <Button type="submit" :label="$t('common.create')" :loading="loading" class="p-button-primary" :disabled="!canSubmit" />
      </div>
    </form>
  </div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Chip from 'primevue/chip';
import general_request from '../../../../views/layouts/constants/general_request';

export default {
  name: 'DiscountBranchesCreateForm',
  components: { MultiSelect, Button, Message, Chip },
  props: {
    discount_id: { type: String, required: true },
    company_id: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      loadingBranches: false,
      error: '',
      availableBranches: [],
      selectedBranches: [],
      errors: {},
    };
  },
  computed: {
    canSubmit() { return this.selectedBranches.length > 0; }
  },
  mounted() { this.loadAvailableBranches(); },
  methods: {
    getSelectedBranchesDetails() {
      return this.selectedBranches.map(id => this.availableBranches.find(b => b.id === id) || { id, name: this.$t('discounts.branchName'), name_ar: this.$t('discounts.branchName') });
    },

    async loadAvailableBranches() {
      this.loadingBranches = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/branches/list/${this.company_id}?discount_id=${this.discount_id}`;
        const response = await this.$http.get(url, { headers: general_request.headers });
        this.availableBranches = response.data.data || [];
      } catch (err) {
        this.error = this.$t('discounts.loadingBranchesError') || this.$t('discounts.loadingBranches');
      } finally {
        this.loadingBranches = false;
      }
    },

    validateForm() {
      this.errors = {};
      if (this.selectedBranches.length === 0) {
        this.errors.branch_ids = this.$t('discounts.productsRequired') || 'At least one branch is required';
        return false;
      }
      return true;
    },

    async submitForm() {
      if (!this.validateForm()) return;
      this.loading = true; this.error = '';
      try {
        const payload = { company_id: this.company_id, discount_id: this.discount_id, branch_ids: this.selectedBranches };
        const url = `${general_request.BASE_URL}/admin/company/discount-branch`;
        const response = await this.$http.post(url, payload, { headers: general_request.headers });
        this.resetForm();
        this.$emit('branches-added', response.data.data || []);
        this.showToast('success', this.$t('common.success'), this.$t('discounts.branchDeleted') ? this.$t('discounts.branchDeleted') : this.$t('discounts.branches'));
      } catch (err) {
        this.handleSaveError(err);
      } finally { this.loading = false; }
    },

    resetForm() { this.selectedBranches = []; this.errors = {}; this.error = ''; },

    handleSaveError(error) {
      this.errors = {}; this.error = '';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.status_code === 400) { this.error = data.message || JSON.stringify(data.errors || data); }
        else if (data.status_code === 422) { this.errors = this.formatFieldErrors(data.errors || {}); }
        else { this.error = data.message || this.$t('discounts.createError'); }
      } else { this.error = error.message || this.$t('discounts.networkError'); }
    },

    formatFieldErrors(errorsObject) {
      const res = {};
      Object.keys(errorsObject).forEach(k => { const v = errorsObject[k]; res[k] = Array.isArray(v) ? v[0] : v; });
      return res;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) this.$toast.add({ severity, summary, detail, life: 3000 });
    },
  }
};
</script>

<style scoped>
.discount-branches-create-form { max-width: 100%; }
.field { margin-bottom: 1.5rem; }
.selected-branches-preview { border: 1px solid var(--surface-border); border-radius: 6px; padding: 1rem; background: var(--surface-ground); }
.selected-chips { display:flex; flex-wrap:wrap; gap:0.5rem; }
</style>
