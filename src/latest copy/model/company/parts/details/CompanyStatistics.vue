<template>
  <div class="company-statistics">
    <h4 class="mb-4">{{ $t("companies.companyStatistics") }}</h4>

    <div class="grid">
      <!-- Total Categories -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-primary">
                  {{ statistics.totalCategories }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalCategories") }}
                </div>
              </div>
              <i class="pi pi-folder text-3xl text-primary"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Products -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-green-500">
                  {{ statistics.totalProducts }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalProducts") }}
                </div>
              </div>
              <i class="pi pi-shopping-bag text-3xl text-green-500"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Branches -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-blue-500">
                  {{ statistics.totalBranches }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalBranches") }}
                </div>
              </div>
              <i class="pi pi-map-marker text-3xl text-blue-500"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Total Employees -->
      <div class="col-6 md:col-3">
        <Card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-2xl font-bold text-orange-500">
                  {{ statistics.totalEmployees }}
                </div>
                <div class="text-color-secondary">
                  {{ $t("companies.totalEmployees") }}
                </div>
              </div>
              <i class="pi pi-users text-3xl text-orange-500"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Additional Stats -->
    <div class="grid mt-3">
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-chart-line text-4xl text-purple-500 mb-2"></i>
              <div class="text-xl font-bold">$12,450</div>
              <div class="text-color-secondary">Monthly Revenue</div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-shopping-cart text-4xl text-cyan-500 mb-2"></i>
              <div class="text-xl font-bold">245</div>
              <div class="text-color-secondary">Monthly Orders</div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div class="text-center">
              <i class="pi pi-star text-4xl text-yellow-500 mb-2"></i>
              <div class="text-xl font-bold">4.8</div>
              <div class="text-color-secondary">Customer Rating</div>
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
  name: "CompanyStatistics",
  components: {
    Card,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statistics: {
        totalCategories: 12,
        totalProducts: 156,
        totalBranches: 3,
        totalEmployees: 24,
      },
    };
  },
};
</script>

<style scoped>
.stat-card {
  height: 100%;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

.company-statistics h4 {
  color: var(--text-color);
  font-weight: 600;
}
</style>
