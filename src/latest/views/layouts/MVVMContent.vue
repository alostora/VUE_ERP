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
