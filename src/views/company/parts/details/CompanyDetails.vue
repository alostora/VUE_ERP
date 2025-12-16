<template>
  <div class="table-page">
    <div class="table-wrapper">
      <div class="company-details">
        <!-- Cover Image -->
        <div class="cover-image-section mb-4">
          <img
            v-if="company.cover"
            :src="company.cover.file_path"
            :alt="company.name"
            class="cover-image"
          />
          <div v-else class="cover-placeholder">
            <i class="pi pi-image text-6xl text-color-secondary"></i>
            <p class="text-color-secondary mt-2">
              {{ $t("companies.noCoverImage") }}
            </p>
          </div>
        </div>

        <!-- Main Details Card -->
        <Card>
          <template #title>
            <div class="flex align-items-center gap-3">
              <img
                v-if="company.logo"
                :src="company.logo.file_path"
                :alt="company.name"
                class="company-logo-large"
              />
              <div>
                <h2 class="m-0">{{ company.name }}</h2>
                <p class="m-0 text-color-secondary">{{ company.name_ar }}</p>
              </div>
            </div>
          </template>
          <template #content>
            <div class="grid">
              <!-- Contact Information -->
              <div class="col-12 md:col-6">
                <h4 class="mb-3">{{ $t("companies.contactInfo") }}</h4>
                <div class="space-y-3">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-phone text-primary"></i>
                    <span>{{
                      company.phone || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-envelope text-primary"></i>
                    <span>{{
                      company.email || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-start gap-2">
                    <i class="pi pi-map-marker text-primary mt-1"></i>
                    <span>{{
                      company.address || $t("companies.notProvided")
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div class="col-12 md:col-6">
                <h4 class="mb-3">{{ $t("companies.locationInfo") }}</h4>
                <div class="space-y-3">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-globe text-primary"></i>
                    <span>{{
                      company.country?.name || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-building text-primary"></i>
                    <span>{{
                      company.governorate?.name || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-home text-primary"></i>
                    <span>{{
                      company.city?.name || $t("companies.notProvided")
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Social Media -->
              <div class="col-12 md:col-6 mt-4">
                <h4 class="mb-3">{{ $t("companies.socialMedia") }}</h4>
                <div class="space-y-3">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-external-link text-primary"></i>
                    <span>{{
                      company.website_url || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-facebook text-primary"></i>
                    <span>{{
                      company.facebook_url || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-twitter text-primary"></i>
                    <span>{{
                      company.twitter_url || $t("companies.notProvided")
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Business Information -->
              <div class="col-12 md:col-6 mt-4">
                <h4 class="mb-3">{{ $t("companies.businessInfo") }}</h4>
                <div class="space-y-3">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-money-bill text-primary"></i>
                    <span>{{
                      company.currency?.name || $t("companies.notProvided")
                    }}</span>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-user text-primary"></i>
                    <span>{{
                      company.client?.name || $t("companies.notProvided")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";

export default {
  name: "CompanyDetails",
  components: {
    Card,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.company-details {
  max-width: 100%;
}

.cover-image-section {
  border-radius: 12px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.cover-placeholder {
  height: 200px;
  background: var(--surface-ground);
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.company-logo-large {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid var(--surface-border);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

:deep(.p-card-title) {
  display: flex;
  align-items: center;
}
</style>
