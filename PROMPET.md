src\main.js
this is its code

import './assets/main.css'; // Add this import
import { createApp } from 'vue';
import Home from './Home.vue';
import router from './router';
import axios from "axios";
import store from "./store/store";
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';
import i18n from './i18n/index';
import 'primeflex/primeflex.css'

import ConfirmationService from 'primevue/confirmationservice';



const app = createApp(Home);

app.config.globalProperties.$http = axios;

// Initialize theme
const initializeTheme = () => {
     const savedTheme = localStorage.getItem('theme') || 'light';
     if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark-mode');
     } else {
          document.documentElement.classList.add('light-mode');
     }
};

initializeTheme();

app
     .use(router)
     .use(store)
     .use(ToastService)
     .use(i18n)
     .use(PrimeVue, {
          ripple: true,
          unstyled: false,
          inputVariant: "outlined",
          theme: {
               preset: Aura,
               options: {
                    darkModeSelector: '.dark-mode' // This enables PrimeVue's built-in dark mode
               }
          }
     })
     .use(ConfirmationService);

app.mount('#app');
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
src\Home.vue
this is its code

<template>
  <RouterView />
</template>

<script>
export default {
  data() {
    return {
      token: "",
      error_message: "",
    };
  },
  methods: {
    checkIfAuth() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        this.$router.push("/");
      } else {
        this.$router.push("/login");
      }
    },
  },

  beforeCreate() {},

  created() {
    this.checkIfAuth();
  },
};
</script>

_______________________________________________________________________________________
src\latest\views\HomePage.vue
this is its code

<template>
  <div class="layout-wrapper" :class="[currentDirection, currentTheme]">
    <MVVMMainHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
    />
    
    <!-- Overlay للخلفية في الموبايل -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="layout-container">
      <MVVMSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />
      <main
        class="main-content"
        :class="{ 'content-expanded': sidebarCollapsed }"
      >
        <RouterView :company="company" :company_id="company_id" />
        <MVVMFooter />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import MVVMMainHeader from "./layouts/MVVMMainHeader.vue";
import MVVMSidebar from "./layouts/MVVMSidebar.vue";
import MVVMContent from "./layouts/MVVMContent.vue";
import MVVMFooter from "./layouts/MVVMFooter.vue";

export default {
  components: {
    RouterView,
    MVVMMainHeader,
    MVVMSidebar,
    MVVMContent,
    MVVMFooter,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentDirection:
        localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
      currentTheme: localStorage.getItem("theme") || "light",
      isMobile: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    onLanguageChanged(language) {
      this.currentDirection = language.dir;
    },
    onThemeChanged(theme) {
      this.currentTheme = theme;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      // إغلاق السايدبار تلقائياً في الموبايل
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Initialize theme class
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: all 0.3s ease;
  min-height: 100%;
}

/* LTR - Sidebar on left */
.layout-wrapper.ltr .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.ltr .main-content.content-expanded {
  margin-left: 60px;
  width: calc(100% - 60px);
}

/* RTL - Sidebar on right */
.layout-wrapper.rtl .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.rtl .main-content.content-expanded {
  margin-right: 60px;
  width: calc(100% - 60px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout-wrapper.ltr .main-content,
  .layout-wrapper.rtl .main-content {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .layout-wrapper.ltr .main-content.content-expanded,
  .layout-wrapper.rtl .main-content.content-expanded {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  /* Overlay Styles */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
    backdrop-filter: blur(2px);
  }
}
</style>
_______________________________________________________________________________________
src\latest\views\HomePage.vue
this is its code
<template>
  <div class="layout-wrapper" :class="[currentDirection, currentTheme]">
    <MVVMMainHeader
      @toggle-sidebar="toggleSidebar"
      @language-changed="onLanguageChanged"
      @theme-changed="onThemeChanged"
    />
    
    <!-- Overlay للخلفية في الموبايل -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="layout-container">
      <MVVMSidebar
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />
      <main
        class="main-content"
        :class="{ 'content-expanded': sidebarCollapsed }"
      >
        <RouterView :company="company" :company_id="company_id" />
        <MVVMFooter />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import MVVMMainHeader from "./layouts/MVVMMainHeader.vue";
import MVVMSidebar from "./layouts/MVVMSidebar.vue";
import MVVMContent from "./layouts/MVVMContent.vue";
import MVVMFooter from "./layouts/MVVMFooter.vue";

export default {
  components: {
    RouterView,
    MVVMMainHeader,
    MVVMSidebar,
    MVVMContent,
    MVVMFooter,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentDirection:
        localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
      currentTheme: localStorage.getItem("theme") || "light",
      isMobile: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    onLanguageChanged(language) {
      this.currentDirection = language.dir;
    },
    onThemeChanged(theme) {
      this.currentTheme = theme;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      // إغلاق السايدبار تلقائياً في الموبايل
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Initialize theme class
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme + "-mode");
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  transition: all 0.3s ease;
  min-height: 100%;
}

/* LTR - Sidebar on left */
.layout-wrapper.ltr .main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.ltr .main-content.content-expanded {
  margin-left: 60px;
  width: calc(100% - 60px);
}

/* RTL - Sidebar on right */
.layout-wrapper.rtl .main-content {
  margin-right: 280px;
  width: calc(100% - 280px);
}

.layout-wrapper.rtl .main-content.content-expanded {
  margin-right: 60px;
  width: calc(100% - 60px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout-wrapper.ltr .main-content,
  .layout-wrapper.rtl .main-content {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .layout-wrapper.ltr .main-content.content-expanded,
  .layout-wrapper.rtl .main-content.content-expanded {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  /* Overlay Styles */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
    backdrop-filter: blur(2px);
  }
}
</style>
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________

src\latest\views\layouts\MVVMContent.vue
this is its code
<template>
  <div class="modern-content">
    <!-- Welcome Header -->
    <section class="welcome-section">
      <div class="welcome-header">
        <div class="welcome-text">
          <h1 class="welcome-title">
            {{ $t("content.welcome") }}, {{ name }}! 👋
          </h1>
          <p class="welcome-subtitle">{{ $t("content.welcomeMessage") }}</p>
          <div class="welcome-stats">
            <div class="stat-badge">
              <i class="pi pi-check-circle"></i>
              <span>24 Tasks Completed</span>
            </div>
            <div class="stat-badge">
              <i class="pi pi-star"></i>
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>
        <div class="welcome-actions">
          <Button
            label="Quick Report"
            icon="pi pi-download"
            severity="secondary"
            class="modern-btn"
          />
          <Button label="New Project" icon="pi pi-plus" class="modern-btn" />
        </div>
      </div>
    </section>

    <!-- Quick Stats Grid -->
    <section class="stats-section">
      <div class="section-header">
        <h2 class="section-title">{{ $t("content.stats") }}</h2>
        <div class="section-actions">
          <Button icon="pi pi-filter" text v-tooltip="'Filter Stats'" />
          <Button icon="pi pi-refresh" text v-tooltip="'Refresh Data'" />
        </div>
      </div>
      <div class="stats-grid">
        <div
          class="stat-card modern-card"
          v-for="stat in stats"
          :key="stat.title"
          :class="stat.gradient"
        >
          <div class="stat-header">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-trend" :class="stat.trendClass">
              <i :class="stat.trendIcon"></i>
              <span>{{ stat.trend }}</span>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-progress">
              <ProgressBar
                :value="stat.progress"
                :showValue="false"
                :class="stat.progressClass"
              />
              <span class="progress-text">{{ stat.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts & Analytics -->
    <section class="analytics-section">
      <div class="analytics-grid">
        <!-- Revenue Chart -->
        <div class="analytics-card modern-card">
          <div class="card-header">
            <h3 class="card-title">Revenue Analytics</h3>
            <Select
              v-model="selectedPeriod"
              :options="periods"
              optionLabel="label"
              placeholder="This Month"
              class="period-selector"
            />
          </div>
          <div class="chart-placeholder">
            <div class="chart-container">
              <i class="pi pi-chart-line chart-icon"></i>
              <p>Revenue chart visualization</p>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="metrics-card modern-card">
          <div class="card-header">
            <h3 class="card-title">Performance Metrics</h3>
          </div>
          <div class="metrics-grid">
            <div
              class="metric-item"
              v-for="metric in metrics"
              :key="metric.name"
            >
              <div class="metric-info">
                <div class="metric-name">{{ metric.name }}</div>
                <div class="metric-value">{{ metric.value }}</div>
              </div>
              <div class="metric-chart">
                <div class="sparkline"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity & Team -->
    <section class="activity-team-section">
      <div class="two-column-grid">
        <!-- Recent Activity -->
        <div class="activity-card modern-card">
          <div class="card-header">
            <h3 class="card-title">{{ $t("content.recent") }}</h3>
            <Button label="View All" text size="small" />
          </div>
          <div class="activity-list">
            <div
              class="activity-item"
              v-for="activity in activities"
              :key="activity.id"
            >
              <div class="activity-avatar">
                <Avatar
                  :label="activity.user.charAt(0)"
                  :style="{ 'background-color': activity.color }"
                  size="large"
                  shape="circle"
                />
              </div>
              <div class="activity-content">
                <div class="activity-main">
                  <span class="user-name">{{ activity.user }}</span>
                  <span class="activity-text">{{ activity.text }}</span>
                </div>
                <div class="activity-meta">
                  <i class="pi pi-clock"></i>
                  <span class="activity-time">{{ activity.time }}</span>
                  <Badge :value="activity.project" severity="secondary" />
                </div>
              </div>
              <div class="activity-action">
                <Button icon="pi pi-ellipsis-v" text rounded />
              </div>
            </div>
          </div>
        </div>

        <!-- Team Progress -->
        <div class="team-card modern-card">
          <div class="card-header">
            <h3 class="card-title">Team Progress</h3>
            <Button icon="pi pi-plus" text v-tooltip="'Add Team Member'" />
          </div>
          <div class="team-list">
            <div
              class="team-member"
              v-for="member in teamMembers"
              :key="member.name"
            >
              <div class="member-info">
                <Avatar
                  :image="member.avatar"
                  size="large"
                  shape="circle"
                  class="member-avatar"
                />
                <div class="member-details">
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-role">{{ member.role }}</div>
                </div>
              </div>
              <div class="member-progress">
                <ProgressBar
                  :value="member.progress"
                  :showValue="false"
                  class="progress-small"
                />
                <span class="progress-percent">{{ member.progress }}%</span>
              </div>
              <div class="member-status" :class="member.status"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions-section">
      <h3 class="section-title">Quick Actions</h3>
      <div class="actions-grid">
        <div
          class="action-card modern-card"
          v-for="action in quickActions"
          :key="action.label"
          @click="handleAction(action)"
        >
          <div class="action-icon" :class="action.color">
            <i :class="action.icon"></i>
          </div>
          <div class="action-content">
            <div class="action-label">{{ action.label }}</div>
            <div class="action-desc">{{ action.description }}</div>
          </div>
          <i class="pi pi-chevron-right action-arrow"></i>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import Select from "primevue/select";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Tooltip from "primevue/tooltip";

export default {
  directives: {
    tooltip: Tooltip,
  },
  components: {
    Button,
    ProgressBar,
    Select,
    Avatar,
    Badge,
  },
  data() {
    return {
      name: "John",
      selectedPeriod: null,
      periods: [
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
        { label: "This Quarter", value: "quarter" },
        { label: "This Year", value: "year" },
      ],
      stats: [
        {
          title: "Total Revenue",
          value: "$24.5K",
          icon: "pi pi-dollar",
          gradient: "gradient-1",
          trend: "+12%",
          trendIcon: "pi pi-arrow-up",
          trendClass: "positive",
          progress: 75,
          progressClass: "progress-success",
        },
        {
          title: "New Customers",
          value: "1,234",
          icon: "pi pi-users",
          gradient: "gradient-2",
          trend: "+8%",
          trendIcon: "pi pi-arrow-up",
          trendClass: "positive",
          progress: 60,
          progressClass: "progress-info",
        },
        {
          title: "Active Projects",
          value: "24",
          icon: "pi pi-briefcase",
          gradient: "gradient-3",
          trend: "+5",
          trendIcon: "pi pi-plus",
          trendClass: "neutral",
          progress: 85,
          progressClass: "progress-warning",
        },
        {
          title: "Task Completion",
          value: "92%",
          icon: "pi pi-check-circle",
          gradient: "gradient-4",
          trend: "+3%",
          trendIcon: "pi pi-arrow-up",
          trendClass: "positive",
          progress: 92,
          progressClass: "progress-success",
        },
      ],
      metrics: [
        { name: "CPU Usage", value: "65%" },
        { name: "Memory", value: "48%" },
        { name: "Disk Space", value: "72%" },
        { name: "Network", value: "34%" },
      ],
      activities: [
        {
          id: 1,
          user: "Sarah Johnson",
          text: "completed the dashboard design",
          time: "2 hours ago",
          project: "Website",
          color: "#4f46e5",
        },
        {
          id: 2,
          user: "Mike Chen",
          text: "submitted quarterly report",
          time: "4 hours ago",
          project: "Finance",
          color: "#10b981",
        },
        {
          id: 3,
          user: "Emily Davis",
          text: "added new features to mobile app",
          time: "6 hours ago",
          project: "Mobile",
          color: "#f59e0b",
        },
        {
          id: 4,
          user: "Alex Rodriguez",
          text: "fixed critical bugs in API",
          time: "1 day ago",
          project: "Backend",
          color: "#ef4444",
        },
      ],
      teamMembers: [
        {
          name: "Sarah Johnson",
          role: "UI/UX Designer",
          progress: 85,
          status: "online",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        {
          name: "Mike Chen",
          role: "Frontend Developer",
          progress: 92,
          status: "online",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        {
          name: "Emily Davis",
          role: "Backend Developer",
          progress: 78,
          status: "away",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        },
        {
          name: "Alex Rodriguez",
          role: "DevOps Engineer",
          progress: 95,
          status: "offline",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
      ],
      quickActions: [
        {
          label: "Create Project",
          description: "Start a new project",
          icon: "pi pi-plus-circle",
          color: "blue",
        },
        {
          label: "Generate Report",
          description: "Create analytics report",
          icon: "pi pi-chart-bar",
          color: "green",
        },
        {
          label: "Schedule Meeting",
          description: "Plan team meeting",
          icon: "pi pi-calendar",
          color: "purple",
        },
        {
          label: "Upload Files",
          description: "Share documents",
          icon: "pi pi-cloud-upload",
          color: "orange",
        },
      ],
    };
  },
  methods: {
    handleAction(action) {
      this.$toast.add({
        severity: "info",
        summary: action.label,
        detail: `Opening ${action.label}...`,
        life: 2000,
      });
    },
  },
};
</script>

<style scoped>
.modern-content {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 2rem;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.welcome-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--surface-hover);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.stat-badge i {
  color: var(--primary-500);
}

.welcome-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.gradient-1::before {
  background: var(--gradient-primary);
}
.stat-card.gradient-2::before {
  background: var(--gradient-secondary);
}
.stat-card.gradient-3::before {
  background: linear-gradient(135deg, #10b981, #059669);
}
.stat-card.gradient-4::before {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--primary-500);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.stat-trend.positive {
  background: var(--green-50);
  color: var(--green-600);
}

.stat-trend.neutral {
  background: var(--blue-50);
  color: var(--blue-600);
}

.stat-content {
  margin-top: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.stat-title {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-progress :deep(.p-progressbar) {
  flex: 1;
  height: 6px;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

/* Analytics Section */
.analytics-section {
  margin-bottom: 2rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.analytics-card,
.metrics-card {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.period-selector {
  width: 150px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
  border-radius: 12px;
}

.chart-container {
  text-align: center;
  color: var(--text-color-secondary);
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-ground);
  border-radius: 8px;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-name {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.metric-chart {
  width: 60px;
  height: 30px;
}

.sparkline {
  width: 100%;
  height: 100%;
  background: var(--surface-border);
  border-radius: 4px;
}

/* Activity & Team Section */
.activity-team-section {
  margin-bottom: 2rem;
}

.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.activity-card,
.team-card {
  padding: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: var(--surface-hover);
}

.activity-avatar {
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-main {
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  margin-right: 0.5rem;
}

.activity-text {
  color: var(--text-color-secondary);
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.activity-meta i {
  font-size: 0.7rem;
}

.activity-action {
  flex-shrink: 0;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.team-member:hover {
  background: var(--surface-hover);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.member-avatar {
  flex-shrink: 0;
}

.member-details {
  flex: 1;
}

.member-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.member-role {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.member-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 120px;
}

.member-progress :deep(.p-progressbar) {
  flex: 1;
  height: 4px;
}

.progress-percent {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  width: 30px;
  text-align: right;
}

.member-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.member-status.online {
  background: var(--green-500);
}

.member-status.away {
  background: var(--yellow-500);
}

.member-status.offline {
  background: var(--surface-400);
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.action-icon.blue {
  background: var(--primary-500);
}
.action-icon.green {
  background: var(--green-500);
}
.action-icon.purple {
  background: #8b5cf6;
}
.action-icon.orange {
  background: var(--orange-500);
}

.action-content {
  flex: 1;
}

.action-label {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.action-desc {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.action-arrow {
  color: var(--text-color-secondary);
  transition: transform 0.2s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
  color: var(--primary-500);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .two-column-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-content {
    padding: 1rem;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
  }

  .welcome-stats {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 1.75rem;
  }
}

/* Progress Bar Variants */
:deep(.progress-success .p-progressbar-value) {
  background: var(--green-500);
}

:deep(.progress-info .p-progressbar-value) {
  background: var(--blue-500);
}

:deep(.progress-warning .p-progressbar-value) {
  background: var(--orange-500);
}

:deep(.progress-small .p-progressbar) {
  height: 4px;
}
</style>

_______________________________________________________________________________________
src\latest\views\layouts\MVVMFooter.vue
this is its code
<template>
  <footer class="modern-footer">
    <!--  <div class="footer-wave">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          class="shape-fill"
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          class="shape-fill"
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          class="shape-fill"
        ></path>
      </svg>
    </div> -->

    <div class="footer-content">
      <!-- Main Footer -->
      <!-- <div class="footer-main">
        <div class="footer-section company-info">
          <div class="footer-brand">
            <div class="brand-logo">
              <i class="pi pi-shield"></i>
            </div>
            <div class="brand-text">
              <h3 class="brand-title">{{ $t("app.title") }}</h3>
              <p class="brand-tagline">
                Modern Solutions for Modern Businesses
              </p>
            </div>
          </div>
          <p class="company-description">
            We provide cutting-edge ERP solutions that streamline operations,
            boost productivity, and drive growth for businesses of all sizes.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" v-tooltip="'Follow us on Twitter'">
              <i class="pi pi-twitter"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Connect on LinkedIn'">
              <i class="pi pi-linkedin"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Like us on Facebook'">
              <i class="pi pi-facebook"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Watch on YouTube'">
              <i class="pi pi-youtube"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Star on GitHub'">
              <i class="pi pi-github"></i>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Product</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Features
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Pricing
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Case Studies
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Updates
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Download
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Solutions</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Enterprise
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Small Business
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Startups
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Non-profits
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Education
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Resources</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Documentation
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Tutorials
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Blog
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Community
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Support
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Company</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              About Us
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Careers
              <Badge value="3" severity="success" size="small" />
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Contact
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Partners
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Press Kit
            </a>
          </div>
        </div>

        <div class="footer-section newsletter">
          <h4 class="section-title">Stay Updated</h4>
          <p class="newsletter-text">
            Get the latest news and updates delivered to your inbox.
          </p>
          <div class="newsletter-form">
            <InputText
              placeholder="Enter your email"
              class="newsletter-input"
            />
            <Button
              icon="pi pi-send"
              class="newsletter-btn"
              severity="primary"
            />
          </div>
          <p class="newsletter-note">No spam, unsubscribe at any time.</p>
        </div>
      </div> -->

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright-section">
            <div class="copyright">
              <strong
                >{{ $t("footer.copyright") }} &copy; 2024
                {{ $t("app.title") }}</strong
              >
              <span class="separator">•</span>
              <span>{{ $t("footer.rights") }}</span>
            </div>
            <div class="version-info">
              <i class="pi pi-code"></i>
              <span class="version-text"
                >{{ $t("footer.version") }} 2.4.18</span
              >
              <Badge value="Latest" severity="success" size="small" />
            </div>
          </div>

          <div class="legal-links">
            <a href="#" class="legal-link">Privacy Policy</a>
            <a href="#" class="legal-link">Terms of Service</a>
            <a href="#" class="legal-link">Cookie Policy</a>
            <a href="#" class="legal-link">Security</a>
            <a href="#" class="legal-link">GDPR</a>
          </div>

          <div class="footer-actions">
            <Button
              icon="pi pi-question-circle"
              text
              v-tooltip="'Help Center'"
            />
            <Button icon="pi pi-comments" text v-tooltip="'Live Chat'" />
            <Button icon="pi pi-flag" text v-tooltip="'Report Issue'" />
            <Button
              :icon="currentTheme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
              text
              @click="toggleTheme"
              v-tooltip="currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Badge from "primevue/badge";
import Tooltip from "primevue/tooltip";

export default {
  directives: {
    tooltip: Tooltip,
  },
  components: {
    Button,
    InputText,
    Badge,
  },
  data() {
    return {
      currentTheme: localStorage.getItem("theme") || "light",
    };
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", this.currentTheme);
      this.$emit("theme-changed", this.currentTheme);
    },
  },
};
</script>

<style scoped>
.modern-footer {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
  position: relative;
}

.footer-wave {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.footer-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.footer-wave .shape-fill {
  fill: var(--surface-card);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 1.5rem 1.5rem;
  position: relative;
  z-index: 1;
}

/* Main Footer */
.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-section.company-info {
  padding-right: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.brand-logo {
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.company-description {
  color: var(--text-color-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--surface-ground);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  position: relative;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-500);
  border-radius: 1px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.footer-link i {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-500);
  transform: translateX(5px);
}

.footer-link:hover i {
  transform: translateX(2px);
}

/* Newsletter */
.newsletter {
  background: var(--surface-ground);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
}

.newsletter-text {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.newsletter-input {
  flex: 1;
}

.newsletter-btn {
  flex-shrink: 0;
}

.newsletter-note {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  opacity: 0.7;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid var(--surface-border);
  padding-top: 1.5rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.copyright-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.separator {
  opacity: 0.5;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.version-info i {
  font-size: 0.7rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  color: var(--text-color-secondary);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--primary-500);
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-main {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }

  .newsletter {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 3rem 1rem 1rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section.company-info {
    padding-right: 0;
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }

  .newsletter {
    grid-column: span 1;
    text-align: center;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-wave svg {
    height: 40px;
  }
}

/* Dark mode enhancements */
.dark-mode .footer-wave .shape-fill {
  fill: var(--surface-900);
}

.dark-mode .newsletter {
  background: var(--surface-800);
}

.dark-mode .social-link {
  background: var(--surface-700);
}

/* Animation for newsletter */
.newsletter-form :deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px var(--primary-100);
}

/* Hover effects */
.footer-section:not(.company-info):not(.newsletter) .footer-links {
  padding-left: 0.5rem;
}

/* Badge animations */
:deep(.p-badge) {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

_______________________________________________________________________________________


src\latest\views\layouts\MVVMMainHeader.vue
this is its code
<template>
  <header class="main-header">
    <Menubar :model="translatedMenuItems">
      <template #start>
        <div class="header-start">
          <Button
            icon="pi pi-bars"
            @click="$emit('toggle-sidebar')"
            text
            rounded
          />
          <span class="app-title">{{ $t("app.title") }}</span>
        </div>
      </template>

      <template #end>
        <div class="header-end">
          <div class="search-container">
            <InputText :placeholder="$t('header.search')" type="text" />
            <Button icon="pi pi-search" text />
          </div>

          <div class="action-buttons">
            <Button
              @click="toggleTheme"
              :icon="currentTheme.icon"
              :severity="currentTheme.severity"
              text
              rounded
              :title="currentTheme.title"
            />

            <Button
              @click="toggleLanguage"
              :icon="currentLanguage.icon"
              text
              rounded
              :title="currentLanguage.label"
            />

            <div class="user-menu-container">
              <Menu ref="userMenu" :model="logoutMenuItem" :popup="true" />

              <Button
                icon="pi pi-user"
                rounded
                text
                severity="secondary"
                class="p-button-lg"
                @click="toggleUserMenu"
              />
            </div>
          </div>
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

export default {
  components: {
    Menubar,
    Button,
    InputText,
    Avatar,
    Menu,
  },
  emits: ["toggle-sidebar", "language-changed", "theme-changed"],
  data() {
    return {
      currentLang: this.$i18n.locale,
      currentTheme:
        localStorage.getItem("theme") === "dark"
          ? {
              mode: "dark",
              icon: "pi pi-moon",
              severity: "secondary",
              title: "Switch to Light Mode",
            }
          : {
              mode: "light",
              icon: "pi pi-sun",
              severity: "warning",
              title: "Switch to Dark Mode",
            },
      languages: [
        { code: "en", label: "English", icon: "pi pi-globe", dir: "ltr" },
        { code: "ar", label: "العربية", icon: "pi pi-globe", dir: "rtl" },
      ],
      menuItems: [
        { label: "menu.home", icon: "pi pi-home" },
        { label: "menu.users", icon: "pi pi-folder" },
        { label: "menu.settings", icon: "pi pi-cog" },
      ],
      logoutMenuItem: [
        {
          label: this.$t("header.logout") || "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            this.logout();
          },
        },
      ],
    };
  },
  computed: {
    currentLanguage() {
      return (
        this.languages.find((lang) => lang.code === this.currentLang) ||
        this.languages[0]
      );
    },
    translatedMenuItems() {
      return this.menuItems.map((item) => ({
        ...item,
        label: this.$t(item.label),
      }));
    },
  },
  methods: {
    toggleUserMenu(event) {
      this.$refs.userMenu.toggle(event);
    },

    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      
      this.$toast.add({
        severity: "info",
        summary: "Logged Out",
        detail: "You have been successfully signed out.",
        life: 3000,
      });

      this.$router.push("/login"); 
    },

    toggleLanguage() {
      this.currentLang = this.currentLang === "en" ? "ar" : "en";
      const newLang = this.currentLanguage;

      this.$i18n.locale = newLang.code;
      localStorage.setItem("language", newLang.code);
      document.documentElement.dir = newLang.dir;
      document.documentElement.lang = newLang.code;

      this.$forceUpdate();
      this.$emit("language-changed", newLang);
    },

    toggleTheme() {
      const newTheme = this.currentTheme.mode === "light" ? "dark" : "light";

      this.currentTheme =
        newTheme === "dark"
          ? {
              mode: "dark",
              icon: "pi pi-moon",
              severity: "secondary",
              title: "Switch to Light Mode",
            }
          : {
              mode: "light",
              icon: "pi pi-sun",
              severity: "warning",
              title: "Switch to Dark Mode",
            };

      localStorage.setItem("theme", newTheme);
      this.applyTheme(newTheme);
      this.$emit("theme-changed", newTheme);
    },

    applyTheme(theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem("theme") || "light";
      this.applyTheme(savedTheme);
    },

    isMobile() {
      return window.innerWidth <= 768;
    },
  },
  mounted() {
    const langConfig = this.currentLanguage;
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = this.currentLang;

    if (this.isMobile()) {
      this.$emit("toggle-sidebar");
    }

    this.initializeTheme();
  },
};
</script>

<style scoped>
.main-header {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.header-end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-container {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Allow search to take space on desktop */
}

.action-buttons {
  /* Group theme, language, and user menu buttons */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-menu-container {
  /* This ensures the Menu component anchors correctly relative to the button */
  position: relative;
}

/* Adjust Avatar button size for better clickability */
.user-menu-container .p-button-lg {
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.p-menubar) {
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  background: transparent;
}

/* Theme transition for smooth mode switching */
:deep(*) {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* --- 📱 Mobile View Adjustments (Maximum Width 768px) --- */
@media (max-width: 768px) {
    
    /* 1. Hide the Search Input Text to save space */
    .search-container :deep(.p-inputtext) {
        display: none;
    }

    /* 2. Remove the search container's ability to grow */
    .search-container {
        flex-grow: 0; 
        /* Add some padding next to the search icon */
        padding-left: 0.5rem; 
        padding-right: 0.5rem;
    }
    
    /* 3. Ensure the main header elements don't wrap and fit */
    .header-start, .header-end {
        flex-shrink: 0;
    }
}
</style>
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________

src\latest\views\layouts\MVVMSidebar.vue
<template>
  <aside
    class="modern-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
  >
    <div class="sidebar-content">
      <!-- Header مع زر الإغلاق -->
      <div class="sidebar-header" v-if="!collapsed">
        <div class="sidebar-brand">
          <i class="pi pi-shield brand-icon"></i>
          <span class="brand-text">ERP System</span>
        </div>

        <!-- زر الإغلاق - يظهر فقط في الموبايل وعندما السايدبار مفتوح -->
        <Button
          v-if="isMobile && !collapsed"
          icon="pi pi-times"
          @click="$emit('toggle')"
          text
          rounded
          class="close-btn"
          v-tooltip="'Close'"
        />
      </div>

      <nav class="sidebar-nav">
        <div v-for="item in items" :key="item.label" class="nav-item-wrapper">
          <router-link
            v-if="item.route"
            v-slot="{ isActive }"
            :to="item.route"
            custom
          >
            <div
              class="nav-item"
              :class="{ active: isActive, collapsed: collapsed }"
              @click="handleNavigation(item.route)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ $t(item.label) }}</span>
              <div class="active-indicator" v-if="isActive && !collapsed"></div>
            </div>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer" v-if="!collapsed && !isMobile">
        <div class="user-section">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="large"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">John Doe</div>
            <div class="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import Avatar from "primevue/avatar";
import Button from "primevue/button";

export default {
  components: {
    Avatar,
    Button,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "ltr",
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle"],
  data() {
    return {
      items: [
        { label: "menu.home", icon: "pi pi-home", route: "/" },
        { label: "menu.users", icon: "pi pi-users", route: "/users" },
        { label: "menu.countries", icon: "pi pi-flag", route: "/countries" },
        {
          label: "menu.governorates",
          icon: "pi pi-map",
          route: "/governorates",
        },
        { label: "menu.cities", icon: "pi pi-building", route: "/cities" },

        {
          label: "menu.companies",
          icon: "pi pi-briefcase",
          route: "/companies",
        },
      ],
    };
  },
  methods: {
    handleNavigation(route) {
      this.$router.push(route);
      // Auto-close sidebar on mobile after navigation
      if (this.isMobile) {
        this.$emit("toggle");
      }
    },
  },
};
</script>

<style scoped>
/* Base Styles (Desktop) */
.modern-sidebar {
  width: 280px;
  height: calc(100vh - 60px);
  background: var(--surface-card);
  position: fixed;
  top: 60px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 900;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* RTL Adjustments for Desktop */
.modern-sidebar.rtl {
  right: 0;
  left: unset;
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  background: var(--surface-card);
  position: relative;
  z-index: 1101;
}

/* --- Mobile Styles (max-width: 768px) --- */
@media (max-width: 768px) {
  .modern-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 1100;
    box-shadow: none;
    transform: translateX(-100%);
  }

  .modern-sidebar.rtl {
    transform: translateX(100%);
  }

  /* Expanded LTR: Show sidebar */
  .modern-sidebar:not(.collapsed):not(.rtl) {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  /* Expanded RTL: Show sidebar */
  .modern-sidebar:not(.collapsed).rtl {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  /* Force collapsed state to remain hidden */
  .modern-sidebar.collapsed:not(.rtl) {
    transform: translateX(-100%);
  }
  .modern-sidebar.collapsed.rtl {
    transform: translateX(100%);
  }

  .close-btn {
    display: block !important;
    color: var(--text-color-secondary);
  }

  .close-btn:hover {
    color: var(--text-color);
    background: var(--surface-hover);
  }

  .sidebar-header {
    padding: 1rem 1.5rem;
  }

  .sidebar-nav {
    padding: 0 1rem;
  }

  .nav-item {
    padding: 1rem;
    margin: 0.25rem 0;
  }

  .sidebar-footer {
    display: none;
  }
}

/* --- Desktop Collapsed State (min-width: 769px) --- */
@media (min-width: 769px) {
  .modern-sidebar.collapsed {
    width: 70px;
  }

  .modern-sidebar.collapsed .nav-item {
    padding: 0.75rem;
    justify-content: center;
  }

  .modern-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .modern-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .modern-sidebar.collapsed .active-indicator {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
}

/* --- Common Navigation & Footer Styles --- */

/* Sidebar Header */
.sidebar-header {
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  color: var(--primary-500);
  font-size: 1.5rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
}

.close-btn {
  display: none;
}

/* باقي الـ styles نفسها بدون تغيير */
/* ... Navigation, Footer, etc. ... */

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: var(--text-color-secondary);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--surface-hover);
  color: var(--text-color);
  transform: translateX(4px);
}

.rtl .nav-item:hover {
  transform: translateX(-4px);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 500;
}

.dark-mode .nav-item.active {
  background: var(--primary-900);
  color: var(--primary-300);
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.rtl .nav-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

.nav-label {
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 1;
}

.active-indicator {
  position: absolute;
  right: 0.5rem;
  width: 4px;
  height: 20px;
  background: var(--primary-500);
  border-radius: 2px;
}

.rtl .active-indicator {
  right: auto;
  left: 0.5rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Smooth animations for all elements */
.modern-sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

_______________________________________________________________________________________
src\latest\views\layouts\constants\general_request.js

const general_request = {
  BASE_URL: import.meta.env.VITE_HOST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export default general_request;


_______________________________________________________________________________________
src\latest\views\layouts\constants\composables\useCrud.js
import general_request from "../general_request";

export function useCrud() {
     return {
          data() {
               return {
                    selectedItem: null
               }
          },

          methods: {
               async deleteItem(item, baseUrl, successMessage, errorMessage) {
                    this.$confirm.require({
                         message: `Delete ${item.name || item.title || 'this item'}?`,
                         header: 'Confirmation',
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", "Success", successMessage);
                              } catch (error) {
                                   console.error("Error deleting item:", error);
                                   this.showToast("error", "Error", errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", "Success", "Item created successfully");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", "Success", "Item updated successfully");
               }
          }
     }
}
_______________________________________________________________________________________
src\latest\views\layouts\constants\composables\useTable.js

import general_request from "../general_request";

export function useTable() {
     return {
          data() {
               return {
                    tableItems: [],
                    loading: false,
                    meta: { total: 0, current_page: 1 },
                    links: {},
                    per_page: 10,
                    query_string: '',
                    sortField: null,
                    sortOrder: null,
                    selectedItem: null,
                    perPageOptions: [
                         { label: '5', value: 5 },
                         { label: '10', value: 10 },
                         { label: '25', value: 25 },
                         { label: '50', value: 50 },
                         { label: '100', value: 100 }
                    ],
                    searchTimeout: null
               }
          },

          computed: {
               axiosParams() {
                    return {
                         per_page: this.per_page,
                         query_string: this.query_string,
                         page: this.meta.current_page || 1,
                    }
               },
          },

          methods: {
               // Data fetching methods
               async getData(url = this.propSearchUrl) {
                    await this.fetchData(url);
               },

               async fetchData(url, customErrorMessage = null) {
                    this.loading = true;
                    try {
                         const response = await this.$http.get(url, {
                              params: this.axiosParams,
                              headers: general_request.headers,
                         });

                         this.tableItems = response.data.data || [];
                         this.links = response.data.links || {};
                         this.meta = response.data.meta || { total: 0 };
                    } catch (error) {
                         console.error("Error fetching data:", error);
                         const errorMessage = customErrorMessage || this.$t("errors.fetchError");
                         this.showToast("error", this.$t("common.error"), errorMessage);
                    } finally {
                         this.loading = false;
                    }
               },

               // Search and pagination methods
               handleSearchInput() {
                    this.onSearchInput(this.getData);
               },

               onSearchInput(callback) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                         this.meta.current_page = 1;
                         callback();
                    }, 500);
               },

               handlePageChange(event) {
                    this.onPageChange(event, this.getData);
               },

               onPageChange(event, callback) {
                    this.per_page = event.rows;
                    this.meta.current_page = event.page + 1;
                    callback();
               },

               // Sorting method
               onSort(event) {
                    this.sortField = event.sortField;
                    this.sortOrder = event.sortOrder;
               },

               // CRUD operations
               async deleteItem(item, baseUrl, successMessage, customErrorMessage = null) {
                    this.$confirm.require({
                         message: `هل أنت متأكد من حذف ${item.name || item.title || 'هذا العنصر'}؟`,
                         header: this.$t("common.confirmation"),
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", this.$t("common.success"), successMessage);
                              } catch (error) {
                                   console.error("Error deleting item:", error);
                                   const errorMessage = customErrorMessage || this.$t("errors.deleteError");
                                   this.showToast("error", this.$t("common.error"), errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", this.$t("common.success"), "تم الإنشاء بنجاح");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", this.$t("common.success"), "تم التحديث بنجاح");
               },

               // Utility methods
               showToast(severity, summary, detail) {
                    if (this.$toast) {
                         this.$toast.add({
                              severity: severity,
                              summary: summary,
                              detail: detail,
                              life: 3000,
                         });
                    }
               },

               formatDate(dateString) {
                    if (!dateString) return "-";
                    try {
                         return new Date(dateString).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                         });
                    } catch (error) {
                         return dateString;
                    }
               },

               // Navigation helper
               navigateToPage(url, fetchCallback) {
                    if (url && !this.loading) {
                         fetchCallback(url);
                    }
               },

               // Reset form data
               resetFormData() {
                    return {
                         id: "",
                         name: "",
                         name_ar: "",
                         email: "",
                         phone: "",
                         password: "",
                         address: "",
                         user_account_type_id: "",
                         phone_code: "",
                         prefix: "",
                         flag: ""
                    };
               }
          }
     }
}

_______________________________________________________________________________________
src\latest\model\user\routes\user-routes.js

import UserTable from "../parts/UserTable.vue";

const user_routes = [
  {
    // path: "/users/:propSearchUrl/:propMainUrl",
    path: "/users/",
    name: "users",
    component: UserTable,
    props: true,
  }
];

export default user_routes;

_______________________________________________________________________________________
src\latest\model\user\parts\UserCreateForm.vue
<template>
  <div class="user-create-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("users.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
          :placeholder="$t('users.namePlaceholder')"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="field mb-3">
        <label for="email" class="font-bold block mb-2">
          {{ $t("users.email") }} *
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
          :placeholder="$t('users.emailPlaceholder')"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("users.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
          :placeholder="$t('users.phonePlaceholder')"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Account Type Select -->
      <div class="field mb-3">
        <label for="accountType" class="font-bold block mb-2">
          {{ $t("users.accountType") }} *
        </label>
        <Select
          id="accountType"
          v-model="selectedAccountType"
          :options="accountTypes"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.user_account_type_id }"
          :placeholder="
            loadingAccountTypes
              ? $t('users.loadingAccountTypes')
              : $t('users.selectAccountType')
          "
          class="w-full"
          :loading="loadingAccountTypes"
          :disabled="loadingAccountTypes"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }} *
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="true"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
          toggleMask
          :inputStyle="{ width: '100%' }"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- Password Confirmation Field -->
      <div class="field mb-3">
        <label for="password_confirmation" class="font-bold block mb-2">
          {{ $t("users.confirmPassword") }} *
        </label>
        <Password
          id="password_confirmation"
          v-model="formData.password_confirmation"
          :feedback="false"
          :class="{ 'p-invalid': errors.password_confirmation }"
          class="w-full"
          :placeholder="$t('users.confirmPasswordPlaceholder')"
          toggleMask
        />
        <small v-if="errors.password_confirmation" class="p-error">
          {{ errors.password_confirmation }}
        </small>
      </div>

      <!-- Address Field -->
      <div class="field mb-4">
        <label for="address" class="font-bold block mb-2">
          {{ $t("users.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('users.addressPlaceholder')"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>
<script>
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserCreateForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  data() {
    return {
      loading: false,
      loadingAccountTypes: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      },
      errors: {},
    };
  },
  watch: {
    selectedAccountType: {
      handler(newValue) {
        this.formData.user_account_type_id = newValue;
      },
    },
  },
  mounted() {
    this.loadAccountTypes();
  },
  methods: {
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
      this.loadingAccountTypes = true;
      try {
        const response = await this.$http.get(
          general_request.BASE_URL + "/system-lookups/1",
          {
            params: { per_page: 100 },
            headers: general_request.headers,
          }
        );
        this.accountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading account types:", error);
        this.error = this.$t("users.loadAccountTypesError");
      } finally {
        this.loadingAccountTypes = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t("accountTypeRequired");
      }

      if (!this.formData.password) {
        this.errors.password = this.$t("passwordRequired");
      } else if (this.formData.password.length < 6) {
        this.errors.password = this.$t("passwordMinLength");
      }

      if (!this.formData.password_confirmation) {
        this.errors.password_confirmation = this.$t("confirmPasswordRequired");
      } else if (
        this.formData.password !== this.formData.password_confirmation
      ) {
        this.errors.password_confirmation = this.$t("passwordsDoNotMatch");
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = `${general_request.BASE_URL}/admin/user`;

        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
          password: this.formData.password,
          password_confirmation: this.formData.password_confirmation,
        };

        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("user-created", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("users.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("users.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("user account type id")) {
          this.errors.user_account_type_id = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        } else if (message.includes("password")) {
          this.errors.password = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.user-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-select) {
  width: 100%;
}
</style>

_______________________________________________________________________________________
src\latest\model\user\parts\UserCreateModal.vue

<template>
  <Dialog
    :header="$t('users.createUser')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- User Create Form -->
    <UserCreateForm @user-created="handleUserCreated" @cancel="closeModal" />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("users.creatingUser") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import UserCreateForm from "./UserCreateForm.vue";

export default {
  name: "UserCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    UserCreateForm,
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
    },

    handleUserCreated(newUser) {
      this.$emit("user-created", newUser);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
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
</style>

_______________________________________________________________________________________
src\latest\model\user\parts\UserEditForm.vue

<template>
  <div class="user-edit-form">
    <!-- Error Message -->
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="field mb-3">
        <label for="name" class="font-bold block mb-2">
          {{ $t("users.name") }} *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="field mb-3">
        <label for="email" class="font-bold block mb-2">
          {{ $t("users.email") }} *
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="field mb-3">
        <label for="phone" class="font-bold block mb-2">
          {{ $t("users.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          class="w-full"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Account Type Select -->
      <div class="field mb-3">
        <label for="accountType" class="font-bold block mb-2">
          {{ $t("users.accountType") }} *
        </label>
        <Select
          id="accountType"
          v-model="selectedAccountType"
          :options="accountTypes"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.user_account_type_id }"
          :placeholder="$t('users.selectAccountType')"
          class="w-full"
        />
        <small v-if="errors.user_account_type_id" class="p-error">
          {{ errors.user_account_type_id }}
        </small>
      </div>

      <!-- Password Field (optional for edit) -->
      <div class="field mb-3">
        <label for="password" class="font-bold block mb-2">
          {{ $t("users.password") }}
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :feedback="false"
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          :placeholder="$t('users.passwordPlaceholder')"
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- Address Field -->
      <div class="field mb-4">
        <label for="address" class="font-bold block mb-2">
          {{ $t("users.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="submitButtonText"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UserEditForm",
  components: {
    InputText,
    Select,
    Password,
    Textarea,
    Button,
    Message,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      accountTypes: [],
      selectedAccountType: null,
      formData: {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      },
      errors: {},
    };
  },
  computed: {
    submitButtonText() {
      return this.formData.id
        ? this.$t("common.update")
        : this.$t("common.create");
    },
    isEditMode() {
      return !!this.formData.id;
    },
  },
  watch: {
    user: {
      immediate: true,
      deep: true,
      handler(newUser) {
        if (newUser && newUser.id) {
          this.populateForm(newUser);
        } else {
          this.resetForm();
        }
      },
    },
    selectedAccountType: {
      handler(newValue) {
        this.formData.user_account_type_id = newValue;
      },
    },
  },
  mounted() {
    this.loadAccountTypes();
  },
  methods: {
    populateForm(user) {
      this.formData = {
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Never pre-fill password
        address: user.address || "",
        user_account_type_id: user.account_type?.id || "",
      };

      // Set the selected account type ID directly
      this.selectedAccountType = user.account_type?.id || null;
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        user_account_type_id: "",
      };
      this.selectedAccountType = null;
      this.errors = {};
      this.error = "";
    },

    async loadAccountTypes() {
      try {
        const response = await this.$http.get(
          general_request.BASE_URL + "/system-lookups/1",
          {
            params: { per_page: 100 },
            headers: general_request.headers,
          }
        );
        this.accountTypes = response.data.data || [];
      } catch (error) {
        console.error("Error loading account types:", error);
        this.error = this.$t("users.loadAccountTypesError");
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = this.$t("validation.nameRequired");
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = this.$t("validation.emailRequired");
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = this.$t("validation.emailInvalid");
      }

      if (!this.formData.user_account_type_id) {
        this.errors.user_account_type_id = this.$t(
          "validation.accountTypeRequired"
        );
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const url = this.isEditMode
          ? `${general_request.BASE_URL}/admin/user/${this.formData.id}`
          : `${general_request.BASE_URL}/admin/user`;

        const method = this.isEditMode ? "patch" : "post";

        // Prepare payload - only include password if provided
        const payload = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          address: this.formData.address,
          user_account_type_id: this.formData.user_account_type_id,
        };

        // Only include password if provided (for updates)
        if (this.formData.password) {
          payload.password = this.formData.password;
        }

        console.log("Updating user with payload:", payload);

        const response = await this.$http[method](url, payload, {
          headers: general_request.headers,
        });

        console.log("User updated successfully:", response.data);
        this.$emit("user-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("users.success"),
          this.$t("users.userUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      // Clear previous errors
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        // Handle different error response formats
        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      // Handle 400 Bad Request errors
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");

          // Map common error messages to specific fields
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      // Fallback to main message
      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      // Handle 422 Validation errors (Laravel standard)
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);

        // Also show the first error as a general message
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      if (responseData.message) {
        this.error = responseData.message;
      } else {
        this.error = this.$t("users.updateError");
      }
    },

    handleNetworkError(error) {
      if (error.message) {
        this.error = error.message;
      } else {
        this.error = this.$t("users.networkError");
      }
    },

    mapCommonErrorsToFields(errorMessages) {
      // Map common error messages to specific form fields
      errorMessages.forEach((message) => {
        if (message.includes("user account type id")) {
          this.errors.user_account_type_id = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        } else if (message.includes("password")) {
          this.errors.password = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        }
        // Add more mappings as needed
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};

      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];

        if (Array.isArray(fieldErrors)) {
          // Take the first error message for each field
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });

      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.user-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

:deep(.p-password input) {
  width: 100%;
}
</style>

_______________________________________________________________________________________
src\latest\model\user\parts\UserEditModal.vue
<template>
  <Dialog
    :header="headerText"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <!-- User Edit Form -->
    <UserEditForm
      :user="user"
      @user-updated="handleUserUpdated"
      @cancel="closeModal"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import UserEditForm from "./UserEditForm.vue";

export default {
  name: "UserEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    UserEditForm,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  computed: {
    headerText() {
      return this.user?.id
        ? this.$t("users.editUser")
        : this.$t("users.createUser");
    },
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleUserUpdated(updatedUser) {
      this.$emit("user-updated", updatedUser);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>

_______________________________________________________________________________________
src\latest\model\user\parts\UserTable.vue

<template>
  <!-- نفس الـ template تماماً بدون تغيير -->
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("users.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('users.addUser')"
        icon="pi pi-plus"
        @click="createUser"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('users.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <Select
        v-model="per_page"
        :options="perPageOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('users.show')"
        @change="getData(propSearchUrl)"
        class="w-10rem"
      />
    </div>

    <!-- Data Table -->
    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      :loading="loading"
      :lazy="true"
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- كل الأعمدة بنفس الطريقة -->
      <!-- ID Column -->
      <Column field="id" :header="$t('users.id')" style="min-width: 200px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('users.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <!-- Email Column -->
      <Column
        field="email"
        :header="$t('users.email')"
        sortable
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.email }}</span>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('users.createdAt')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Status Column -->
      <Column
        field="account_type"
        :header="$t('users.accountType')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          {{
            $i18n.locale === "ar"
              ? slotProps.data.account_type?.name_ar
              : slotProps.data.account_type?.name
          }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('users.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editUserModal(slotProps.data)"
              v-tooltip.top="$t('users.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('users.delete')"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm p-button-success"
              @click="viewUserDetails(slotProps.data)"
              v-tooltip.top="$t('users.viewDetails')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <UserEditModal
      ref="userEditModal"
      :user="selectedItem"
      @user-updated="handleUserUpdated"
    />

    <UserCreateModal ref="userCreateModal" @user-created="handleUserCreated" />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
/* نفس الـ styles */
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

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>

<script>
// Import PrimeVue components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

// Import your custom components
import UserCreateModal from "./UserCreateModal.vue";
import UserEditModal from "./UserEditModal.vue";

// Import composables 
// From: src/latest/model/country/parts/CountryTable.vue
// Import composables
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";

// Import utilities
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "UsersPage",

  components: {
    UserCreateModal,
    UserEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    ProgressSpinner,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      // API URLs
      propSearchUrl: general_request.BASE_URL + "/admin/users/search",
      propMainUrl: general_request.BASE_URL + "/admin/user",
    };
  },

  mounted() {
    console.log("Users component mounted");
    this.getData();
  },

  methods: {
    /**
     * Open create user modal
     */
    createUser() {
      this.$refs.userCreateModal.openModal();
    },

    /**
     * Handle user created event
     */
    handleUserCreated(newUser) {
      this.handleItemCreated(newUser);
    },

    /**
     * Open edit user modal
     */
    editUserModal(user) {
      this.selectedItem = { ...user };
      this.$nextTick(() => {
        this.$refs.userEditModal.openModal();
      });
    },

    /**
     * Handle user updated event
     */
    handleUserUpdated(updatedUser) {
      this.handleItemUpdated(updatedUser);
    },

    /**
     * Delete user
     */
    deleteRow(user) {
      this.deleteItem(
        user,
        this.propMainUrl,
        this.$t("users.userDeleted"),
        this.$t("users.deleteError")
      );
    },

    /**
     * View user details
     */
    viewUserDetails(user) {
      console.log("View user details:", user);
      this.showToast(
        "info",
        "User Details",
        `Viewing details for ${user.name}`
      );
    },
  },
};
</script>


_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________













the models like user is [city,country,governorate,] this models look like user
structure no diffrance only columns names no thing els
_______________________________________________________________________________________

_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
now in company littel diffrance and its has many other models
like[category,final_product,measurement_unit,product,variant]
lets see company model
and one or two children
_______________________________________________________________________________________
src\latest\model\company\routes\company-routes.js
this is its code


import CompanyTable from "../parts/CompanyTable.vue";
import CompanyShow from "../parts/CompanyShow.vue";
import category_routes from "../../category/routes/category_routes";
import measurement_unit_routes from "../../measurement_unit/routes/measurement_unit_routes";
import variant_routes from "../../variant/routes/variant_routes";
import product_routes from "../../product/routes/product_routes";
import final_product_routes from "../../final_product/routes/final_product_routes";
import CompanyDetails from "../parts/CompanyDetails.vue";

const company_routes = [
     {
          path: "/companies",
          name: "companies",
          component: CompanyTable,
          props: true,
     },
     {
          path: "/company/:company_id/show",
          name: "company-show",
          component: CompanyShow,
          props: (route) => ({
               company_id: route.params.company_id
          }),
          redirect: { name: 'company-details' },
          children: [
               {
                    path: "/company/:company_id/details",
                    name: "company-details",
                    component: CompanyDetails,
                    props: (route) => ({
                         company_id: route.params.company_id
                    }),
               },
               ...category_routes,
               ...measurement_unit_routes,
               ...variant_routes,
               ...product_routes,
               ...final_product_routes,
          ],
     }
];

export default company_routes;
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________




src\latest\model\company\parts\CompanyCreateForm.vue

this is its code

<template>
  <div class="company-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information Section -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
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

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
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

        <!-- Phone -->
        <div class="col-12 md:col-6 field">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("companies.phone") }} *
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

        <!-- Email -->
        <div class="col-12 md:col-6 field">
          <label for="email" class="font-bold block mb-2">
            {{ $t("companies.email") }} *
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
      </div>

      <!-- Client Selection -->
      <div class="field mb-3">
        <label for="client" class="font-bold block mb-2">
          {{ $t("companies.client") }} *
        </label>
        <Select
          id="client"
          v-model="selectedClient"
          :options="clients"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.client_id }"
          :placeholder="
            loadingClients
              ? $t('companies.loadingClients')
              : $t('companies.selectClient')
          "
          class="w-full"
          :loading="loadingClients"
          :disabled="loadingClients"
          filter
        />
        <small v-if="errors.client_id" class="p-error">
          {{ errors.client_id }}
        </small>
      </div>

      <!-- Location Section -->
      <div class="grid">
        <!-- Country -->
        <div class="col-12 md:col-4 field">
          <label for="country" class="font-bold block mb-2">
            {{ $t("companies.country") }}
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCountries
                ? $t('companies.loadingCountries')
                : $t('companies.selectCountry')
            "
            class="w-full"
            :loading="loadingCountries"
            :disabled="loadingCountries"
            @change="onCountryChange"
          />
        </div>

        <!-- Governorate -->
        <div class="col-12 md:col-4 field">
          <label for="governorate" class="font-bold block mb-2">
            {{ $t("companies.governorate") }}
          </label>
          <Select
            id="governorate"
            v-model="selectedGovernorate"
            :options="filteredGovernorates"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingGovernorates
                ? $t('companies.loadingGovernorates')
                : $t('companies.selectGovernorate')
            "
            class="w-full"
            :loading="loadingGovernorates"
            :disabled="loadingGovernorates || !selectedCountry"
            @change="onGovernorateChange"
          />
        </div>

        <!-- City -->
        <div class="col-12 md:col-4 field">
          <label for="city" class="font-bold block mb-2">
            {{ $t("companies.city") }}
          </label>
          <Select
            id="city"
            v-model="selectedCity"
            :options="filteredCities"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCities
                ? $t('companies.loadingCities')
                : $t('companies.selectCity')
            "
            class="w-full"
            :loading="loadingCities"
            :disabled="loadingCities || !selectedGovernorate"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="field mb-3">
        <label for="address" class="font-bold block mb-2">
          {{ $t("companies.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('companies.addressPlaceholder')"
        />
      </div>

      <!-- Currency -->
      <div class="field mb-3">
        <label for="currency" class="font-bold block mb-2">
          {{ $t("companies.currency") }} *
        </label>
        <Select
          id="currency"
          v-model="selectedCurrency"
          :options="currencies"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.currency_id }"
          :placeholder="
            loadingCurrencies
              ? $t('companies.loadingCurrencies')
              : $t('companies.selectCurrency')
          "
          class="w-full"
          :loading="loadingCurrencies"
          :disabled="loadingCurrencies"
        />
        <small v-if="errors.currency_id" class="p-error">
          {{ errors.currency_id }}
        </small>
      </div>

      <!-- Social Media Section -->
      <div class="grid">
        <div class="col-12 md:col-4 field">
          <label for="website_url" class="font-bold block mb-2">
            Website URL
          </label>
          <InputText
            id="website_url"
            v-model="formData.website_url"
            class="w-full"
            :placeholder="$t('companies.websiteUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="facebook_url" class="font-bold block mb-2">
            Facebook URL
          </label>
          <InputText
            id="facebook_url"
            v-model="formData.facebook_url"
            class="w-full"
            :placeholder="$t('companies.facebookUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="twitter_url" class="font-bold block mb-2">
            Twitter URL
          </label>
          <InputText
            id="twitter_url"
            v-model="formData.twitter_url"
            class="w-full"
            :placeholder="$t('companies.twitterUrlPlaceholder')"
          />
        </div>
      </div>

      <!-- Coordinates Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="longitude" class="font-bold block mb-2">
            Longitude
          </label>
          <InputText
            id="longitude"
            v-model="formData.longitude"
            class="w-full"
            :placeholder="$t('companies.longitudePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="latitude" class="font-bold block mb-2"> Latitude </label>
          <InputText
            id="latitude"
            v-model="formData.latitude"
            class="w-full"
            :placeholder="$t('companies.latitudePlaceholder')"
          />
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="logo" class="font-bold block mb-2">
            {{ $t("companies.logo") }}
          </label>
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onLogoSelect"
          />
          <small v-if="logoFile" class="p-text-secondary">
            {{ logoFile.name }}
          </small>
          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>

        <div class="col-12 md:col-6 field">
          <label for="cover" class="font-bold block mb-2">
            {{ $t("companies.cover") }}
          </label>
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onCoverSelect"
          />
          <small v-if="coverFile" class="p-text-secondary">
            {{ coverFile.name }}
          </small>
          <small v-else class="p-text-secondary">
            {{ $t("companies.noFileChosen") }}
          </small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyCreateForm",
  components: {
    InputText,
    Textarea,
    Select,
    FileUpload,
    Button,
    Message,
  },
  data() {
    return {
      loading: false,
      loadingClients: false,
      loadingCountries: false,
      loadingGovernorates: false,
      loadingCities: false,
      loadingCurrencies: false,
      error: "",
      clients: [],
      countries: [],
      governorates: [],
      cities: [],
      currencies: [],
      selectedClient: null,
      selectedCountry: null,
      selectedGovernorate: null,
      selectedCity: null,
      selectedCurrency: null,
      logoFile: null,
      coverFile: null,
      formData: {
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      },
      errors: {},
    };
  },
  computed: {
    filteredGovernorates() {
      if (!this.selectedCountry) return [];
      return this.governorates.filter(
        (g) => g.country_id === this.selectedCountry
      );
    },
    filteredCities() {
      if (!this.selectedGovernorate) return [];
      return this.cities.filter(
        (c) => c.governorate_id === this.selectedGovernorate
      );
    },
  },
  watch: {
    selectedClient: {
      handler(newValue) {
        this.formData.client_id = newValue;
      },
    },
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
        this.selectedGovernorate = null;
        this.selectedCity = null;
        this.formData.governorate_id = "";
        this.formData.city_id = "";
      },
    },
    selectedGovernorate: {
      handler(newValue) {
        this.formData.governorate_id = newValue;
        this.selectedCity = null;
        this.formData.city_id = "";
      },
    },
    selectedCity: {
      handler(newValue) {
        this.formData.city_id = newValue;
      },
    },
    selectedCurrency: {
      handler(newValue) {
        this.formData.currency_id = newValue;
      },
    },
  },
  mounted() {
    this.loadClients();
    this.loadCountries();
    this.loadGovernorates();
    this.loadCities();
    this.loadCurrencies();
  },
  methods: {
    onCountryChange() {
      this.selectedGovernorate = null;
      this.selectedCity = null;
    },

    onGovernorateChange() {
      this.selectedCity = null;
    },

    onLogoSelect(event) {
      this.logoFile = event.files[0];
    },

    onCoverSelect(event) {
      this.coverFile = event.files[0];
    },

    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$http.post(
          `${general_request.BASE_URL}/storage/file`,
          formData,
          {
            headers: {
              ...general_request.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.data.id;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },

    resetForm() {
      this.formData = {
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      };
      this.selectedClient = null;
      this.selectedCountry = null;
      this.selectedGovernorate = null;
      this.selectedCity = null;
      this.selectedCurrency = null;
      this.logoFile = null;
      this.coverFile = null;
      this.errors = {};
      this.error = "";
    },

    async loadClients() {
      this.loadingClients = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/clients?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.clients = response.data.data || [];
      } catch (error) {
        console.error("Error loading clients:", error);
        this.error = this.$t("companies.loadClientsError");
      } finally {
        this.loadingClients = false;
      }
    },

    async loadCountries() {
      this.loadingCountries = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.countries = response.data.data || [];
      } catch (error) {
        console.error("Error loading countries:", error);
        this.error = this.$t("companies.loadCountriesError");
      } finally {
        this.loadingCountries = false;
      }
    },

    async loadGovernorates() {
      this.loadingGovernorates = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorates-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.governorates = response.data.data || [];
      } catch (error) {
        console.error("Error loading governorates:", error);
        this.error = this.$t("companies.loadGovernoratesError");
      } finally {
        this.loadingGovernorates = false;
      }
    },

    async loadCities() {
      this.loadingCities = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/cities-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.cities = response.data.data || [];
      } catch (error) {
        console.error("Error loading cities:", error);
        this.error = this.$t("companies.loadCitiesError");
      } finally {
        this.loadingCities = false;
      }
    },

    async loadCurrencies() {
      this.loadingCurrencies = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/7`,
          {
            headers: general_request.headers,
          }
        );
        this.currencies = response.data.data || [];
      } catch (error) {
        console.error("Error loading currencies:", error);
        this.error = this.$t("companies.loadCurrenciesError");
      } finally {
        this.loadingCurrencies = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = "Company name is required";
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = "Arabic company name is required";
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = "Phone number is required";
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = "Email is required";
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      if (!this.formData.client_id) {
        this.errors.client_id = "Client is required";
      }

      if (!this.formData.currency_id) {
        this.errors.currency_id = "Currency is required";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Upload files first and get IDs
        let logoId = null;
        let coverId = null;

        if (this.logoFile) {
          logoId = await this.uploadFile(this.logoFile);
        }

        if (this.coverFile) {
          coverId = await this.uploadFile(this.coverFile);
        }

        // Prepare company payload
        const payload = {
          client_id: this.formData.client_id,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          phone: this.formData.phone,
          email: this.formData.email,
          address: this.formData.address,
          longitude: this.formData.longitude,
          latitude: this.formData.latitude,
          website_url: this.formData.website_url,
          facebook_url: this.formData.facebook_url,
          twitter_url: this.formData.twitter_url,
          country_id: this.formData.country_id,
          governorate_id: this.formData.governorate_id,
          city_id: this.formData.city_id,
          currency_id: this.formData.currency_id,
        };

        // Add file IDs if they exist
        if (logoId) {
          payload.logo_id = logoId;
        }

        if (coverId) {
          payload.cover_id = coverId;
        }

        console.log("🚀 Creating company with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("company-created", response.data.data);

        this.showToast(
          "success",
          this.$t("companies.success"),
          this.$t("companies.companyCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("companies.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("companies.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("client") || message.includes("client_id")) {
          this.errors.client_id = message;
        } else if (
          message.includes("currency") ||
          message.includes("currency_id")
        ) {
          this.errors.currency_id = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("phone")) {
          this.errors.phone = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.company-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}
</style>

_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________


src\latest\model\company\parts\CompanyCreateModal.vue

this is its code

<template>
  <Dialog
    :header="$t('companies.createCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyCreateForm
      @company-created="handleCompanyCreated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyCreateForm from "./CompanyCreateForm.vue";

export default {
  name: "CompanyCreateModal",
  components: {
    Dialog,
    CompanyCreateForm,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCompanyCreated(newCompany) {
      this.$emit("company-created", newCompany);
      this.closeModal();
    },
  },
};
</script>

_______________________________________________________________________________________
src\latest\model\company\parts\CompanyDetails.vue

this is its code

<template>
  <div class="company-show-wrapper">
    <CompanyStatistics :company="company" />
    <Divider />
    <CompanyDetails :company="company" />
  </div>
</template>

<script>
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";
import Divider from "primevue/divider";
import CompanyDetails from "../parts/details/CompanyDetails.vue";


import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyShow",
  components: {
    Divider,
    CompanyDetails,
    CompanyStatistics,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      company: {},
      loading: false,
    };
  },
  mounted() {
    this.fetchCompany();
  },

  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}
</style>


_______________________________________________________________________________________
src\latest\model\company\parts\CompanyEditForm.vue

this is its code

<template>
  <div class="company-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information Section -->
      <div class="grid">
        <!-- Name -->
        <div class="col-12 md:col-6 field">
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

        <!-- Arabic Name -->
        <div class="col-12 md:col-6 field">
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

        <!-- Phone -->
        <div class="col-12 md:col-6 field">
          <label for="phone" class="font-bold block mb-2">
            {{ $t("companies.phone") }} *
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

        <!-- Email -->
        <div class="col-12 md:col-6 field">
          <label for="email" class="font-bold block mb-2">
            {{ $t("companies.email") }} *
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
      </div>

      <!-- Client (Read-only) -->
      <div class="field mb-3">
        <label class="font-bold block mb-2">
          {{ $t("companies.client") }}
        </label>
        <div
          class="p-inputtext p-component w-full"
          style="background: #f8f9fa; color: #6c757d"
        >
          {{ clientName }}
        </div>
        <small class="p-text-secondary">
          Client cannot be changed when editing
        </small>
      </div>

      <!-- Location Section -->
      <div class="grid">
        <!-- Country -->
        <div class="col-12 md:col-4 field">
          <label for="country" class="font-bold block mb-2">
            {{ $t("companies.country") }}
          </label>
          <Select
            id="country"
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCountries
                ? $t('companies.loadingCountries')
                : $t('companies.selectCountry')
            "
            class="w-full"
            :loading="loadingCountries"
            :disabled="loadingCountries"
            @change="onCountryChange"
          />
        </div>

        <!-- Governorate -->
        <div class="col-12 md:col-4 field">
          <label for="governorate" class="font-bold block mb-2">
            {{ $t("companies.governorate") }}
          </label>
          <Select
            id="governorate"
            v-model="selectedGovernorate"
            :options="filteredGovernorates"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingGovernorates
                ? $t('companies.loadingGovernorates')
                : $t('companies.selectGovernorate')
            "
            class="w-full"
            :loading="loadingGovernorates"
            :disabled="loadingGovernorates || !selectedCountry"
            @change="onGovernorateChange"
          />
        </div>

        <!-- City -->
        <div class="col-12 md:col-4 field">
          <label for="city" class="font-bold block mb-2">
            {{ $t("companies.city") }}
          </label>
          <Select
            id="city"
            v-model="selectedCity"
            :options="filteredCities"
            optionLabel="name"
            optionValue="id"
            :placeholder="
              loadingCities
                ? $t('companies.loadingCities')
                : $t('companies.selectCity')
            "
            class="w-full"
            :loading="loadingCities"
            :disabled="loadingCities || !selectedGovernorate"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="field mb-3">
        <label for="address" class="font-bold block mb-2">
          {{ $t("companies.address") }}
        </label>
        <Textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full"
          :placeholder="$t('companies.addressPlaceholder')"
        />
      </div>

      <!-- Currency -->
      <div class="field mb-3">
        <label for="currency" class="font-bold block mb-2">
          {{ $t("companies.currency") }} *
        </label>
        <Select
          id="currency"
          v-model="selectedCurrency"
          :options="currencies"
          optionLabel="name"
          optionValue="id"
          :class="{ 'p-invalid': errors.currency_id }"
          :placeholder="
            loadingCurrencies
              ? $t('companies.loadingCurrencies')
              : $t('companies.selectCurrency')
          "
          class="w-full"
          :loading="loadingCurrencies"
          :disabled="loadingCurrencies"
        />
        <small v-if="errors.currency_id" class="p-error">
          {{ errors.currency_id }}
        </small>
      </div>

      <!-- Social Media Section -->
      <div class="grid">
        <div class="col-12 md:col-4 field">
          <label for="website_url" class="font-bold block mb-2">
            Website URL
          </label>
          <InputText
            id="website_url"
            v-model="formData.website_url"
            class="w-full"
            :placeholder="$t('companies.websiteUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="facebook_url" class="font-bold block mb-2">
            Facebook URL
          </label>
          <InputText
            id="facebook_url"
            v-model="formData.facebook_url"
            class="w-full"
            :placeholder="$t('companies.facebookUrlPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-4 field">
          <label for="twitter_url" class="font-bold block mb-2">
            Twitter URL
          </label>
          <InputText
            id="twitter_url"
            v-model="formData.twitter_url"
            class="w-full"
            :placeholder="$t('companies.twitterUrlPlaceholder')"
          />
        </div>
      </div>

      <!-- Coordinates Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="longitude" class="font-bold block mb-2">
            Longitude
          </label>
          <InputText
            id="longitude"
            v-model="formData.longitude"
            class="w-full"
            :placeholder="$t('companies.longitudePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="latitude" class="font-bold block mb-2"> Latitude </label>
          <InputText
            id="latitude"
            v-model="formData.latitude"
            class="w-full"
            :placeholder="$t('companies.latitudePlaceholder')"
          />
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="logo" class="font-bold block mb-2">
            {{ $t("companies.logo") }}
          </label>

          <!-- Current Logo Preview -->
          <div v-if="company.logo" class="current-file-preview mb-3">
            <label class="p-text-secondary text-sm block mb-2"
              >Current Logo:</label
            >
            <img
              :src="company.logo.file_path"
              :alt="formData.name"
              class="file-preview-image"
            />
          </div>

          <!-- New Logo Upload -->
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onLogoSelect"
          />

          <!-- New Logo Preview -->
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

          <!-- Current Cover Preview -->
          <div v-if="company.cover" class="current-file-preview mb-3">
            <label class="p-text-secondary text-sm block mb-2"
              >Current Cover:</label
            >
            <img
              :src="company.cover.file_path"
              :alt="formData.name"
              class="file-preview-image"
            />
          </div>

          <!-- New Cover Upload -->
          <FileUpload
            mode="basic"
            :chooseLabel="$t('companies.chooseFile')"
            class="w-full"
            :maxFileSize="1000000"
            accept="image/*"
            @select="onCoverSelect"
          />

          <!-- New Cover Preview -->
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
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
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
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Message from "primevue/message";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyEditForm",
  components: {
    InputText,
    Textarea,
    Select,
    FileUpload,
    Button,
    Message,
  },
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      loadingCountries: false,
      loadingGovernorates: false,
      loadingCities: false,
      loadingCurrencies: false,
      error: "",
      countries: [],
      governorates: [],
      cities: [],
      currencies: [],
      selectedCountry: null,
      selectedGovernorate: null,
      selectedCity: null,
      selectedCurrency: null,
      logoFile: null,
      coverFile: null,
      clientName: "",
      formData: {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      },
      errors: {},
    };
  },
  computed: {
    filteredGovernorates() {
      if (!this.selectedCountry) return [];
      return this.governorates.filter(
        (g) => g.country_id === this.selectedCountry
      );
    },
    filteredCities() {
      if (!this.selectedGovernorate) return [];
      return this.cities.filter(
        (c) => c.governorate_id === this.selectedGovernorate
      );
    },
  },
  watch: {
    company: {
      immediate: true,
      deep: true,
      handler(newCompany) {
        if (newCompany && newCompany.id) {
          this.populateForm(newCompany);
        } else {
          this.resetForm();
        }
      },
    },
    selectedCountry: {
      handler(newValue) {
        this.formData.country_id = newValue;
        if (!newValue) {
          this.selectedGovernorate = null;
          this.selectedCity = null;
        }
      },
    },
    selectedGovernorate: {
      handler(newValue) {
        this.formData.governorate_id = newValue;
        if (!newValue) {
          this.selectedCity = null;
        }
      },
    },
    selectedCity: {
      handler(newValue) {
        this.formData.city_id = newValue;
      },
    },
    selectedCurrency: {
      handler(newValue) {
        this.formData.currency_id = newValue;
      },
    },
  },
  mounted() {
    this.loadCountries();
    this.loadGovernorates();
    this.loadCities();
    this.loadCurrencies();
  },
  methods: {
    onCountryChange() {
      this.selectedGovernorate = null;
      this.selectedCity = null;
    },

    onGovernorateChange() {
      this.selectedCity = null;
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
    },

    onLogoSelect(event) {
      this.logoFile = event.files[0];
    },

    onCoverSelect(event) {
      this.coverFile = event.files[0];
    },

    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.$http.post(
          `${general_request.BASE_URL}/storage/file`,
          formData,
          {
            headers: {
              ...general_request.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.data.id;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    },

    populateForm(company) {
      console.log("🔍 Populating form with company data:", company);

      this.resetForm();

      this.formData.id = company.id || "";
      this.formData.name = company.name || "";
      this.formData.name_ar = company.name_ar || "";
      this.formData.phone = company.phone || "";
      this.formData.email = company.email || "";
      this.formData.address = company.address || "";
      this.formData.website_url = company.website_url || "";
      this.formData.facebook_url = company.facebook_url || "";
      this.formData.twitter_url = company.twitter_url || "";
      this.formData.longitude = company.longitude || "";
      this.formData.latitude = company.latitude || "";
      this.formData.client_id = company.client?.id || "";
      this.formData.country_id = company.country?.id || "";
      this.formData.governorate_id = company.governorate?.id || "";
      this.formData.city_id = company.city?.id || "";
      this.formData.currency_id = company.currency?.id || "";
      this.formData.logo_id = company.logo?.id || "";
      this.formData.cover_id = company.cover?.id || "";

      // Set selected values
      this.selectedCountry = company.country?.id || null;
      this.selectedGovernorate = company.governorate?.id || null;
      this.selectedCity = company.city?.id || null;
      this.selectedCurrency = company.currency?.id || null;

      // Set client name for display
      this.clientName = company.client?.name || "Unknown Client";

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        name: "",
        name_ar: "",
        phone: "",
        email: "",
        address: "",
        website_url: "",
        facebook_url: "",
        twitter_url: "",
        longitude: "",
        latitude: "",
        client_id: "",
        country_id: "",
        governorate_id: "",
        city_id: "",
        currency_id: "",
        logo_id: "",
        cover_id: "",
      };
      this.selectedCountry = null;
      this.selectedGovernorate = null;
      this.selectedCity = null;
      this.selectedCurrency = null;
      this.logoFile = null;
      this.coverFile = null;
      this.clientName = "";
      this.errors = {};
      this.error = "";
    },

    async loadCountries() {
      this.loadingCountries = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/countries/search?per_page=100`,
          {
            headers: general_request.headers,
          }
        );
        this.countries = response.data.data || [];
      } catch (error) {
        console.error("Error loading countries:", error);
        this.error = this.$t("companies.loadCountriesError");
      } finally {
        this.loadingCountries = false;
      }
    },

    async loadGovernorates() {
      this.loadingGovernorates = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/governorates-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.governorates = response.data.data || [];
      } catch (error) {
        console.error("Error loading governorates:", error);
        this.error = this.$t("companies.loadGovernoratesError");
      } finally {
        this.loadingGovernorates = false;
      }
    },

    async loadCities() {
      this.loadingCities = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/cities-search-all?per_page=1000`,
          {
            headers: general_request.headers,
          }
        );
        this.cities = response.data.data || [];
      } catch (error) {
        console.error("Error loading cities:", error);
        this.error = this.$t("companies.loadCitiesError");
      } finally {
        this.loadingCities = false;
      }
    },

    async loadCurrencies() {
      this.loadingCurrencies = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/system-lookups/2`,
          {
            headers: general_request.headers,
          }
        );
        this.currencies = response.data.data || [];
      } catch (error) {
        console.error("Error loading currencies:", error);
        this.error = this.$t("companies.loadCurrenciesError");
      } finally {
        this.loadingCurrencies = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.name?.trim()) {
        this.errors.name = "Company name is required";
      }

      if (!this.formData.name_ar?.trim()) {
        this.errors.name_ar = "Arabic company name is required";
      }

      if (!this.formData.phone?.trim()) {
        this.errors.phone = "Phone number is required";
      }

      if (!this.formData.email?.trim()) {
        this.errors.email = "Email is required";
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      if (!this.formData.currency_id) {
        this.errors.currency_id = "Currency is required";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Upload files first and get IDs (same as create form)
        let logoId = this.formData.logo_id;
        let coverId = this.formData.cover_id;

        if (this.logoFile) {
          logoId = await this.uploadFile(this.logoFile);
        }

        if (this.coverFile) {
          coverId = await this.uploadFile(this.coverFile);
        }

        // Prepare company payload (same structure as create form)
        const payload = {
          _method: "PATCH", // Use PATCH for update
          client_id: this.formData.client_id,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          phone: this.formData.phone,
          email: this.formData.email,
          address: this.formData.address,
          longitude: this.formData.longitude,
          latitude: this.formData.latitude,
          website_url: this.formData.website_url,
          facebook_url: this.formData.facebook_url,
          twitter_url: this.formData.twitter_url,
          country_id: this.formData.country_id,
          governorate_id: this.formData.governorate_id,
          city_id: this.formData.city_id,
          currency_id: this.formData.currency_id,
        };

        // Add file IDs if they exist (same as create form)
        if (logoId) {
          payload.logo_id = logoId;
        }

        if (coverId) {
          payload.cover_id = coverId;
        }

        console.log("🚀 Updating company with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company/${this.formData.id}`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.$emit("company-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("companies.success"),
          this.$t("companies.companyUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("companies.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("companies.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("currency") || message.includes("currency_id")) {
          this.errors.currency_id = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        } else if (message.includes("phone")) {
          this.errors.phone = message;
        } else if (message.includes("email")) {
          this.errors.email = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>
<style scoped>
.company-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
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




_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________

src\latest\model\company\parts\CompanyEditModal.vue

<template>
  <Dialog
    :header="$t('companies.editCompany')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <CompanyEditForm
      :company="company"
      @company-updated="handleCompanyUpdated"
      @cancel="closeModal"
    />
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import CompanyEditForm from "./CompanyEditForm.vue";

export default {
  name: "CompanyEditModal",
  components: {
    Dialog,
    CompanyEditForm,
  },
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },

    handleCompanyUpdated(updatedCompany) {
      this.$emit("company-updated", updatedCompany);
      this.closeModal();
    },
  },
};
</script>



_______________________________________________________________________________________
src\latest\model\company\parts\CompanyShow.vue

<template>
  <div class="company-show-wrapper" :class="layoutClasses">
    <!-- نحط كل حاجة في container واحد -->
    <div class="company-layout-container">
      <!-- Company Header -->
      <CompanyHeader
        :company="company"
        :current-page="$route.name"
        @toggle-sidebar="toggleSidebar"
        @go-back="goBackToCompanies"
        @edit-company="editCompany"
      />

      <!-- Company Sidebar -->
      <CompanySidebar
        :company="company"
        :collapsed="sidebarCollapsed"
        :position="currentDirection"
        :is-mobile="isMobile"
        @toggle="toggleSidebar"
      />

      <!-- Mobile Overlay -->
      <div
        v-if="isMobile && !sidebarCollapsed"
        class="company-sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- Main Content -->
      <main
        class="company-main-content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <div class="company-show-page">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex justify-content-center align-items-center py-6"
          >
            <ProgressSpinner />
            <p class="ml-3">{{ $t("common.loading") }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <Message severity="error" class="mb-3">
              {{ error }}
            </Message>
            <Button
              :label="$t('common.retry')"
              icon="pi pi-refresh"
              @click="fetchCompany"
            />
          </div>

          <!-- Company Content -->
          <div v-else-if="company.id" class="company-content"></div>

          <RouterView :company="company" :company_id="company_id" />
        </div>
      </main>
    </div>

    <!-- Edit Company Modal -->
    <CompanyEditModal
      ref="companyEditModal"
      :company="company"
      @company-updated="handleCompanyUpdated"
    />

    <Toast />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import { useTable } from "../../../views/layouts/constants/composables/useTable";
import general_request from "../../../views/layouts/constants/general_request";

// Import Company Layouts
import CompanyHeader from "../layouts/CompanyHeader.vue";
import CompanySidebar from "../layouts/CompanySidebar.vue";

// Import Components
import CompanyDetails from "../parts/details/CompanyDetails.vue";
import CompanyStatistics from "../parts/details/CompanyStatistics.vue";

// Import Edit Modal
import CompanyEditModal from "./CompanyEditModal.vue";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Divider from "primevue/divider";

export default {
  name: "CompanyShow",
  components: {
    RouterView,
    CompanyHeader,
    CompanySidebar,
    CompanyEditModal, // ضيفنا الـ modal هنا
    Button,
    ProgressSpinner,
    Message,
    Toast,
    Divider,
  },
  mixins: [useTable()],
  props: {
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      company: {},
      loading: false,
      error: "",
      sidebarCollapsed: false,
      isMobile: false,
      currentLanguage: localStorage.getItem("language") || "en",
    };
  },
  computed: {
    currentDirection() {
      return this.currentLanguage === "ar" ? "rtl" : "ltr";
    },
    layoutClasses() {
      return {
        "company-ltr": this.currentDirection === "ltr",
        "company-rtl": this.currentDirection === "rtl",
        "mobile-view": this.isMobile,
      };
    },
  },
  mounted() {
    this.fetchCompany();
    this.checkMobile();
    this.setupLanguageListener();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
    if (this.languageUnwatch) {
      this.languageUnwatch();
    }
  },
  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = "";

      try {
        const companyId = this.company_id || this.$route.params.company_id;

        if (!companyId) {
          throw new Error("Company ID is missing");
        }

        const url = `${general_request.BASE_URL}/admin/company/${companyId}`;
        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        if (response.data && response.data.data) {
          this.company = response.data.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          this.$t("errors.failedToLoadCompany");
      } finally {
        this.loading = false;
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    goBackToCompanies() {
      this.$router.push("/companies");
    },

    editCompany() {
      // افتح الـ modal للتحرير
      this.$refs.companyEditModal.openModal();
    },

    handleCompanyUpdated(updatedCompany) {
      // update الـ company data بعد التعديل
      this.company = { ...this.company, ...updatedCompany };

      // show success message
      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("companies.companyUpdated")
      );

      // refresh البيانات علشان نتأكد إن كل حاجة updated
      this.fetchCompany();
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    },

    setupLanguageListener() {
      this.languageUnwatch = this.$watch("$i18n.locale", (newLocale) => {
        this.currentLanguage = newLocale;
      });
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.company-show-wrapper {
  min-height: 100vh;
  background: var(--surface-ground);
  position: relative;
}

/* الـ container الجديد علشان نحصر كل حاجة */
.company-layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* مهم جداً علشان نحصر المحتوى */
}

.company-main-content {
  min-height: calc(100vh - 70px);
  margin-left: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  background: var(--surface-ground);
  margin-top: 70px;
  position: relative;
  z-index: 1;
}

/* When sidebar is collapsed */
.company-main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* RTL Support */
.company-rtl .company-main-content {
  margin-left: 0;
  margin-right: 280px;
}

.company-rtl .company-main-content.sidebar-collapsed {
  margin-right: 70px;
}

.company-show-page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  transition: all 0.3s ease;
}

.company-sidebar-overlay {
  position: absolute; /* غيرنا لـ absolute علشان يفضل داخل الـ container */
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 699;
  backdrop-filter: blur(2px);
}

.error-state {
  text-align: center;
  padding: 2rem;
}

.company-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .company-layout-container {
    overflow: visible; /* في الموبايل بنسمح بالـ overlay */
  }

  .company-main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    margin-top: 70px;
  }

  .company-sidebar-overlay {
    top: 70px;
    z-index: 899;
  }
}
</style>




_______________________________________________________________________________________
src\latest\model\company\parts\CompanyTable.vue

<template>
  <div class="p-3">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("companies.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('companies.addCompany')"
        icon="pi pi-plus"
        @click="createCompany"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('companies.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <Select
        v-model="per_page"
        :options="perPageOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('companies.show')"
        @change="getData(propSearchUrl)"
        class="w-10rem"
      />
    </div>

    <!-- Data Table -->
    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      :loading="loading"
      :lazy="true"
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
      
    >
      <!-- ID Column -->
      <Column field="id" :header="$t('companies.id')" style="min-width: 100px">
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Logo Column -->
      <Column
        field="logo"
        :header="$t('companies.logo')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <img
            v-if="slotProps.data.logo"
            :src="slotProps.data.logo.file_path"
            :alt="slotProps.data.name"
            class="logo-image"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('companies.name')"
        sortable
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <!-- Phone Column -->
      <Column
        field="phone"
        :header="$t('companies.phone')"
        style="min-width: 130px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.phone }}</span>
        </template>
      </Column>

      <!-- Email Column -->
      <Column
        field="email"
        :header="$t('companies.email')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.email }}</span>
        </template>
      </Column>

      <!-- Client Column -->
      <Column
        field="client"
        :header="$t('companies.client')"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.client?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Country Column -->
      <Column
        field="country"
        :header="$t('companies.country')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.country?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Currency Column -->
      <Column
        field="currency"
        :header="$t('companies.currency')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.currency?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('companies.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editCompanyModal(slotProps.data)"
              v-tooltip.top="$t('companies.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('companies.delete')"
            />
            <Button
              icon="pi pi-folder"
              class="p-button-text p-button-sm p-button-info"
              @click="viewCategories(slotProps.data)"
              v-tooltip.top="$t('companies.viewCategories')"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm p-button-info"
              @click="viewCompany(slotProps.data)"
              v-tooltip.top="$t('companies.viewCompany')"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <CompanyEditModal
      ref="companyEditModal"
      :company="selectedItem"
      @company-updated="handleCompanyUpdated"
    />

    <CompanyCreateModal
      ref="companyCreateModal"
      @company-created="handleCompanyCreated"
    />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import CompanyCreateModal from "./CompanyCreateModal.vue";
import CompanyEditModal from "./CompanyEditModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "CompanyTable",

  components: {
    CompanyCreateModal,
    CompanyEditModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
  },

  directives: {
    tooltip: Tooltip,
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      // API URLs
      propSearchUrl:
        general_request.BASE_URL + "/admin/companies/search?paginate=true",
      propMainUrl: general_request.BASE_URL + "/admin/company",
    };
  },

  mounted() {
    console.log("Companies component mounted");
    this.getData();
  },

  methods: {
    /**
     * Open create company modal
     */
    createCompany() {
      this.$refs.companyCreateModal.openModal();
    },

    /**
     * Handle company created event
     */
    handleCompanyCreated(newCompany) {
      this.handleItemCreated(newCompany);
    },

    /**
     * Open edit company modal
     */
    editCompanyModal(company) {
      this.selectedItem = { ...company };
      this.$nextTick(() => {
        this.$refs.companyEditModal.openModal();
      });
    },

    /**
     * Handle company updated event
     */
    handleCompanyUpdated(updatedCompany) {
      this.handleItemUpdated(updatedCompany);
    },

    /**
     * Delete company
     */
    deleteRow(company) {
      this.deleteItem(
        company,
        this.propMainUrl,
        this.$t("companies.companyDeleted"),
        this.$t("companies.deleteError")
      );
    },

    viewCategories(company) {
      this.$router.push({
        name: "company-categories",
        params: { company_id: company.id },
      });
    },

    viewCompany(company) {
      console.log("Navigating to company:", company.id, company.name);
      this.$router.push({
        name: "company-show",
        params: { company_id: company.id },
      });
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

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>



_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________



src\latest\model\company\parts\details\CompanyDetails.vue

<template>
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
                <span>{{ company.phone || $t("companies.notProvided") }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-envelope text-primary"></i>
                <span>{{ company.email || $t("companies.notProvided") }}</span>
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

_______________________________________________________________________________________
src\latest\model\company\parts\details\CompanyStatistics.vue

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


_______________________________________________________________________________________
src\latest\model\company\layouts\CompanyHeader.vue

<template>
  <header class="company-header">
    <Menubar :model="menuItems">
      <template #start>
        <div class="header-start">
          <Button
            icon="pi pi-bars"
            @click="$emit('toggle-sidebar')"
            text
            rounded
          />
          <div class="company-info">
            <img
              v-if="company.logo"
              :src="company.logo.file_path"
              :alt="company.name"
              class="company-logo"
            />
            <div class="company-details">
              <span class="company-name">{{ company.name }}</span>
              <span class="company-page">{{ currentPageTitle }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #end>
        <div class="header-end">
          <Button
            icon="pi pi-arrow-left"
            :label="$t('common.back')"
            class="p-button-text"
            @click="$emit('go-back')"
          />
          <Button
            icon="pi pi-pencil"
            :label="$t('common.edit')"
            class="p-button-outlined"
            @click="$emit('edit-company')"
          />
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";

export default {
  name: "CompanyHeader",
  components: {
    Menubar,
    Button,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
    currentPage: {
      type: String,
      default: "company-show",
    },
  },
  emits: ["toggle-sidebar", "go-back", "edit-company"],
  data() {
    return {
      menuItems: [], // Empty menu for company header
    };
  },
  computed: {
    currentPageTitle() {
      const titles = {
        "company-show": this.$t("companies.companyDetails"),
        "company-categories": this.$t("companies.categories"),
        "company-products": this.$t("companies.products"),
        "company-branches": this.$t("companies.branches"),
      };
      return titles[this.currentPage] || this.$t("companies.companyDetails");
    },
  },
};
</script>

<style scoped>
.company-header {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: absolute; /* غيرنا لـ absolute */
  top: 0;
  left: 0;
  right: 0;
  z-index: 800;
  height: 70px;
}

.header-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--surface-border);
}

.company-details {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
}

.company-page {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  line-height: 1.2;
}

.header-end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.p-menubar) {
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  background: transparent;
  height: 70px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .company-details {
    display: none;
  }

  .header-end .p-button-text {
    display: none;
  }
}
</style>

_______________________________________________________________________________________

src\latest\model\company\layouts\CompanySidebar.vue


<template>
  <aside
    class="company-sidebar"
    :class="[position, { collapsed: collapsed, mobile: isMobile }]"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <div class="sidebar-header" v-if="!collapsed">
        <div class="sidebar-brand">
          <i class="pi pi-building brand-icon"></i>
          <span class="brand-text">{{ company.name }}</span>
        </div>

        <!-- Close button for mobile -->
        <Button
          v-if="isMobile && !collapsed"
          icon="pi pi-times"
          @click="$emit('toggle')"
          text
          rounded
          class="close-btn"
          v-tooltip="'Close'"
        />
      </div>

      <nav class="sidebar-nav">
        <div v-for="item in items" :key="item.label" class="nav-item-wrapper">
          <router-link
            v-if="item.route"
            v-slot="{ isActive }"
            :to="item.route"
            custom
          >
            <div
              class="nav-item"
              :class="{ active: isActive, collapsed: collapsed }"
              @click="handleNavigation(item.route)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ $t(item.label) }}</span>
              <div class="active-indicator" v-if="isActive && !collapsed"></div>
            </div>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer" v-if="!collapsed && !isMobile">
        <div class="company-stats">
          <div class="stat-item">
            <i class="pi pi-folder stat-icon"></i>
            <span class="stat-value">12</span>
            <span class="stat-label">{{ $t("companies.categories") }}</span>
          </div>
          <div class="stat-item">
            <i class="pi pi-shopping-bag stat-icon"></i>
            <span class="stat-value">156</span>
            <span class="stat-label">{{ $t("companies.products") }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "CompanySidebar",
  components: {
    Button,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "ltr",
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle"],
  data() {
    return {
      items: [
        {
          label: "companies.companyDetails",
          icon: "pi pi-building",
          route: `/company/${this.$route.params.company_id}/details`,
        },
        {
          label: "companies.categories",
          icon: "pi pi-folder",
          route: `/company/${this.$route.params.company_id}/categories`,
        },
        {
          label: "companies.measurementUnits",
          icon: "pi pi-calculator",
          route: `/company/${this.$route.params.company_id}/measurement-units`,
        },
        {
          label: "companies.variants",
          icon: "pi pi-palette",
          route: `/company/${this.$route.params.company_id}/variants`,
        },
        {
          label: "companies.products",
          icon: "pi pi-shopping-bag",
          route: `/company/${this.$route.params.company_id}/products`,
        },
        {
          label: "companies.finalProducts",
          icon: "pi pi-tags",
          route: `/company/${this.$route.params.company_id}/final-products`,
        },
        /* 
        {
          label: "companies.branches",
          icon: "pi pi-map-marker",
          route: "#",
          disabled: true,
        },
        {
          label: "companies.employees",
          icon: "pi pi-users",
          route: "#",
          disabled: true,
        }, */
      ],
    };
  },

  computed: {
    // Use computed property to get company_id
    companyId() {
      return this.$route.params.company_id;
    },
  },

  methods: {
    handleNavigation(route) {
      if (route && route !== "#") {
        this.$router.push(route);
        if (this.isMobile) {
          this.$emit("toggle");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Base Styles */
.company-sidebar {
  width: 280px;
  height: calc(100vh - 70px);
  background: var(--surface-card);
  position: absolute; /* غيرنا من fixed لـ absolute */
  top: 70px;
  left: 0; /* علشان الانجليزي */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 700;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* RTL Support */
.company-sidebar.rtl {
  left: auto;
  right: 0; /* علشان العربي */
  border-right: none;
  border-left: 1px solid var(--surface-border);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
  background: var(--surface-card);
  position: relative;
  z-index: 701;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .company-sidebar {
    height: 100vh;
    top: 0;
    width: 280px !important;
    z-index: 900;
    box-shadow: none;
    transform: translateX(-100%);
  }

  .company-sidebar.rtl {
    transform: translateX(100%);
  }

  .company-sidebar:not(.collapsed):not(.rtl) {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .company-sidebar:not(.collapsed).rtl {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }

  .company-sidebar.collapsed:not(.rtl) {
    transform: translateX(-100%);
  }
  .company-sidebar.collapsed.rtl {
    transform: translateX(100%);
  }

  .close-btn {
    display: block !important;
  }
}

/* Desktop Collapsed State */
@media (min-width: 769px) {
  .company-sidebar.collapsed {
    width: 70px;
  }

  .company-sidebar.collapsed .nav-item {
    padding: 0.75rem;
    justify-content: center;
  }

  .company-sidebar.collapsed .nav-icon {
    margin: 0;
  }

  .company-sidebar.collapsed .nav-label {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .company-sidebar.collapsed .active-indicator {
    display: none;
  }

  .close-btn {
    display: none !important;
  }
}

/* Sidebar Header */
.sidebar-header {
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  color: var(--primary-500);
  font-size: 1.5rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: var(--text-color-secondary);
  text-decoration: none;
}

.nav-item:hover:not(.disabled) {
  background: var(--surface-hover);
  color: var(--text-color);
  transform: translateX(4px);
}

.rtl .nav-item:hover:not(.disabled) {
  transform: translateX(-4px);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 500;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark-mode .nav-item.active {
  background: var(--primary-900);
  color: var(--primary-300);
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.rtl .nav-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

.nav-label {
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 1;
}

.active-indicator {
  position: absolute;
  right: 0.5rem;
  width: 4px;
  height: 20px;
  background: var(--primary-500);
  border-radius: 2px;
}

.rtl .active-indicator {
  right: auto;
  left: 0.5rem;
}

/* Footer with Stats */
.sidebar-footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

.company-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: var(--surface-ground);
}

.stat-icon {
  color: var(--primary-500);
  font-size: 1rem;
}

.stat-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  margin-left: auto;
}

/* Smooth animations */
.company-sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>



_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________



now i will provide you with final_product module inside company as example
because its larg
it will make the picture cleare

_______________________________________________________________________________________

HERE IS FINAL PRODUCT MODULE EXAMPLE
_______________________________________________________________________________________
src\latest\model\final_product\routes\final_product_routes.js

import FinalProductTable from "../parts/FinalProductTable.vue";

const final_product_routes = [
     {
          path: "/company/:company_id/final-products",
          name: "company-final-products",
          component: FinalProductTable,
          props: true,
     }
];

export default final_product_routes;

_______________________________________________________________________________________
src\latest\model\final_product\parts\FinalProductCreateForm.vue

<template>
  <div class="final-product-create-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information -->
      <div class="grid">
        <!-- Category -->
        <div class="col-12 md:col-6 field">
          <label for="category" class="font-bold block mb-2">
            {{ $t("final_product.category") }} *
          </label>
          <Select
            id="category"
            v-model="selectedCategory"
            :options="categories"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.category_id }"
            :placeholder="
              loadingCategories
                ? $t('final_product.loadingCategories')
                : $t('final_product.selectCategory')
            "
            class="w-full"
            :loading="loadingCategories"
            :disabled="loadingCategories"
            @change="onCategoryChange"
          />
          <small v-if="errors.category_id" class="p-error">
            {{ errors.category_id }}
          </small>
        </div>

        <!-- Product -->
        <div class="col-12 md:col-6 field">
          <label for="product" class="font-bold block mb-2">
            {{ $t("final_product.product") }} *
          </label>
          <Select
            id="product"
            v-model="selectedProduct"
            :options="filteredProducts"
            option-label="name"
            option-value="id"
            :class="{ 'p-invalid': errors.product_id }"
            :placeholder="
              loadingProducts
                ? $t('final_product.loadingProducts')
                : $t('final_product.selectProduct')
            "
            class="w-full"
            :loading="loadingProducts"
            :disabled="loadingProducts || !selectedCategory"
          />
          <small v-if="errors.product_id" class="p-error">
            {{ errors.product_id }}
          </small>
        </div>
      </div>

      <!-- Price -->
      <div class="field mb-3">
        <label for="price" class="font-bold block mb-2">
          {{ $t("final_product.price") }} *
        </label>
        <InputNumber
          id="price"
          v-model="formData.price"
          :class="{ 'p-invalid': errors.price }"
          class="w-full price-input"
          mode="decimal"
          :min="0"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :placeholder="$t('final_product.pricePlaceholder')"
          @blur="validatePrice"
        />
        <small v-if="errors.price" class="p-error">{{ errors.price }}</small>
      </div>

      <!-- Names -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("final_product.name") }}
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            class="w-full"
            :placeholder="$t('final_product.namePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("final_product.name_ar") }}
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            class="w-full"
            :placeholder="$t('final_product.nameArPlaceholder')"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("final_product.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("final_product.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsArPlaceholder')"
          />
        </div>
      </div>

      <!-- Variants Section -->
      <div class="field mb-3">
        <div class="flex justify-content-between align-items-center mb-3">
          <label class="font-bold block">
            {{ $t("final_product.variants") }}
          </label>
          <Button
            icon="pi pi-plus"
            :label="$t('final_product.addVariant')"
            class="p-button-outlined p-button-sm"
            @click="addVariantRow"
            :disabled="!selectedCategory"
          />
        </div>

        <div class="variants-section">
          <!-- Variant Rows -->
          <div
            v-for="(variantRow, index) in variantRows"
            :key="index"
            class="variant-row mb-2 p-2 border-round border surface-border"
          >
            <div class="grid align-items-center">
              <!-- Variant Selection -->
              <div class="col-12 md:col-5 field mb-0">
                <label class="font-medium block mb-1 text-xs">
                  {{ $t("final_product.variant") }}
                </label>
                <Select
                  v-model="variantRow.variant_id"
                  :options="availableVariantsForRow(index)"
                  option-label="name"
                  option-value="id"
                  :placeholder="$t('final_product.selectVariant')"
                  class="w-full variant-select"
                  @change="onVariantChange(index, $event)"
                />
              </div>

              <!-- Variant Value Selection -->
              <div class="col-12 md:col-5 field mb-0">
                <label class="font-medium block mb-1 text-xs">
                  {{ $t("final_product.variantValue") }}
                </label>
                <Select
                  v-model="variantRow.variant_value_id"
                  :options="getVariantValues(variantRow.variant_id)"
                  option-label="value"
                  option-value="id"
                  :placeholder="$t('final_product.selectVariantValue')"
                  class="w-full variant-select"
                  :disabled="!variantRow.variant_id"
                  :loading="loadingVariantValues"
                />
              </div>

              <!-- Remove Button -->
              <div class="col-12 md:col-2 field mb-0">
                <Button
                  icon="pi pi-times"
                  class="p-button-text p-button-danger p-button-sm remove-btn"
                  @click="removeVariantRow(index)"
                  v-tooltip="$t('final_product.removeVariant')"
                  :disabled="variantRows.length === 1"
                />
              </div>
            </div>

            <!-- Selected values display -->
            <div
              v-if="variantRow.variant_id || variantRow.variant_value_id"
              class="mt-2 text-xs text-color-secondary"
            >
              <span v-if="variantRow.variant_id">
                Variant: {{ getSelectedVariantName(variantRow.variant_id) }}
              </span>
              <span v-if="variantRow.variant_value_id" class="ml-2">
                Value:
                {{
                  getSelectedVariantValueName(
                    variantRow.variant_value_id,
                    variantRow.variant_id
                  )
                }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="variantRows.length === 0"
            class="empty-variants text-center py-3"
          >
            <i class="pi pi-inbox text-3xl text-color-secondary mb-2"></i>
            <p class="text-color-secondary text-sm mb-2">
              No variants added yet
            </p>
            <Button
              icon="pi pi-plus"
              :label="$t('final_product.addVariant')"
              class="p-button-outlined p-button-sm"
              @click="addVariantRow"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border"
      >
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
          class="p-button-text"
          :disabled="loading"
        />
        <Button
          type="submit"
          :label="$t('common.create')"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Message from "primevue/message";
import Tooltip from "primevue/tooltip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductCreateForm",
  components: {
    InputText,
    Textarea,
    Select,
    InputNumber,
    Button,
    Message,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },

    filteredProducts() {
      if (!this.selectedCategory) return [];
      return this.products.filter(
        (product) => product.category_id === this.selectedCategory
      );
    },

    availableVariantsForRow() {
      return (currentIndex) => {
        const selectedVariantIds = this.variantRows
          .filter((_, index) => index !== currentIndex)
          .map((row) => row.variant_id)
          .filter((id) => id);

        return this.variants.filter(
          (variant) => !selectedVariantIds.includes(variant.id)
        );
      };
    },
  },

  data() {
    return {
      loading: false,
      loadingCategories: false,
      loadingProducts: false,
      loadingVariants: false,
      loadingVariantValues: false,
      error: "",
      categories: [],
      products: [],
      variants: [],
      variantValues: {},
      selectedCategory: null,
      selectedProduct: null,

      variantRows: [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ],

      formData: {
        company_id: "",
        category_id: "",
        product_id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },

  mounted() {
    this.loadCategories();
    this.loadVariants();
  },

  methods: {
    addVariantRow() {
      this.variantRows.push({
        variant_id: null,
        variant_value_id: null,
      });
    },

    removeVariantRow(index) {
      if (this.variantRows.length > 1) {
        this.variantRows.splice(index, 1);
      }
    },

    validatePrice() {
      if (!this.formData.price || this.formData.price <= 0) {
        this.errors.price = this.$t("final_product.priceRequired");
      } else {
        delete this.errors.price;
      }
    },

    onCategoryChange() {
      this.selectedProduct = null;
      this.formData.product_id = "";
      this.variantRows = [{ variant_id: null, variant_value_id: null }];

      if (this.selectedCategory) {
        this.loadProducts();
      } else {
        this.products = [];
      }
    },

    async onVariantChange(rowIndex, event) {
      const variantId = event.value;

      this.variantRows[rowIndex].variant_value_id = null;

      if (variantId) {
        await this.loadVariantValues(variantId);
      }

      this.$forceUpdate();
    },

    getSelectedVariantName(variantId) {
      if (!variantId) return "";
      const variant = this.variants.find((v) => v.id === variantId);
      return variant ? variant.name : "";
    },

    getSelectedVariantValueName(valueId, variantId) {
      if (!valueId || !variantId) return "";
      const values = this.variantValues[variantId] || [];
      const value = values.find((v) => v.id === valueId);
      return value ? value.value : "";
    },

    getVariantValues(variantId) {
      if (!variantId) return [];
      return this.variantValues[variantId] || [];
    },

    async loadCategories() {
      this.loadingCategories = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/categories/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.categories = response.data.data || [];
      } catch (error) {
        console.error("Error loading categories:", error);
        this.error = this.$t("final_product.loadingCategoriesError");
      } finally {
        this.loadingCategories = false;
      }
    },

    async loadProducts() {
      this.loadingProducts = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/products/search/${this.effectiveCompanyId}?category_uuid=${this.selectedCategory}&paginate=false`,
          {
            headers: general_request.headers,
          }
        );
        this.products = response.data.data || [];
      } catch (error) {
        console.error("Error loading products:", error);
        this.error = this.$t("final_product.loadingProductsError");
      } finally {
        this.loadingProducts = false;
      }
    },

    async loadVariants() {
      this.loadingVariants = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/variants/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.variants = response.data.data || [];
      } catch (error) {
        console.error("Error loading variants:", error);
        this.error = this.$t("final_product.loadingVariantsError");
      } finally {
        this.loadingVariants = false;
      }
    },

    async loadVariantValues(variantId) {
      this.loadingVariantValues = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/variant-values/search/${variantId}`,
          {
            headers: general_request.headers,
          }
        );

        const variantValuesData = response.data.data || [];

        this.variantValues = {
          ...this.variantValues,
          [variantId]: variantValuesData,
        };

        this.$forceUpdate();
      } catch (error) {
        console.error("Error loading variant values:", error);
        this.variantValues = {
          ...this.variantValues,
          [variantId]: [],
        };
      } finally {
        this.loadingVariantValues = false;
      }
    },

    resetForm() {
      this.formData = {
        company_id: this.effectiveCompanyId,
        category_id: "",
        product_id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      };
      this.variantRows = [{ variant_id: null, variant_value_id: null }];
      this.selectedCategory = null;
      this.selectedProduct = null;
      this.variantValues = {};
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.selectedCategory) {
        this.errors.category_id = this.$t("final_product.categoryRequired");
      }

      if (!this.selectedProduct) {
        this.errors.product_id = this.$t("final_product.productRequired");
      }

      if (!this.formData.price || this.formData.price <= 0) {
        this.errors.price = this.$t("final_product.priceRequired");
      }

      this.variantRows.forEach((row, index) => {
        if (row.variant_id && !row.variant_value_id) {
          this.errors[`variant_row_${index}`] = this.$t(
            "final_product.variantValueRequired"
          );
        }
      });

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const payload = {
          company_id: this.effectiveCompanyId,
          category_id: this.selectedCategory,
          product_id: this.selectedProduct,
          price: this.formData.price,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
          variants: this.variantRows.filter(
            (row) => row.variant_id && row.variant_value_id
          ),
        };

        const url = `${general_request.BASE_URL}/admin/company/product/final-product`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        this.resetForm();
        this.$emit("final-product-created", response.data.data);

        this.showToast(
          "success",
          this.$t("final_product.success"),
          this.$t("final_product.finalProductCreated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("final_product.createError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("final_product.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("category")) {
          this.errors.category_id = message;
        } else if (message.includes("product")) {
          this.errors.product_id = message;
        } else if (message.includes("price")) {
          this.errors.price = message;
        } else if (message.includes("variant")) {
          this.error = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.final-product-create-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.variants-section {
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.variant-row {
  background: var(--surface-ground);
  padding: 0.75rem;
}

.variant-row:last-child {
  margin-bottom: 0;
}

.empty-variants {
  border: 2px dashed var(--surface-border);
  border-radius: 6px;
  background: var(--surface-card);
  padding: 1.5rem;
}

/* تحسينات للسعر علشان يظهر الخطأ */
:deep(.price-input.p-invalid .p-inputnumber-input) {
  border-color: #e24c4c !important;
}

:deep(.price-input.p-invalid .p-inputnumber-input:focus) {
  box-shadow: 0 0 0 0.2rem rgba(226, 76, 76, 0.2) !important;
}

/* تحسينات لل selects الصغيرة */
:deep(.variant-select .p-dropdown) {
  min-height: 2rem;
  font-size: 0.875rem;
}

:deep(.variant-select .p-dropdown-label) {
  padding: 0.4rem 0.5rem;
  font-size: 0.875rem;
}

/* تحسينات للأزرار الصغيرة */
.remove-btn {
  min-width: 2rem;
  height: 2rem;
}

/* تحسينات لل responsive */
@media (max-width: 768px) {
  .variants-section {
    max-height: 250px;
  }

  .variant-row .grid {
    gap: 0.5rem;
  }
}
</style>



_______________________________________________________________________________________
src\latest\model\final_product\parts\FinalProductCreateModal.vue

<template>
  <Dialog
    :header="$t('final_product.createFinalProduct')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
    @hide="closeModal"
  >
    <FinalProductCreateForm
      :company_id="effectiveCompanyId"
      @final-product-created="handleFinalProductCreated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("final_product.creatingFinalProduct") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import FinalProductCreateForm from "./FinalProductCreateForm.vue";

export default {
  name: "FinalProductCreateModal",
  components: {
    Dialog,
    ProgressSpinner,
    FinalProductCreateForm,
  },

  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },

  data() {
    return {
      visible: false,
      loading: false,
    };
  },

  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
    },

    handleFinalProductCreated(newFinalProduct) {
      this.$emit("final-product-created", newFinalProduct);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
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
</style>



_______________________________________________________________________________________
src\latest\model\final_product\parts\FinalProductEditForm.vue

<template>
  <div class="final-product-edit-form">
    <Message v-if="error" severity="error" class="mb-3">
      {{ error }}
    </Message>

    <form @submit.prevent="submitForm">
      <!-- Basic Information (Read-only) -->
      <div class="grid">
        <!-- Category -->
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">
            {{ $t("final_product.category") }}
          </label>
          <div
            class="flex align-items-center gap-2 p-inputtext p-component w-full"
            style="background: #f8f9fa; color: #6c757d"
          >
            <img
              v-if="finalProduct.category?.file"
              :src="finalProduct.category.file.file_path"
              :alt="finalProduct.category.name"
              class="category-image"
            />
            <span>{{ finalProduct.category?.name || "No category" }}</span>
          </div>
          <small class="p-text-secondary">
            {{ $t("final_product.cannotChangeCategory") }}
          </small>
        </div>

        <!-- Product -->
        <div class="col-12 md:col-6 field">
          <label class="font-bold block mb-2">
            {{ $t("final_product.product") }}
          </label>
          <div
            class="p-inputtext p-component w-full"
            style="background: #f8f9fa; color: #6c757d"
          >
            {{ finalProduct.product?.name || "No product" }}
          </div>
          <small class="p-text-secondary">
            {{ $t("final_product.cannotChangeProduct") }}
          </small>
        </div>
      </div>

      <!-- Price -->
      <div class="field mb-3">
        <label for="price" class="font-bold block mb-2">
          {{ $t("final_product.price") }} *
        </label>
        <InputNumber
          id="price"
          v-model="formData.price"
          :class="{ 'p-invalid': errors.price }"
          class="w-full"
          mode="currency"
          currency="USD"
          locale="en-US"
          :placeholder="$t('final_product.pricePlaceholder')"
        />
        <small v-if="errors.price" class="p-error">{{ errors.price }}</small>
      </div>

      <!-- Names -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="name" class="font-bold block mb-2">
            {{ $t("final_product.name") }}
          </label>
          <InputText
            id="name"
            v-model="formData.name"
            class="w-full"
            :placeholder="$t('final_product.namePlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="name_ar" class="font-bold block mb-2">
            {{ $t("final_product.name_ar") }}
          </label>
          <InputText
            id="name_ar"
            v-model="formData.name_ar"
            class="w-full"
            :placeholder="$t('final_product.nameArPlaceholder')"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="grid">
        <div class="col-12 md:col-6 field">
          <label for="details" class="font-bold block mb-2">
            {{ $t("final_product.details") }}
          </label>
          <Textarea
            id="details"
            v-model="formData.details"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsPlaceholder')"
          />
        </div>

        <div class="col-12 md:col-6 field">
          <label for="details_ar" class="font-bold block mb-2">
            {{ $t("final_product.details_ar") }}
          </label>
          <Textarea
            id="details_ar"
            v-model="formData.details_ar"
            rows="3"
            class="w-full"
            :placeholder="$t('final_product.detailsArPlaceholder')"
          />
        </div>
      </div>

      <!-- Current Variants (Read-only) -->
      <div
        class="field mb-3"
        v-if="finalProduct.final_product_variant_values?.length"
      >
        <label class="font-bold block mb-2">
          {{ $t("final_product.currentVariants") }}
        </label>
        <div class="current-variants p-3 border-round border surface-border">
          <div
            v-for="variantValue in finalProduct.final_product_variant_values"
            :key="variantValue.id"
            class="variant-chip mb-2"
          >
            <Chip
              :label="`${variantValue.variant.name}: ${variantValue.variant_value.value}`"
              class="mr-2"
            />
            <small class="text-color-secondary">
              (Arabic: {{ variantValue.variant.name_ar }}:
              {{ variantValue.variant_value.value_ar }})
            </small>
          </div>
        </div>
        <small class="p-text-secondary">
          {{ $t("final_product.cannotChangeVariants") }}
        </small>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          @click="$emit('cancel')"
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
</template>

<script>
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Message from "primevue/message";
import Chip from "primevue/chip";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductEditForm",
  components: {
    InputText,
    Textarea,
    InputNumber,
    Button,
    Message,
    Chip,
  },

  props: {
    finalProduct: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },

  data() {
    return {
      loading: false,
      error: "",
      formData: {
        id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      },
      errors: {},
    };
  },

  watch: {
    finalProduct: {
      immediate: true,
      deep: true,
      handler(newFinalProduct) {
        if (newFinalProduct && newFinalProduct.id) {
          this.populateForm(newFinalProduct);
        } else {
          this.resetForm();
        }
      },
    },
  },

  methods: {
    populateForm(finalProduct) {
      console.log("📝 Populating form with final product:", finalProduct);

      this.formData = {
        id: finalProduct.id || "",
        price: finalProduct.price || null,
        name: finalProduct.name || "",
        name_ar: finalProduct.name_ar || "",
        details: finalProduct.details || "",
        details_ar: finalProduct.details_ar || "",
      };

      console.log("✅ Form data after population:", this.formData);
    },

    resetForm() {
      this.formData = {
        id: "",
        price: null,
        name: "",
        name_ar: "",
        details: "",
        details_ar: "",
      };
      this.errors = {};
      this.error = "";
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.price) {
        this.errors.price = this.$t("final_product.priceRequired");
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        // Prepare payload for update (only allowed fields)
        const payload = {
          price: this.formData.price,
          name: this.formData.name,
          name_ar: this.formData.name_ar,
          details: this.formData.details,
          details_ar: this.formData.details_ar,
        };

        console.log("📤 Updating final product with payload:", payload);

        const url = `${general_request.BASE_URL}/admin/company/product/final-product/${this.formData.id}`;
        const response = await this.$http.patch(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Final product updated successfully:", response.data);

        this.$emit("final-product-updated", response.data.data);

        this.showToast(
          "success",
          this.$t("final_product.success"),
          this.$t("final_product.finalProductUpdated")
        );
      } catch (error) {
        this.handleSaveError(error);
      } finally {
        this.loading = false;
      }
    },

    handleSaveError(error) {
      this.errors = {};
      this.error = "";

      if (error.response?.data) {
        const responseData = error.response.data;

        console.log("API Error Response:", responseData);

        if (responseData.status_code === 400) {
          this.handleBadRequestError(responseData);
        } else if (responseData.status_code === 422) {
          this.handleValidationError(responseData);
        } else {
          this.handleGenericError(responseData);
        }
      } else {
        this.handleNetworkError(error);
      }
    },

    handleBadRequestError(responseData) {
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          this.error = responseData.errors.join(", ");
        } else if (
          responseData.errors.errors &&
          Array.isArray(responseData.errors.errors)
        ) {
          this.error = responseData.errors.errors.join(", ");
          this.mapCommonErrorsToFields(responseData.errors.errors);
        }
      }

      if (!this.error && responseData.message) {
        this.error = responseData.message;
      }
    },

    handleValidationError(responseData) {
      if (responseData.errors && typeof responseData.errors === "object") {
        this.errors = this.formatFieldErrors(responseData.errors);
        const firstError = Object.values(this.errors)[0];
        if (firstError) {
          this.error = firstError;
        }
      } else if (responseData.message) {
        this.error = responseData.message;
      }
    },

    handleGenericError(responseData) {
      this.error = responseData.message || this.$t("final_product.updateError");
    },

    handleNetworkError(error) {
      this.error = error.message || this.$t("final_product.networkError");
    },

    mapCommonErrorsToFields(errorMessages) {
      errorMessages.forEach((message) => {
        if (message.includes("price")) {
          this.errors.price = message;
        } else if (message.includes("name")) {
          this.errors.name = message;
        } else if (message.includes("name_ar")) {
          this.errors.name_ar = message;
        }
      });
    },

    formatFieldErrors(errorsObject) {
      const formattedErrors = {};
      Object.keys(errorsObject).forEach((field) => {
        const fieldErrors = errorsObject[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
          formattedErrors[field] = fieldErrors;
        }
      });
      return formattedErrors;
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.final-product-edit-form {
  max-width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.current-variants {
  background: var(--surface-ground);
}

.variant-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--surface-border);
}
</style>



_______________________________________________________________________________________
src\latest\model\final_product\parts\FinalProductEditModal.vue

<template>
  <Dialog
    :header="$t('final_product.editFinalProduct')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '85vw', '641px': '95vw' }"
  >
    <FinalProductEditForm
      :final-product="finalProduct"
      :company_id="effectiveCompanyId"
      @final-product-updated="handleFinalProductUpdated"
      @cancel="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import FinalProductEditForm from "./FinalProductEditForm.vue";

export default {
  name: "FinalProductEditModal",
  components: {
    Dialog,
    ProgressSpinner,
    FinalProductEditForm,
  },

  props: {
    finalProduct: {
      type: Object,
      default: () => ({}),
    },
    company_id: {
      type: String,
      default: null,
    },
  },

  computed: {
    effectiveCompanyId() {
      return this.company_id || this.$route.params.company_id;
    },
  },

  data() {
    return {
      visible: false,
      loading: false,
    };
  },

  methods: {
    openModal() {
      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.loading = false;
      this.$emit("modal-closed");
    },

    handleFinalProductUpdated(updatedFinalProduct) {
      this.$emit("final-product-updated", updatedFinalProduct);
      this.closeModal();
    },

    setLoading(state) {
      this.loading = state;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>



_______________________________________________________________________________________

src\latest\model\final_product\parts\FinalProductTable.vue
<template>
  <div class="final-product-table-page">
    <div class="mb-3">
      <h2 class="m-0">{{ $t("final_product.title") }}</h2>
    </div>

    <div class="mb-4">
      <Button
        :label="$t('final_product.addFinalProduct')"
        icon="pi pi-plus"
        @click="createFinalProduct"
        class="p-button-primary"
      />
    </div>

    <div class="flex gap-2 mb-4">
      <!-- Search Input -->
      <div class="search-container">
        <InputText
          v-model="query_string"
          :placeholder="$t('final_product.search')"
          @input="handleSearchInput"
          class="search-input w-20rem"
        />
        <i class="pi pi-search search-icon" />
      </div>

      <!-- Category Filter -->
      <Select
        v-model="selectedCategory"
        :options="categories"
        option-label="name"
        option-value="id"
        :placeholder="$t('final_product.selectCategory')"
        :loading="loadingCategories"
        :disabled="loadingCategories"
        @change="onCategoryChange"
        class="w-15rem"
        show-clear
        clear-icon="pi pi-times"
      />

      <!-- Product Filter -->
      <Select
        v-model="selectedProduct"
        :options="filteredProducts"
        option-label="name"
        option-value="id"
        :placeholder="$t('final_product.selectProduct')"
        :loading="loadingProducts"
        :disabled="loadingProducts"
        @change="onProductChange"
        class="w-15rem"
        show-clear
        clear-icon="pi pi-times"
      />

      <!-- Items Per Page -->
      <Select
        v-model="per_page"
        :options="perPageOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('final_product.show')"
        @change="handlePerPageChange"
        class="w-10rem"
      />
    </div>

    <DataTable
      :value="tableItems"
      :paginator="true"
      :rows="per_page"
      :totalRecords="meta.total"
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      :loading="loading"
      :lazy="true"
      class="p-datatable-sm"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="handlePageChange"
    >
      <!-- ID Column -->
      <Column
        field="id"
        :header="$t('final_product.id')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <span class="font-mono text-sm">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <!-- Image Column -->
      <Column
        field="main_image"
        :header="$t('final_product.image')"
        style="min-width: 80px"
      >
        <template #body="slotProps">
          <img
            v-if="slotProps.data.main_image"
            :src="slotProps.data.main_image.file.file_path"
            :alt="slotProps.data.name"
            class="product-image"
          />
          <div v-else class="no-image-placeholder">
            <i class="pi pi-image text-color-secondary"></i>
          </div>
        </template>
      </Column>

      <!-- Name Column -->
      <Column
        field="name"
        :header="$t('final_product.name')"
        :sortable="true"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          <div>
            <div class="font-medium">
              {{ slotProps.data.name || slotProps.data.product?.name }}
            </div>
            <div class="text-sm text-color-secondary">
              {{ slotProps.data.name_ar || slotProps.data.product?.name_ar }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Category Column -->
      <Column
        field="category"
        :header="$t('final_product.category')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <div class="flex align-items-center gap-2">
            <img
              v-if="slotProps.data.category?.file"
              :src="slotProps.data.category.file.file_path"
              :alt="slotProps.data.category.name"
              class="category-image"
            />
            <span>{{ slotProps.data.category?.name || "-" }}</span>
          </div>
        </template>
      </Column>

      <!-- Product Column -->
      <Column
        field="product"
        :header="$t('final_product.product')"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span>{{ slotProps.data.product?.name || "-" }}</span>
        </template>
      </Column>

      <!-- Variants Column -->
      <Column
        field="variants"
        :header="$t('final_product.variants')"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div v-if="slotProps.data.final_product_variant_values?.length">
            <Chip
              v-for="variant in slotProps.data.final_product_variant_values"
              :key="variant.id"
              :label="getVariantLabel(variant)"
              class="mr-1 mb-1 text-xs"
            />
          </div>
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Price Column -->
      <Column
        field="price"
        :header="$t('final_product.price')"
        :sortable="true"
        style="min-width: 100px"
      >
        <template #body="slotProps">
          <div class="text-right">
            <div class="font-bold">
              {{ formatCurrency(slotProps.data.price) }}
            </div>
            <div
              v-if="slotProps.data.has_discount"
              class="text-sm text-green-500"
            >
              {{ formatCurrency(slotProps.data.price_after_discount) }}
            </div>
          </div>
        </template>
      </Column>

      <!-- Created At Column -->
      <Column
        field="created_at"
        :header="$t('final_product.createdAt')"
        :sortable="true"
        style="min-width: 150px"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>

      <!-- Actions Column -->
      <Column
        :header="$t('final_product.actions')"
        :exportable="false"
        style="min-width: 200px"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-primary"
              @click="editFinalProductModal(slotProps.data)"
              v-tooltip.top="$t('final_product.edit')"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="deleteRow(slotProps.data)"
              v-tooltip.top="$t('final_product.delete')"
            />
            <Button
              icon="pi pi-palette"
              class="p-button-text p-button-sm p-button-info"
              @click="openVariantsModal(slotProps.data)"
              v-tooltip.top="'Manage Variants'"
            />
            <Button
              icon="pi pi-images"
              class="p-button-text p-button-sm p-button-help"
              @click="openImagesModal(slotProps.data)"
              v-tooltip.top="'Manage Images'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Empty State -->
    <div
      v-if="!loading && tableItems.length === 0"
      class="empty-state text-center py-6"
    >
      <i class="pi pi-inbox text-6xl text-color-secondary mb-3"></i>
      <h3 class="text-color-secondary">
        {{ $t("final_product.noFinalProducts") }}
      </h3>
      <p class="text-color-secondary">
        {{ $t("final_product.createFirstFinalProduct") }}
      </p>
      <Button
        :label="$t('final_product.addFinalProduct')"
        icon="pi pi-plus"
        @click="createFinalProduct"
        class="p-button-primary mt-3"
      />
    </div>

    <!-- Create Final Product Modal -->
    <FinalProductCreateModal
      ref="finalProductCreateModal"
      :company_id="effectiveCompanyId"
      @final-product-created="handleFinalProductCreated"
    />

    <!-- Edit Final Product Modal -->
    <FinalProductEditModal
      ref="finalProductEditModal"
      :final-product="selectedItem"
      :company_id="effectiveCompanyId"
      @final-product-updated="handleFinalProductUpdated"
    />

    <!-- Variants Modal -->
    <FinalProductVariantTableModal
      ref="variantsModal"
      :company_id="effectiveCompanyId"
      :final_product_id="selectedFinalProductId"
      :final_product_name="selectedFinalProductName"
    />

    <!-- Images Modal -->
    <!-- <FinalProductImagesModal
      ref="imagesModal"
      :company_id="effectiveCompanyId"
      :final_product_id="selectedFinalProductId"
      :final_product_name="selectedFinalProductName"
    /> -->

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";
import Chip from "primevue/chip";

import FinalProductCreateModal from "./FinalProductCreateModal.vue";
import FinalProductEditModal from "./FinalProductEditModal.vue";
import FinalProductVariantTableModal from "../variants/parts/FinalProductVariantTableModal.vue";
// import FinalProductImagesModal from "../images/parts/FinalProductImagesModal.vue";

import { useTable } from "../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductTable",

  components: {
    FinalProductCreateModal,
    FinalProductEditModal,
    FinalProductVariantTableModal,
    // FinalProductImagesModal,
    DataTable,
    Column,
    InputText,
    Button,
    Select,
    Toast,
    ConfirmDialog,
    Chip,
  },

  directives: {
    tooltip: Tooltip,
  },

  props: {
    company_id: {
      type: String,
      default: null,
    },
  },

  mixins: [useTable(), useCrud()],

  data() {
    return {
      selectedCategory: null,
      selectedProduct: null,
      categories: [],
      allProducts: [],
      loadingCategories: false,
      loadingProducts: false,
      searchTimeout: null,
      selectedFinalProductId: null,
      selectedFinalProductName: null,
    };
  },

  computed: {
    effectiveCompanyId() {
      const companyId = this.company_id || this.$route.params.company_id;
      return companyId;
    },

    propSearchUrl() {
      if (!this.effectiveCompanyId) {
        console.error("No company ID found!");
        return "";
      }

      let url = `${general_request.BASE_URL}/admin/company/product/company-final-products/search/${this.effectiveCompanyId}?paginate=true`;

      const params = [];
      if (this.selectedCategory) {
        params.push(`category_id=${this.selectedCategory}`);
      }
      if (this.selectedProduct) {
        params.push(`product_id=${this.selectedProduct}`);
      }
      if (this.query_string) {
        params.push(`query_string=${encodeURIComponent(this.query_string)}`);
      }

      if (params.length > 0) {
        url += `&${params.join("&")}`;
      }

      return url;
    },

    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product`;
    },

    filteredProducts() {
      if (this.selectedCategory) {
        return this.allProducts.filter(
          (product) => product.category_id === this.selectedCategory
        );
      }
      return this.allProducts;
    },
  },

  mounted() {
    if (this.effectiveCompanyId) {
      this.loadCategories();
      this.loadAllProducts();
      this.getData();
    } else {
      console.error("No company ID found!");
    }
  },

  watch: {
    "$route.params.company_id": {
      immediate: true,
      handler(newCompanyId) {
        if (newCompanyId) {
          this.loadCategories();
          this.loadAllProducts();
          this.getData();
        }
      },
    },
  },

  methods: {
    getVariantLabel(variant) {
      return `${variant.variant.name}: ${variant.variant_value.value}`;
    },

    async loadCategories() {
      this.loadingCategories = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/categories/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.categories = response.data.data || [];
      } catch (error) {
        console.error("Error loading categories:", error);
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product.loadingCategoriesError")
        );
      } finally {
        this.loadingCategories = false;
      }
    },

    async loadAllProducts() {
      this.loadingProducts = true;
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/products/search/${this.effectiveCompanyId}`,
          {
            headers: general_request.headers,
          }
        );
        this.allProducts = response.data.data || [];
        console.log("📦 Loaded all products:", this.allProducts.length);
      } catch (error) {
        console.error("Error loading products:", error);
        this.showToast(
          "error",
          this.$t("common.error"),
          this.$t("final_product.loadingProductsError")
        );
      } finally {
        this.loadingProducts = false;
      }
    },

    onCategoryChange() {
      this.selectedProduct = null;
      this.meta.current_page = 1;
      this.getData();
    },

    onProductChange() {
      this.meta.current_page = 1;
      this.getData();
    },

    handleSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.meta.current_page = 1;
        this.getData();
      }, 500);
    },

    handlePageChange(event) {
      this.per_page = event.rows;
      this.meta.current_page = event.page + 1;
      this.getData();
    },

    handlePerPageChange() {
      this.meta.current_page = 1;
      this.getData();
    },

    createFinalProduct() {
      this.$refs.finalProductCreateModal.openModal();
    },

    handleFinalProductCreated(newFinalProduct) {
      this.handleItemCreated(newFinalProduct);
    },

    editFinalProductModal(finalProduct) {
      this.selectedItem = { ...finalProduct };
      this.$nextTick(() => {
        this.$refs.finalProductEditModal.openModal();
      });
    },

    handleFinalProductUpdated(updatedFinalProduct) {
      this.handleItemUpdated(updatedFinalProduct);
    },

    deleteRow(finalProduct) {
      this.deleteItem(
        finalProduct,
        this.propMainUrl,
        this.$t("final_product.finalProductDeleted"),
        this.$t("final_product.deleteError")
      );
    },

    openVariantsModal(finalProduct) {
      this.selectedFinalProductId = finalProduct.id;
      this.selectedFinalProductName = finalProduct.name;
      this.$refs.variantsModal.openModal();
    },

    openImagesModal(finalProduct) {
      this.selectedFinalProductId = finalProduct.id;
      this.selectedFinalProductName = finalProduct.name;
      // this.$refs.imagesModal.openModal();
    },

    formatCurrency(amount) {
      if (!amount) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.final-product-table-page {
  padding: 1rem;
}

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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.no-image-placeholder {
  width: 50px;
  height: 50px;
  background: var(--surface-ground);
  border: 1px dashed var(--surface-border);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--surface-border);
}

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>



_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________
_______________________________________________________________________________________



_______________________________________________________________________________________
GENERAL TRANSLATIONS
src\i18n\locales\ar\final_product.js

export default {
     title: "المنتجات النهائية",
     addFinalProduct: "إضافة منتج نهائي",
     editFinalProduct: "تعديل المنتج النهائي",
     createFinalProduct: "إنشاء منتج نهائي",
     updateFinalProduct: "تحديث المنتج النهائي",
     finalProductName: "اسم المنتج",
     finalProductNameAr: "اسم المنتج بالعربية",
     search: "البحث في المنتجات النهائية...",
     show: "عرض",
     actions: "الإجراءات",
     id: "المعرف",
     name: "الاسم",
     nameAr: "الاسم بالعربية",
     image: "الصورة",
     category: "الفئة",
     product: "المنتج",
     variants: "المتغيرات",
     price: "السعر",
     createdAt: "تاريخ الإنشاء",
     edit: "تعديل",
     delete: "حذف",
     view: "عرض",
     finalProductCreated: "تم إنشاء المنتج النهائي بنجاح",
     finalProductUpdated: "تم تحديث المنتج النهائي بنجاح",
     finalProductDeleted: "تم حذف المنتج النهائي بنجاح",
     createError: "خطأ في إنشاء المنتج النهائي",
     updateError: "خطأ في تحديث المنتج النهائي",
     deleteError: "خطأ في حذف المنتج النهائي",
     networkError: "حدث خطأ في الشبكة",

     // Form labels
     selectCategory: "اختر الفئة",
     selectProduct: "اختر المنتج",
     selectVariant: "اختر المتغير",
     selectVariantValue: "اختر قيمة المتغير",
     addVariant: "إضافة متغير",
     removeVariant: "إزالة المتغير",
     currentVariants: "المتغيرات الحالية",

     // Placeholders
     namePlaceholder: "أدخل اسم المنتج",
     nameArPlaceholder: "أدخل اسم المنتج بالعربية",
     pricePlaceholder: "أدخل السعر",
     detailsPlaceholder: "أدخل تفاصيل المنتج",
     detailsArPlaceholder: "أدخل تفاصيل المنتج بالعربية",

     // Loading states
     loadingCategories: "جاري تحميل الفئات...",
     loadingProducts: "جاري تحميل المنتجات...",
     loadingVariants: "جاري تحميل المتغيرات...",
     creatingFinalProduct: "جاري إنشاء المنتج النهائي...",

     // Validation
     categoryRequired: "الفئة مطلوبة",
     productRequired: "المنتج مطلوب",
     priceRequired: "السعر مطلوب",
     variantValueRequired: "قيمة المتغير مطلوبة",

     // Success messages
     success: "نجاح",

     // Table headers
     equals: "يساوي",
     details: "التفاصيل",
     detailsAr: "التفاصيل (عربي)",
     hasDiscount: "يوجد خصم",
     discountValue: "قيمة الخصم",
     priceAfterDiscount: "السعر بعد الخصم",

     // Error messages
     loadingCategoriesError: "فشل في تحميل الفئات",
     loadingProductsError: "فشل في تحميل المنتجات",
     loadingVariantsError: "فشل في تحميل المتغيرات",

     // Read-only messages
     cannotChangeCategory: "لا يمكن تغيير الفئة أثناء التعديل",
     cannotChangeProduct: "لا يمكن تغيير المنتج أثناء التعديل",
     cannotChangeVariants: "لا يمكن تغيير المتغيرات أثناء التعديل",

     noFinalProducts: "لا توجد منتجات نهائية",
     createFirstFinalProduct: "أنشئ أول منتج نهائي للبدء",
     filterByCategory: "تصفية حسب الفئة",

     // الكلمات الجديدة المطلوبة
     variant: "المتغير",
     variantValue: "قيمة المتغير",
     details_ar: "التفاصيل بالعربية",
     name_ar: "الاسم بالعربية"
}

_______________________________________________________________________________________
src\i18n\locales\en\final_product.js
// src\i18n\locales\en\final_product.js
export default {
     title: "Final Products",
     addFinalProduct: "Add Final Product",
     editFinalProduct: "Edit Final Product",
     createFinalProduct: "Create Final Product",
     updateFinalProduct: "Update Final Product",
     finalProductName: "Product Name",
     finalProductNameAr: "Product Name (Arabic)",
     search: "Search final products...",
     show: "Show",
     actions: "Actions",
     id: "ID",
     name: "Name",
     nameAr: "Arabic Name",
     image: "Image",
     category: "Category",
     product: "Product",
     variants: "Variants",
     price: "Price",
     createdAt: "Created At",
     edit: "Edit",
     delete: "Delete",
     view: "View",
     finalProductCreated: "Final product created successfully",
     finalProductUpdated: "Final product updated successfully",
     finalProductDeleted: "Final product deleted successfully",
     createError: "Error creating final product",
     updateError: "Error updating final product",
     deleteError: "Error deleting final product",
     networkError: "Network error occurred",

     // Form labels
     selectCategory: "Select Category",
     selectProduct: "Select Product",
     selectVariant: "Select Variant",
     selectVariantValue: "Select Variant Value",
     addVariant: "Add Variant",
     removeVariant: "Remove Variant",
     currentVariants: "Current Variants",

     // Placeholders
     namePlaceholder: "Enter product name",
     nameArPlaceholder: "Enter product name in Arabic",
     pricePlaceholder: "Enter price",
     detailsPlaceholder: "Enter product details",
     detailsArPlaceholder: "Enter product details in Arabic",

     // Loading states
     loadingCategories: "Loading categories...",
     loadingProducts: "Loading products...",
     loadingVariants: "Loading variants...",
     creatingFinalProduct: "Creating final product...",

     // Validation
     categoryRequired: "Category is required",
     productRequired: "Product is required",
     priceRequired: "Price is required",
     variantValueRequired: "Variant value is required",

     // Success messages
     success: "Success",

     // Table headers
     equals: "Equals",
     details: "Details",
     detailsAr: "Details (Arabic)",
     hasDiscount: "Has Discount",
     discountValue: "Discount Value",
     priceAfterDiscount: "Price After Discount",

     // Error messages
     loadingCategoriesError: "Failed to load categories",
     loadingProductsError: "Failed to load products",
     loadingVariantsError: "Failed to load variants",

     // Read-only messages
     cannotChangeCategory: "Category cannot be changed when editing",
     cannotChangeProduct: "Product cannot be changed when editing",
     cannotChangeVariants: "Variants cannot be changed when editing",

     noFinalProducts: "No final products found",
     createFirstFinalProduct: "Create your first final product to get started",
     filterByCategory: "Filter by category",

     // New words required
     variant: "Variant",
     variantValue: "Variant Value",
     details_ar: "Details (Arabic)",
     name_ar: "Name (Arabic)"
}
_______________________________________________________________________________________
src\i18n\locales\ar\validation.js

export default {
     nameRequired: "Name is required",
     emailRequired: "Email is required",
     emailInvalid: "Please enter a valid email address",
     accountTypeRequired: "Account type is required",
     passwordRequired: "Password is required",
     passwordMinLength: "Password must be at least 6 characters",
     confirmPasswordRequired: "Please confirm your password",
     passwordsDoNotMatch: "Passwords do not match",



     nameRequired: 'Name is required',
     name_arRequired: 'Arabic name is required',
     phone_codeRequired: 'Phone code is required',
     emailRequired: 'Email is required',
     emailInvalid: 'Email is invalid',
     accountTypeRequired: 'Account type is required',

     // User validations
     passwordRequired: 'Password is required',
     passwordMinLength: 'Password must be at least 6 characters',
     passwordConfirm: 'Password confirmation is required',
     passwordMismatch: 'Passwords do not match',
     phoneRequired: 'Phone number is required',
     phoneInvalid: 'Phone number is invalid',

     // Country validations
     prefixRequired: 'Prefix is required',
     flagInvalid: 'Flag URL is invalid',

     // General validations
     fieldRequired: 'This field is required',
     invalidFormat: 'Invalid format',
     minLength: 'Must be at least {min} characters',
     maxLength: 'Must not exceed {max} characters',
     numberRequired: 'Must be a number',
     positiveNumber: 'Must be a positive number',

     // File validations
     fileRequired: 'File is required',
     fileSize: 'File size is too large',
     fileType: 'File type is not allowed',

     // Date validations
     dateRequired: 'Date is required',
     dateInvalid: 'Date is invalid',
     dateAfter: 'Date must be after {date}',
     dateBefore: 'Date must be before {date}',

     // System validations
     systemNameRequired: 'System name is required',
     systemUrlRequired: 'System URL is required',
     systemTypeRequired: 'System type is required',

     countryRequired: "Country is required",

     governorateRequired: "Governorate is required",
     nameRequired: "Name is required",

     nameArRequired: "Arabic name is required",
}


_______________________________________________________________________________________
src\i18n\locales\en\validation.js
export default {
     nameRequired: "Name is required",
     emailRequired: "Email is required",
     emailInvalid: "Please enter a valid email address",
     accountTypeRequired: "Account type is required",
     passwordRequired: "Password is required",
     passwordMinLength: "Password must be at least 6 characters",
     confirmPasswordRequired: "Please confirm your password",
     passwordsDoNotMatch: "Passwords do not match",



     nameRequired: 'Name is required',
     name_arRequired: 'Arabic name is required',
     phone_codeRequired: 'Phone code is required',
     emailRequired: 'Email is required',
     emailInvalid: 'Email is invalid',
     accountTypeRequired: 'Account type is required',

     // User validations
     passwordRequired: 'Password is required',
     passwordMinLength: 'Password must be at least 6 characters',
     passwordConfirm: 'Password confirmation is required',
     passwordMismatch: 'Passwords do not match',
     phoneRequired: 'Phone number is required',
     phoneInvalid: 'Phone number is invalid',

     // Country validations
     prefixRequired: 'Prefix is required',
     flagInvalid: 'Flag URL is invalid',

     // General validations
     fieldRequired: 'This field is required',
     invalidFormat: 'Invalid format',
     minLength: 'Must be at least {min} characters',
     maxLength: 'Must not exceed {max} characters',
     numberRequired: 'Must be a number',
     positiveNumber: 'Must be a positive number',

     // File validations
     fileRequired: 'File is required',
     fileSize: 'File size is too large',
     fileType: 'File type is not allowed',

     // Date validations
     dateRequired: 'Date is required',
     dateInvalid: 'Date is invalid',
     dateAfter: 'Date must be after {date}',
     dateBefore: 'Date must be before {date}',

     // System validations
     systemNameRequired: 'System name is required',
     systemUrlRequired: 'System URL is required',
     systemTypeRequired: 'System type is required',

     countryRequired: "Country is required",

     governorateRequired: "Governorate is required",
     nameRequired: "Name is required",

     nameArRequired: "Arabic name is required",
}

_______________________________________________________________________________________
src\i18n\locales\ar\common.js

export default {
     app: {
          title: 'نظام ERP الحديث'
     },
     header: {
          search: 'بحث...',
          notifications: 'الإشعارات',
          profile: 'الملف الشخصي',
          logout: 'تسجيل الخروج'
     },
     menu: {
          home: 'الرئيسية',
          users: 'المستخدمين',
          countries: 'الدول',
          governorates: "المحافظات",
          cities: "المدن",
          companies: "الشركات",
          calendar: 'التقويم',
          team: 'الفريق',
          documents: 'المستندات',
          reports: 'التقارير',
          settings: 'الإعدادات',
          getStarted: 'ابدأ الآن',
          learnMore: 'تعلم المزيد'
     },
     content: {
          welcome: 'مرحباً بعودتك',
          welcomeMessage: 'إليك ما يحدث في عملك اليوم. تابع أداءك واتخذ قرارات مستنيرة بالبيانات.',
          stats: 'نظرة عامة على الأداء',
          recent: 'النشاط الحديث',
          team: 'تقدم الفريق',
          analytics: 'التحليلات',
          quickActions: 'إجراءات سريعة',
          cancel: "إلغاء",
          update: "تحديث",
          create: "إنشاء",
          save: "حفظ",
          success: "نجح",
          error: "خطأ",
          confirmation: "تأكيد",
     },
     common: {
          cancel: "إلغاء",
          update: "تحديث",
          create: "إنشاء",
          save: "حفظ",
          back: "رجوع",
          edit: "تعديل",
          retry: "إعادة المحاولة",
          add: "اضافة"
     },
     footer: {
          copyright: 'حقوق النشر',
          rights: 'جميع الحقوق محفوظة',
          version: 'الإصدار'
     }
}



_______________________________________________________________________________________
src\i18n\locales\en\common.js

export default {
     app: {
          title: 'Modern ERP'
     },
     header: {
          search: 'Search...',
          notifications: 'Notifications',
          profile: 'Profile',
          logout: 'Logout'
     },
     menu: {
          home: 'Home',
          users: 'Users',
          countries: 'Countries',
          governorates: "Governorates",
          cities: "Cities",
          companies: "Companies",
          calendar: 'Calendar',
          team: 'Team',
          documents: 'Documents',
          reports: 'Reports',
          settings: 'Settings',
          getStarted: 'Get Started',
          learnMore: 'Learn More'
     },
     content: {
          welcome: 'Welcome Back',
          welcomeMessage: 'Here\'s what\'s happening with your business today. Stay on top of your performance and make data-driven decisions.',
          stats: 'Performance Overview',
          recent: 'Recent Activity',
          team: 'Team Progress',
          analytics: 'Analytics',
          quickActions: 'Quick Actions',
     },
     common: {
          cancel: "Cancel",
          update: "Update",
          create: "Create",
          save: "Save",
          success: "Success",
          error: "Error",
          confirmation: "Confirmation",
          back: "Back",
          edit: "Edit",
          retry: "Retry",
          add: "Add",
     },
     footer: {
          copyright: 'Copyright',
          rights: 'All rights reserved',
          version: 'Version'
     }
}
_______________________________________________________________________________________

and all other translation modules like final product i provided above


_______________________________________________________________________________________
src\i18n\index.js


import { createI18n } from 'vue-i18n'

// Import English translations
import enUsers from './locales/en/users'
import enCountries from './locales/en/country'
import enCommon from './locales/en/common'
import enAuth from './locales/en/auth'
import enValidation from './locales/en/validation'
import enErrors from './locales/en/errors'
import enGovernorate from './locales/en/governorate'
import enCities from './locales/en/city'
import enCompanies from './locales/en/company'
import enCategories from './locales/en/category'
import enMeasurementUnits from './locales/en/measurementUnit'
import enVariants from './locales/en/variant'
import enProducts from './locales/en/product'
import enFinalProducts from './locales/en/final_product'

// Import Arabic translations
import arUsers from './locales/ar/users'
import arCountries from './locales/ar/country'
import arCommon from './locales/ar/common'
import arAuth from './locales/ar/auth'
import arValidation from './locales/ar/validation'
import arErrors from './locales/ar/errors'
import arGovernorate from './locales/ar/governorate'
import arCities from './locales/ar/city'
import arCompanies from './locales/ar/company'
import arCategories from './locales/ar/category'
import arMeasuremartUnits from './locales/ar/measurementUnit'
import arVariants from './locales/ar/variant'
import arProducts from './locales/ar/product'
import arFinalProducts from './locales/ar/final_product'



const messages = {
     en: {
          ...enCommon,
          ...enAuth,
          ...enValidation,
          errors: enErrors,
          users: enUsers,
          countries: enCountries,
          governorates: enGovernorate,
          cities: enCities,
          companies: enCompanies,
          categories: enCategories,
          measurementUnits: enMeasurementUnits,
          variants: enVariants,
          products: enProducts,
          final_product: enFinalProducts
     },
     ar: {
          ...arCommon,
          ...arAuth,
          ...arValidation,
          errors: arErrors,
          users: arUsers,
          countries: arCountries,
          governorates: arGovernorate,
          cities: arCities,
          companies: arCompanies,
          categories: arCategories,
          measurementUnits: arMeasuremartUnits,
          variants: arVariants,
          products: arProducts,
          final_product: arFinalProducts
     }
}

const i18n = createI18n({
     legacy: false,
     locale: localStorage.getItem('language') || 'en',
     fallbackLocale: 'en',
     messages
})

export default i18n

_______________________________________________________________________________________
src\latest\model\final_product\variants\parts\FinalProductVariantCreateModal.vue


<template>
  <Dialog
    :header="$t('final_product_variants.addVariants')"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    @hide="closeModal"
  >
    <!-- Available Variants Info -->
    <Message severity="info" class="mb-4" v-if="variants.length > 0">
      {{ $t("final_product_variants.availableVariants") }}:
      {{ variants.length }}
    </Message>

    <Message severity="warn" class="mb-4" v-else-if="!loadingVariants">
      No variants available for this company
    </Message>

    <!-- Variant Rows -->
    <div class="variant-rows">
      <div
        v-for="(variantRow, index) in variantRows"
        :key="index"
        class="variant-row mb-3 p-3 border-round border surface-border"
      >
        <div class="grid align-items-center">
          <!-- Variant Selection -->
          <div class="col-12 md:col-5 field mb-0">
            <label class="font-medium block mb-2">
              {{ $t("final_product_variants.variantType") }} *
            </label>
            <Select
              v-model="variantRow.variant_id"
              :options="availableVariantsForRow(index)"
              option-label="name"
              option-value="id"
              :placeholder="$t('final_product_variants.selectVariant')"
              class="w-full"
              @change="onVariantChange(index, $event)"
              :disabled="loadingVariants || variants.length === 0"
            />
            <small class="p-error" v-if="errors[`variant_${index}`]">
              {{ errors[`variant_${index}`] }}
            </small>
          </div>

          <!-- Variant Value Selection -->
          <div class="col-12 md:col-5 field mb-0">
            <label class="font-medium block mb-2">
              {{ $t("final_product_variants.variantValue") }} *
            </label>
            <Select
              v-model="variantRow.variant_value_id"
              :options="getVariantValues(variantRow.variant_id)"
              option-label="value"
              option-value="id"
              :placeholder="$t('final_product_variants.selectVariantValue')"
              class="w-full"
              :disabled="!variantRow.variant_id || loadingVariantValues"
            />
            <small class="p-error" v-if="errors[`value_${index}`]">
              {{ errors[`value_${index}`] }}
            </small>
          </div>

          <!-- Remove Button -->
          <div class="col-12 md:col-2 field mb-0 pt-4">
            <Button
              icon="pi pi-times"
              class="p-button-text p-button-danger"
              @click="removeVariantRow(index)"
              v-tooltip="$t('final_product_variants.removeVariantRow')"
              :disabled="variantRows.length === 1"
            />
          </div>
        </div>

        <!-- Selected Variant Info -->
        <div
          v-if="variantRow.variant_id || variantRow.variant_value_id"
          class="mt-2 text-sm text-color-secondary"
        >
          <span v-if="variantRow.variant_id">
            {{ getSelectedVariantName(variantRow.variant_id) }}
          </span>
          <span v-if="variantRow.variant_value_id" class="ml-2">
            -
            {{
              getSelectedVariantValueName(
                variantRow.variant_value_id,
                variantRow.variant_id
              )
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add More Button -->
    <div class="flex justify-content-start mb-4">
      <Button
        :label="$t('final_product_variants.addVariantRow')"
        icon="pi pi-plus"
        class="p-button-outlined p-button-sm"
        @click="addVariantRow"
        :disabled="loadingVariants || variants.length === 0"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button
        :label="$t('common.cancel')"
        @click="closeModal"
        class="p-button-text"
        :disabled="loading"
      />
      <Button
        :label="$t('common.create')"
        @click="submitForm"
        class="p-button-primary"
        :loading="loading"
        :disabled="!canSubmit || loading"
      />
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
      <p class="mt-2">{{ $t("final_product_variants.creatingVariants") }}</p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import Tooltip from "primevue/tooltip";
import general_request from "../../../../views/layouts/constants/general_request";

export default {
  name: "FinalProductVariantCreateModal",
  components: {
    Dialog,
    Select,
    Button,
    Message,
    ProgressSpinner,
  },
  directives: {
    tooltip: Tooltip,
  },
  props: {
    final_product_id: {
      type: String,
      required: true,
    },
    company_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      loadingVariants: false,
      loadingVariantValues: false,
      variants: [],
      variantValues: {},
      variantRows: [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ],
      errors: {},
    };
  },
  computed: {
    availableVariantsForRow() {
      return (currentIndex) => {
        const selectedVariantIds = this.variantRows
          .filter((_, index) => index !== currentIndex)
          .map((row) => row.variant_id)
          .filter((id) => id);

        return this.variants.filter(
          (variant) => !selectedVariantIds.includes(variant.id)
        );
      };
    },

    canSubmit() {
      return this.variantRows.some(
        (row) => row.variant_id && row.variant_value_id
      );
    },
  },
  methods: {
    openModal() {
      console.log("🔧 Modal opened with:", {
        company_id: this.company_id,
        final_product_id: this.final_product_id,
      });

      this.visible = true;
      this.errors = {};

      if (!this.company_id) {
        console.error("❌ Company ID is undefined!");
        this.showError("Company ID is missing");
        return;
      }

      this.loadVariants();
    },

    closeModal() {
      this.visible = false;
      this.resetForm();
    },

    addVariantRow() {
      this.variantRows.push({
        variant_id: null,
        variant_value_id: null,
      });
    },

    removeVariantRow(index) {
      if (this.variantRows.length > 1) {
        this.variantRows.splice(index, 1);

        // Clear errors for removed row
        delete this.errors[`variant_${index}`];
        delete this.errors[`value_${index}`];
      }
    },

    async onVariantChange(rowIndex, event) {
      const variantId = event.value;
      this.variantRows[rowIndex].variant_value_id = null;

      // Clear errors
      delete this.errors[`variant_${rowIndex}`];
      delete this.errors[`value_${rowIndex}`];

      if (variantId) {
        await this.loadVariantValues(variantId);
      }
    },

    getSelectedVariantName(variantId) {
      if (!variantId) return "";
      const variant = this.variants.find((v) => v.id === variantId);
      return variant ? variant.name : "";
    },

    getSelectedVariantValueName(valueId, variantId) {
      if (!valueId || !variantId) return "";
      const values = this.variantValues[variantId] || [];
      const value = values.find((v) => v.id === valueId);
      return value ? value.value : "";
    },

    getVariantValues(variantId) {
      if (!variantId) return [];
      return this.variantValues[variantId] || [];
    },

    async loadVariants() {
      this.loadingVariants = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/variants/list/${this.company_id}?final_product_id=${this.final_product_id}`;
        console.log("🌐 Loading variants from:", url);

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        console.log("✅ Variants loaded:", response.data.data?.length || 0);
        this.variants = response.data.data || [];
      } catch (error) {
        console.error("❌ Error loading variants:", error);
        this.showError("Failed to load variants");
      } finally {
        this.loadingVariants = false;
      }
    },

    async loadVariantValues(variantId) {
      if (!variantId) return;

      this.loadingVariantValues = true;
      try {
        const url = `${general_request.BASE_URL}/admin/company/variant-values/search/${variantId}`;
        console.log("🌐 Loading variant values from:", url);

        const response = await this.$http.get(url, {
          headers: general_request.headers,
        });

        const variantValuesData = response.data.data || [];
        this.variantValues = {
          ...this.variantValues,
          [variantId]: variantValuesData,
        };

        console.log("✅ Variant values loaded:", variantValuesData.length);
        this.$forceUpdate();
      } catch (error) {
        console.error("❌ Error loading variant values:", error);
        this.variantValues = {
          ...this.variantValues,
          [variantId]: [],
        };
      } finally {
        this.loadingVariantValues = false;
      }
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      // Filter out empty rows and validate filled ones
      const validRows = this.variantRows.filter(
        (row) => row.variant_id && row.variant_value_id
      );

      if (validRows.length === 0) {
        this.showError("Please add at least one valid variant");
        return false;
      }

      // Validate each row
      this.variantRows.forEach((row, index) => {
        if (row.variant_id && !row.variant_value_id) {
          this.errors[`value_${index}`] = "Variant value is required";
          isValid = false;
        }
      });

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const payload = {
          final_product_id: this.final_product_id,
          variants: this.variantRows
            .filter((row) => row.variant_id && row.variant_value_id)
            .map((row) => ({
              variant_id: row.variant_id,
              variant_value_id: row.variant_value_id,
            })),
        };

        console.log("📤 Submitting variants:", payload);

        const url = `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`;
        const response = await this.$http.post(url, payload, {
          headers: general_request.headers,
        });

        console.log("✅ Variants added successfully:", response.data.data);

        this.$emit("variants-added", response.data.data);
        this.closeModal();

        this.showSuccess(this.$t("final_product_variants.variantsAdded"));
      } catch (error) {
        console.error("❌ Error adding variants:", error);
        this.showError(
          error.response?.data?.message || "Failed to add variants"
        );
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.variantRows = [
        {
          variant_id: null,
          variant_value_id: null,
        },
      ];
      this.variantValues = {};
      this.errors = {};
    },

    showError(message) {
      this.$toast.add({
        severity: "error",
        summary: this.$t("common.error"),
        detail: message,
        life: 3000,
      });
    },

    showSuccess(message) {
      this.$toast.add({
        severity: "success",
        summary: this.$t("common.success"),
        detail: message,
        life: 3000,
      });
    },
  },
};
</script>

<style scoped>
.variant-rows {
  max-height: 400px;
  overflow-y: auto;
}

.variant-row {
  background: var(--surface-ground);
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

:deep(.p-dialog-content) {
  position: relative;
}
</style>

_______________________________________________________________________________________
src\latest\model\final_product\variants\parts\FinalProductVariantsTable.vue

<template>
  <div
    class="final-product-variants-table"
    :class="{ 'embedded-mode': embedded }"
  >
    <!-- Page Header - Conditionally show based on embedded mode -->
    <div class="page-header mb-4" v-if="!embedded">
      <div class="flex justify-content-between align-items-center">
        <div>
          <Button
            icon="pi pi-arrow-left"
            class="p-button-text mb-2"
            @click="goBack"
            :label="$t('final_product_variants.backToProducts')"
          />
          <h2 class="m-0">
            {{ $t("final_product_variants.title") }} -
            <span class="text-primary">{{
              finalProduct?.name || "Loading..."
            }}</span>
          </h2>
        </div>
        <Button
          :label="$t('final_product_variants.addVariants')"
          icon="pi pi-plus"
          @click="openCreateModal"
          class="p-button-primary"
        />
      </div>
    </div>

    <!-- Modal Header - Show when embedded -->
    <div class="modal-header mb-4" v-if="embedded">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h3 class="m-0 text-primary">
            {{ finalProduct?.name || "Loading..." }}
          </h3>
          <p class="m-0 text-color-secondary mt-1">
            {{ $t("final_product_variants.assignedVariants") }}
          </p>
        </div>
        <Button
          :label="$t('final_product_variants.addVariants')"
          icon="pi pi-plus"
          @click="openCreateModal"
          class="p-button-primary p-button-sm"
        />
      </div>
    </div>

    <!-- Variants Table -->
    <Card :class="{ 'embedded-card': embedded }">
      <template #content>
        <DataTable
          :value="tableItems"
          :loading="loading"
          :paginator="true"
          :rows="per_page"
          :totalRecords="meta.total"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          @page="handlePageChange"
          class="p-datatable-sm"
          :class="{ 'embedded-table': embedded }"
        >
          <!-- Variant Type Column -->
          <Column
            :header="$t('final_product_variants.variantType')"
            style="min-width: 200px"
          >
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <span>{{ slotProps.data.variant.name }}</span>
                <small class="text-color-secondary">
                  ({{ slotProps.data.variant.name_ar }})
                </small>
              </div>
            </template>
          </Column>

          <!-- Variant Value Column -->
          <Column
            :header="$t('final_product_variants.variantValue')"
            style="min-width: 200px"
          >
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <span>{{ slotProps.data.variant_value.value }}</span>
                <small class="text-color-secondary">
                  ({{ slotProps.data.variant_value.value_ar }})
                </small>
              </div>
            </template>
          </Column>

          <!-- Created At Column -->
          <Column
            field="created_at"
            header="Created At"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>

          <!-- Actions Column -->
          <Column
            :header="$t('final_product_variants.actions')"
            style="min-width: 100px"
          >
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-text p-button-sm"
                @click="deleteVariant(slotProps.data)"
                v-tooltip.top="$t('final_product_variants.deleteVariant')"
              />
            </template>
          </Column>
        </DataTable>

        <!-- Empty State -->
        <div
          v-if="!loading && tableItems.length === 0"
          class="empty-state text-center py-6"
          :class="{ 'embedded-empty': embedded }"
        >
          <i class="pi pi-palette text-6xl text-color-secondary mb-3"></i>
          <h3 class="text-color-secondary">
            {{ $t("final_product_variants.noVariants") }}
          </h3>
          <p class="text-color-secondary mb-4">
            {{ $t("final_product_variants.addFirstVariant") }}
          </p>
          <Button
            :label="$t('final_product_variants.addVariants')"
            icon="pi pi-plus"
            @click="openCreateModal"
            class="p-button-primary"
          />
        </div>
      </template>
    </Card>

    <!-- Create Modal -->
    <FinalProductVariantCreateModal
      ref="createModal"
      :final_product_id="effectiveFinalProductId"
      :company_id="effectiveCompanyId"
      @variants-added="handleVariantsAdded"
    />

    <Toast />
  </div>
</template>

<script>
import { useTable } from "../../../../views/layouts/constants/composables/useTable";
import { useCrud } from "../../../../views/layouts/constants/composables/useCrud";
import general_request from "../../../../views/layouts/constants/general_request";

// Components
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";

// Modals
import FinalProductVariantCreateModal from "./FinalProductVariantCreateModal.vue";

export default {
  name: "FinalProductVariantsTable",
  components: {
    Card,
    DataTable,
    Column,
    Button,
    Toast,
    FinalProductVariantCreateModal,
  },
  directives: {
    tooltip: Tooltip,
  },
  mixins: [useTable(), useCrud()],
  props: {
    company_id: {
      type: String,
      required: true,
    },
    final_product_id: {
      type: String,
      required: true,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      finalProduct: null,
      effectiveCompanyId: null,
      effectiveFinalProductId: null,
    };
  },
  computed: {
    propSearchUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-variant-values/search/${this.effectiveFinalProductId}?paginate=true`;
    },
    propMainUrl() {
      return `${general_request.BASE_URL}/admin/company/product/final-product-variant-value`;
    },
  },
  watch: {
    company_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveCompanyId = newVal;
        }
      },
    },
    final_product_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveFinalProductId = newVal;
        }
      },
    },
  },
  mounted() {
    console.log("🔍 Variants Table Mounted with embedded:", this.embedded, {
      company_id: this.company_id,
      final_product_id: this.final_product_id,
    });

    // Ensure we have the IDs
    this.effectiveCompanyId = this.company_id;
    this.effectiveFinalProductId = this.final_product_id;

    if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
      console.error("❌ Missing required IDs:", {
        company_id: this.effectiveCompanyId,
        final_product_id: this.effectiveFinalProductId,
      });
      return;
    }

    this.loadFinalProduct();
    this.getData();
  },
  methods: {
    async loadFinalProduct() {
      try {
        const response = await this.$http.get(
          `${general_request.BASE_URL}/admin/company/product/final-product/${this.effectiveFinalProductId}`,
          {
            headers: general_request.headers,
          }
        );
        this.finalProduct = response.data.data;
        console.log("✅ Final product loaded:", this.finalProduct?.name);
      } catch (error) {
        console.error("Error loading final product:", error);
        if (!this.embedded) {
          this.showToast(
            "error",
            this.$t("common.error"),
            this.$t("final_product_variants.failedToLoadData")
          );
        }
      }
    },

    openCreateModal() {
      console.log("🔧 Opening create modal with:", {
        company_id: this.effectiveCompanyId,
        final_product_id: this.effectiveFinalProductId,
      });

      if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
        this.showToast(
          "error",
          this.$t("common.error"),
          "Missing company or product ID"
        );
        return;
      }

      this.$refs.createModal.openModal();
    },

    handleVariantsAdded(newVariants) {
      console.log("✅ New variants added:", newVariants);

      // Add new variants to the table
      newVariants.forEach((variant) => {
        this.tableItems.unshift(variant);
      });
      this.meta.total += newVariants.length;

      this.showToast(
        "success",
        this.$t("common.success"),
        this.$t("final_product_variants.variantsAdded")
      );
    },

    /**
     * Delete variant - uses useCrud confirmation dialog
     */
    deleteVariant(variant) {
      this.deleteItem(
        variant,
        this.propMainUrl,
        this.$t("final_product_variants.variantDeleted"),
        this.$t("final_product_variants.deleteError")
      );
    },

    goBack() {
      if (this.embedded) {
        // If embedded in modal, emit close event
        this.$emit("close-requested");
      } else {
        // If standalone page, navigate back
        this.$router.push({
          name: "company-final-products",
          params: { company_id: this.effectiveCompanyId },
        });
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return dateString;
      }
    },

    showToast(severity, summary, detail) {
      if (this.$toast) {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: 3000,
        });
      }
    },

    handlePageChange(event) {
      this.per_page = event.rows;
      this.meta.current_page = event.page + 1;
      this.getData();
    },
  },
};
</script>

<style scoped>
/* Embedded mode styles */
.embedded-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.embedded-mode .modal-header {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--surface-border);
}

.embedded-card {
  flex: 1;
  border: none;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.embedded-card :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.embedded-table {
  flex: 1;
  border-radius: 0;
}

.embedded-empty {
  margin: 2rem;
}

/* Original styles */
.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.empty-state {
  border: 2px dashed var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
}

:deep(.p-datatable) {
  width: 100%;
}

:deep(.p-column-title) {
  font-weight: 600;
}
</style>

_______________________________________________________________________________________
src\latest\model\final_product\variants\parts\FinalProductVariantTableModal.vue

<template>
  <Dialog
    :header="modalTitle"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '90vw', height: '80vh' }"
    :breakpoints="{ '960px': '95vw', '641px': '98vw' }"
    @hide="closeModal"
    class="final-product-variants-modal"
  >
    <!-- Import and use the existing table component -->
    <FinalProductVariantsTable
      :company_id="effectiveCompanyId"
      :final_product_id="effectiveFinalProductId"
      :embedded="true"
      @close-requested="closeModal"
    />

    <!-- Footer -->
    <template #footer>
      <Button
        :label="$t('common.close')"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

// Import the existing table component
import FinalProductVariantsTable from "./FinalProductVariantsTable.vue";

export default {
  name: "FinalProductVariantTableModal",
  components: {
    Dialog,
    Button,
    FinalProductVariantsTable,
  },
  props: {
    company_id: {
      type: String,
      required: true,
    },
    final_product_id: {
      type: String,
      required: true,
    },
    final_product_name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
      effectiveCompanyId: null,
      effectiveFinalProductId: null,
    };
  },
  computed: {
    modalTitle() {
      return `${this.$t("final_product_variants.title")} - ${
        this.final_product_name || "Product"
      }`;
    },
  },
  watch: {
    company_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveCompanyId = newVal;
        }
      },
    },
    final_product_id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.effectiveFinalProductId = newVal;
        }
      },
    },
  },
  methods: {
    openModal() {
      console.log("🔧 Opening variants modal with:", {
        company_id: this.company_id,
        final_product_id: this.final_product_id,
      });

      // Ensure we have the IDs
      this.effectiveCompanyId = this.company_id;
      this.effectiveFinalProductId = this.final_product_id;

      if (!this.effectiveCompanyId || !this.effectiveFinalProductId) {
        console.error("❌ Missing required IDs for modal");
        return;
      }

      this.visible = true;
    },

    closeModal() {
      this.visible = false;
      this.$emit("modal-closed");
    },
  },
};
</script>

<style scoped>
.final-product-variants-modal :deep(.p-dialog-content) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.final-product-variants-modal :deep(.final-product-variants-table) {
  flex: 1;
  height: 100%;
  padding: 0;
}

.final-product-variants-modal :deep(.page-header) {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--surface-border);
}

.final-product-variants-modal :deep(.p-card) {
  border: none;
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.final-product-variants-modal :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.final-product-variants-modal :deep(.p-datatable) {
  flex: 1;
  border-radius: 0;
}

.final-product-variants-modal :deep(.empty-state) {
  margin: 1.5rem;
  border-radius: 8px;
}
</style>

_______________________________________________________________________________________
BRANCH
_______________________________________________________________________________________



this is Search Branch GET METHOD
{{base_url}}/admin/company/branches/search/{{company_id}}?per_page=&query_string&paginate=true

this is the response

{
    "data": [
        {
            "id": "9f69c998-8648-4f34-b732-5391fc3c31c4",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "hosam zaki",
            "name_ar": "hosam zaki",
            "phone": "01065811878",
            "address": "almadarees st",
            "address_ar": "almadarees st",
            "created_at": "2025-07-17T15:43:46.000000Z"
        },
        {
            "id": "9f53eed4-d9a9-4235-851b-45f347f64573",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "hosam zaki",
            "name_ar": "hosam zaki",
            "phone": "01067188489",
            "address": "almadarees st, almadarees st",
            "address_ar": "almadarees st, almadarees st",
            "created_at": "2025-07-06T18:59:40.000000Z"
        },
        {
            "id": "9f4a6536-4745-4774-a0e3-f83f37f869dc",
            "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
            "name": "new branch",
            "name_ar": "new branch",
            "phone": "01010101010",
            "address": "address en",
            "address_ar": "address en",
            "created_at": "2025-07-02T01:12:24.000000Z"
        }
    ],
    "links": {
        "first": "https://www.ngcis.com/ERP/public/api/admin/company/branches/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
        "last": "https://www.ngcis.com/ERP/public/api/admin/company/branches/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
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
                "url": "https://www.ngcis.com/ERP/public/api/admin/company/branches/search/9f440efe-2b3a-46bb-9319-090027c5a773?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "https://www.ngcis.com/ERP/public/api/admin/company/branches/search/9f440efe-2b3a-46bb-9319-090027c5a773",
        "per_page": 10,
        "to": 3,
        "total": 3
    }
}
_________________________________________________________
Create Branch METHOD POST
{{base_url}}/admin/company/branch

this is its body

{
    "company_id": "{{company_id}}",
    "name": "branch name",
    "name_ar": "branch name",
    "address": "address",
    "address_ar": "address",
    "phone": "010169887615"
}

this is its response

{
    "status_code": 200,
    "message": "company.company_Branch_created_successfully",
    "data": {
        "id": "a0725e17-a654-4365-ad95-f79452ab37c9",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name_ar": "branch name",
        "phone": "010169887615",
        "address": "address",
        "address_ar": "address",
        "created_at": "2025-11-26T04:17:33.000000Z"
    }
}

______________________________________________

this is update branch PATCH METHOD

this is its body
{
    "name":"updated branch name",
    "name_ar":"updated branch name",
    "address":"branch address",
    "address_ar":"branch address",
    "phone":"01016988765"
}

{{base_url}}/admin/company/branch/{{branch_id}}

this is its response

{
    "status_code": 200,
    "message": "company.company_Branch_updated_successfully",
    "data": {
        "id": "9f69c998-8648-4f34-b732-5391fc3c31c4",
        "company_id": "9f440efe-2b3a-46bb-9319-090027c5a773",
        "name": "updated branch name",
        "name_ar": "updated branch name",
        "phone": "01016988765",
        "address": "branch address",
        "address_ar": "branch address",
        "created_at": "2025-07-17T15:43:46.000000Z"
    }
}

_______________________________

this is delete branch DELETE METHOD
{{base_url}}/admin/company/branch/{{branch_id}}


now every thing is ok????
