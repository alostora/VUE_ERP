<template>
  <Dialog
    :header="$t('companies.updateCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <div class="form">
      <Message v-if="error" severity="error" class="mb-3">
        {{ error }}
      </Message>

      <form @submit.prevent="submitForm">
        <div class="field mb-3">
          <label for="country" class="font-bold block mb-2">
            {{ $t("companies.country") }} *
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            @update:modelValue="onCountryChange"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.country_id }"
            :placeholder="
              loadingItems
                ? $t('companies.loadingCountries')
                : $t('companies.selectCountry')
            "
            class="w-full"
            :loading="loadingItems"
            :disabled="loadingItems"
            :showClear="false"
          />
          <small v-if="errors.country_id" class="p-error">
            {{ errors.country_id }}
          </small>
        </div>

        <div class="field mb-3">
          <label for="governorate" class="font-bold block mb-2">
            {{ $t("companies.governorate") }} *
          </label>
          <Select
            id="governorate"
            v-model="selectedGovernorate"
            @update:modelValue="onGovernorateChange"
            :options="governorates"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.governorate_id }"
            :placeholder="
              loadingItems
                ? $t('companies.loadingGovernorates')
                : $t('companies.selectGovernorate')
            "
            class="w-full"
            :loading="loadingItems"
            :disabled="loadingItems || !selectedCountry"
            :showClear="false"
          />
          <small v-if="errors.governorate_id" class="p-error">
            {{ errors.governorate_id }}
          </small>
        </div>

        <div class="field mb-3">
          <label for="city" class="font-bold block mb-2">
            {{ $t("companies.city") }} *
          </label>
          <Select
            id="city"
            v-model="selectedCity"
            @update:modelValue="onCityChange"
            :options="cities"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.city_id }"
            :placeholder="
              loadingItems
                ? $t('companies.loadingCities')
                : $t('companies.selectCity')
            "
            class="w-full"
            :loading="loadingItems"
            :disabled="loadingItems || !selectedGovernorate"
            :showClear="false"
          />
          <small v-if="errors.city_id" class="p-error">
            {{ errors.city_id }}
          </small>
        </div>

        <div class="field mb-3">
          <label for="currency" class="font-bold block mb-2">
            {{ $t("companies.currency") }} *
          </label>
          <Select
            id="currency"
            v-model="selectedCurrency"
            @update:modelValue="onCurrencyChange"
            :options="currencies"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.currency_id }"
            :placeholder="
              loadingItems
                ? $t('companies.loadingCurrencies')
                : $t('companies.selectCurrency')
            "
            class="w-full"
            :loading="loadingItems"
            :disabled="loadingItems"
            :showClear="false"
          />
          <small v-if="errors.currency_id" class="p-error">
            {{ errors.currency_id }}
          </small>
        </div>

        <div class="field mb-3">
          <label for="name" class="font-bold block mb-2">
            {{ $t("companies.name") }} *
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            :class="{ 'p-invalid': errors.name }"
            class="w-full"
            :placeholder="$t('companies.namePlaceholder')"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field mb-3">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("companies.name_ar") }} *
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
            class="w-full"
            :placeholder="$t('companies.nameArPlaceholder')"
          />
          <small v-if="errors.name_ar" class="p-error">{{
            errors.name_ar
          }}</small>
        </div>

        <div class="field mb-4">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("companies.phone") }}
          </label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            class="w-full"
            :placeholder="$t('companies.phonePlaceholder')"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <div class="field mb-4">
          <label for="email" class="font-bold block mb-2">
            {{ $t("companies.email") }}
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            :placeholder="$t('companies.emailPlaceholder')"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="field mb-4">
          <label for="address" class="font-bold block mb-2">
            {{ $t("companies.address") }}
          </label>
          <InputText
            id="address"
            v-model="formData.address"
            :class="{ 'p-invalid': errors.address }"
            class="w-full"
            :placeholder="$t('companies.addressPlaceholder')"
          />
          <small v-if="errors.address" class="p-error">{{
            errors.address
          }}</small>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 field">
            <label for="logo" class="font-bold block mb-2">
              {{ $t("companies.logo") }}
            </label>

            <div v-if="this.logoPath" class="current-file-preview mb-3">
              <label class="p-text-secondary text-sm block mb-2"
                >Current Logo:</label
              >
              <img
                :src="this.logoPath"
                :alt="formData.name"
                class="file-preview-image"
              />
            </div>

            <FileUpload
              mode="basic"
              :chooseLabel="$t('companies.chooseFile')"
              class="w-full"
              :maxFileSize="1000000"
              accept="image/*"
              @select="(event) => onFileSelect(event, 'logoFile')"
            />

            <div v-if="logoFile" class="new-file-preview mt-2">
              <label class="p-text-secondary text-sm block mb-2"
                >New Logo Preview:</label
              >
              <img
                :src="getFilePreview(logoFile)"
                alt="New Logo Preview"
                class="file-preview-image"
              />
            </div>

            <small v-else class="p-text-secondary">
              {{ $t("companies.noFileChosen") }}
            </small>
          </div>

          <div class="col-12 md:col-6 field">
            <label for="cover" class="font-bold block mb-2">
              {{ $t("companies.cover") }}
            </label>

            <div v-if="this.coverPath" class="current-file-preview mb-3">
              <label class="p-text-secondary text-sm block mb-2"
                >Current Cover:</label
              >
              <img
                :src="this.coverPath"
                :alt="formData.name"
                class="file-preview-image"
              />
            </div>

            <FileUpload
              mode="basic"
              :chooseLabel="$t('companies.chooseFile')"
              class="w-full"
              :maxFileSize="1000000"
              accept="image/*"
              @select="(event) => onFileSelect(event, 'coverFile')"
            />
            <div v-if="coverFile" class="new-file-preview mt-2">
              <label class="p-text-secondary text-sm block mb-2"
                >New Cover Preview:</label
              >
              <img
                :src="getFilePreview(coverFile)"
                alt="New Cover Preview"
                class="file-preview-image"
              />
            </div>

            <small v-else class="p-text-secondary">
              {{ $t("companies.noFileChosen") }}
            </small>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="$t('common.cancel')"
            @click="closeModal"
            class="p-button-text"
            :disabled="loading"
          />
          <Button
            type="submit"
            :label="$t('common.update')"
            :loading="loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("common.updating") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";

import { useTable } from "@/utils/useTable";
import { useCrud } from "@/utils/useCrud";
import moduleUrl from "@/constants/moduleUrl";
import useSelectionItems from "@/utils/useSelectionItems";
import validationRequest from "../validation/validationRequest";

export default {
  name: "UpdateForm",
  components: {
    Dialog,
    ProgressSpinner,
    InputText,
    Button,
    Message,
    Select,
    FileUpload,
  },

  mixins: [useTable(), useCrud(), validationRequest, useSelectionItems],

  props: {
    selected_item: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    selected_item: {
      immediate: true,
      deep: true,
      handler(selectedItem) {
        if (selectedItem && selectedItem.id) {
          this.populateForm(selectedItem);
        } else {
          this.resetForm();
        }
      },
    },
  },

  data() {
    return {
      propMainUrl: moduleUrl.URLS.COMPANY.propMainUrl,
      countries: [],
      governorates: [],
      cities: [],
      currencies: [],
      selectedCountry: null,
      selectedGovernorate: null,
      selectedCity: null,
      selectedCurrency: null,
      logoFile: null,
      logoPath: null,
      coverFile: null,
      coverPath: null,
      formData: {
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        logo_id: "",
        cover_id: "",
      },
    };
  },

  mounted() {
    this.loadCountries();
    this.loadCurrencies();
  },
  methods: {
    async populateForm(selectedItem) {
      // Set form data
      this.formData = {
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        name_ar: selectedItem.name_ar || "",
        phone: selectedItem.phone || "",
        email: selectedItem.email || "",
        address: selectedItem.address || "",
        country_id: selectedItem.country?.id || "",
        governorate_id: selectedItem.governorate?.id || "",
        city_id: selectedItem.city?.id || "",
        currency_id: selectedItem.currency?.id || "",
        logo_id: selectedItem.logo?.id || "",
        cover_id: selectedItem.cover?.id || "",
      };

      this.logoPath = selectedItem.logo?.file_path || null;
      this.coverPath = selectedItem.cover?.file_path || null;
      this.selectedCountry = selectedItem.country?.id || null;
      this.selectedCurrency = selectedItem.currency?.id || null;

      if (selectedItem.country?.id) {
        await this.loadGovernorates(selectedItem.country.id);

        this.$nextTick(() => {
          this.selectedGovernorate = selectedItem.governorate?.id || null;

          if (selectedItem.governorate?.id) {
            this.loadCities(selectedItem.governorate.id).then(() => {
              this.$nextTick(() => {
                this.selectedCity = selectedItem.city?.id || null;
              });
            });
          }
        });
      }
    },

    async submitForm() {
      if (!this.validateUpdateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      // Upload files if they exist
      if (this.logoFile) {
        const logoId = await this.uploadFile(this.logoFile);
        if (logoId) {
          this.formData.logo_id = logoId;
        }
      }

      if (this.coverFile) {
        const coverId = await this.uploadFile(this.coverFile);
        if (coverId) {
          this.formData.cover_id = coverId;
        }
      }

      const url = this.propMainUrl;
      await this.updateItem(this.formData.id, this.formData, url);

      this.closeModal();
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.file-preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.current-file-preview,
.new-file-preview {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 0.5rem;
  background: var(--surface-ground);
}

.current-file-preview label,
.new-file-preview label {
  font-weight: 500;
  color: var(--text-color);
}
</style>
