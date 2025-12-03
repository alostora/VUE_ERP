<template>
  <div class="table-scroll-wrapper" :class="{ 'dark-mode': darkMode }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ScrollableTable",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      type: [String, Number],
      default: "1200px",
    },
    height: {
      type: String,
      default: "auto",
    },
    showScrollbar: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.setupTableStyles();
  },
  methods: {
    setupTableStyles() {
      this.$nextTick(() => {
        const table = this.$el.querySelector("table");
        if (table) {
          table.style.minWidth = this.minWidth;
        }

        // For PrimeVue DataTable
        const pTable = this.$el.querySelector(".p-datatable-table");
        if (pTable) {
          pTable.style.minWidth = this.minWidth;
        }
      });
    },
  },
};
</script>

<style scoped>
.table-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
}

/* Scrollbar styling */
.table-scroll-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hide scrollbar if needed */
.table-scroll-wrapper.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.table-scroll-wrapper.no-scrollbar {
  scrollbar-width: none;
}

/* Dark mode */
.table-scroll-wrapper.dark-mode {
  border-color: #4a5568;
  background: #2d3748;
}

.table-scroll-wrapper.dark-mode::-webkit-scrollbar-track {
  background: #4a5568;
}

.table-scroll-wrapper.dark-mode::-webkit-scrollbar-thumb {
  background: #718096;
}

/* Ensure tables inside are properly styled */
:deep(.table-scroll-wrapper table),
:deep(.table-scroll-wrapper .p-datatable-table) {
  width: 100%;
  margin-bottom: 0;
}

/* Sticky headers for DataTable */
:deep(.table-scroll-wrapper .p-datatable-thead > tr > th) {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
  border-bottom: 2px solid #dee2e6;
}

.table-scroll-wrapper.dark-mode :deep(.p-datatable-thead > tr > th) {
  border-bottom-color: #4a5568;
}
</style>
