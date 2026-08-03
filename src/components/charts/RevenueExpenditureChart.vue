<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <span class="text-2xl font-semibold my-2 italic"
        >Revenue and Expenditure Analysis & Charts</span
      >
      <el-select
        v-model="selectedYear"
        style="width: 150px"
      >
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="year"
          :value="year"
        />
      </el-select>
    </div>
    <div>
      <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          class="rounded-2xl bg-linear-to-r from-green-500 to-green-700 py-6 px-8 text-white shadow-xl"
        >
          <p class="text-md opacity-80">
            Revenue for the month {{ months[currentMonthIndex] }}
          </p>
          <h2 class="text-5xl font-bold mt-2">
            <span class="text-3xl">GH₵ </span
            >{{ currentMonthSummary.revenue.toFixed(2) }}
          </h2>
          <p class="mt-4 text-green-100">{{ formatPercent(revenueChange) }}</p>
        </div>
        <div
          class="rounded-2xl bg-linear-to-r from-[#EF444490] to-[#EF4444] py-6 px-8 text-white shadow-xl"
        >
          <p class="text-md opacity-80">
            Expenditure for the month {{ months[currentMonthIndex] }}
          </p>
          <h2 class="text-5xl font-bold mt-2">
            <span class="text-3xl">GH₵ </span
            >{{ currentMonthSummary.expenses.toFixed(2) }}
          </h2>
          <p class="mt-4 text-green-100">{{ formatPercent(expenseChange) }}</p>
        </div>
        <div
          class="rounded-2xl bg-linear-to-r from-[#649ff090] to-[#649ff0] py-6 px-8 text-white shadow-xl"
        >
          <p class="text-md opacity-80">
            Profit for the month {{ months[currentMonthIndex] }}
          </p>
          <h2 class="text-5xl font-bold mt-2">
            <span class="text-3xl">GH₵ </span
            >{{ currentMonthSummary.profit.toFixed(2) }}
          </h2>
          <p class="mt-4 text-green-100">{{ formatPercent(profitChange) }}</p>
        </div>
        <div
          class="rounded-2xl bg-linear-to-r from-[#d49ef290] to-[#d49ef2] py-6 px-8 text-white shadow-xl"
        >
          <p class="text-md opacity-80">Grand Profit</p>
          <h2 class="text-5xl font-bold mt-2">
            <span class="text-3xl">GH₵ </span>{{ sumProfit }}
          </h2>
          <p class="mt-4 text-green-100"></p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">
            Revenue vs Expenses vs Profit Chart
          </h3>
          <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="h-120"
          />
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">
            Revenue vs Expenses vs Profit Monthly Table
          </h3>
          <el-table :data="tableRows" style="width: 100%; margin-top: 20px">
            <el-table-column prop="month" label="Month" />
            <el-table-column prop="revenue" label="Revenue" />
            <el-table-column prop="expenses" label="Expenses" />
            <el-table-column prop="profit" label="Profit" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import Chart from "primevue/chart";
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from "@element-plus/icons-vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ElLoading } from "element-plus";
import { db } from "../../firebase";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const store = useStore();
const currentMonthIndex = new Date().getMonth();
const previousMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
const revenueData = ref([]);
const expenseData = ref([]);

const selectedYear = ref(new Date().getFullYear());
const availableYears = computed(() => {
  const years = new Set();
   [...revenueData.value, ...expenseData.value].forEach((item) => {
    if (item.createdAt) {
      years.add(item.createdAt.toDate().getFullYear());
    }
  });

  return [...years].sort((a, b) => b - a);
});

const chartData = ref();
const chartOptions = ref();

const monthlyData = reactive(
  Array.from({ length: 12 }, () => ({
    revenue: 0,
    expenses: 0,
    profit: 0,
  })),
);

const chartColors = {
  revenue: "#42A5F5",
  expense: "#EF5350",
};

watch(availableYears, (years) => {
  if (!years.length) return;

  if (!years.includes(selectedYear.value)) {
    selectedYear.value = years[0];
  }
});

watch(
  monthlyData,
  () => {
    buildTable();
  },
  { deep: true },
);

watch(selectedYear, () => {
  updateChart();
});

const currentMonthSummary = computed(() => {
  return monthlyData[currentMonthIndex];
});

function percentChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

const revenueChange = computed(() => {
  const current = monthlyData[currentMonthIndex].revenue;
  const previous = monthlyData[previousMonth].revenue;
  return percentChange(current, previous);
});

const expenseChange = computed(() => {
  const current = monthlyData[currentMonthIndex].expenses;
  const previous = monthlyData[previousMonth].expenses;
  return percentChange(current, previous);
});

const profitChange = computed(() => {
  const current = monthlyData[currentMonthIndex].profit;
  const previous = monthlyData[previousMonth].profit;
  return percentChange(current, previous);
});

const formatPercent = (value) => {
  const numericValue = Number(value) || 0;
  const sign = numericValue >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(numericValue).toFixed(1)}% this month`;
};

const tableRows = ref([]);

const buildTable = () => {
  tableRows.value = monthlyData.map((m, i) => ({
    month: months[i],
    revenue: (Number(m.revenue) || 0).toFixed(2),
    expenses: (Number(m.expenses) || 0).toFixed(2),
    profit: (Number(m.profit) || 0).toFixed(2),
  }));
};

const sumProfit = computed(() => {
  return tableRows.value.reduce((sum, item) => {
    return sum + (Number(item.profit) || 0);
  }, 0);
});

function resetMonthlyData() {
  for (let i = 0; i < 12; i++) {
    monthlyData[i].revenue = 0;
    monthlyData[i].expenses = 0;
    monthlyData[i].profit = 0;
  }
}

function updateChart() {
  resetMonthlyData();

  // Revenue
  revenueData.value.forEach((item) => {
    if (!item.createdAt) return;
    const date = item.createdAt.toDate();
    if (date.getFullYear() !== selectedYear.value) return;
    const month = date.getMonth();
    const total = item.revenue.reduce(
      (sum, row) => sum + (Number(row.itemTotal) || 0),
      0,
    );
    monthlyData[month].revenue += total;
  });

  // Expenses
  expenseData.value.forEach((item) => {
    if (!item.createdAt) return;
    const date = item.createdAt.toDate();
    if (date.getFullYear() !== selectedYear.value) return;
    const month = date.getMonth();
    const total = item.expenses.reduce(
      (sum, row) => sum + (Number(row.price) || 0),
      0,
    );
    monthlyData[month].expenses += total;
  });

  // Profit
  monthlyData.forEach((m) => {
    m.profit = m.revenue - m.expenses;
  });

  // Chart
  chartData.value = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.map((m) => m.revenue),
      },
      {
        label: "Expenses",
        data: monthlyData.map((m) => m.expenses),
      },
      {
        label: "Profit",
        data: monthlyData.map((m) => m.profit),
      },
    ],
  };

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,

    // Moved plugins here
    plugins: {
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 10,
      },
    },

    // Moved scales here
    scales: {
      y: {
        grid: {
          color: "#F3F4F6",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  buildTable();
}

const loadData = () => {
  // Revenue
  const revenueQuery = query(
    collection(db, "revenues"),
    where("companyId", "==", store.state.companyID),
  );

  onSnapshot(revenueQuery, (snapshot) => {
    revenueData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    updateChart();
  });

  // Expenses
  const expenseQuery = query(
    collection(db, "expenses"),
    where("companyId", "==", store.state.companyID),
  );

  onSnapshot(expenseQuery, (snapshot) => {
    expenseData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    updateChart();
  });
};

const setChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
});

onMounted(() => {
  chartOptions.value = setChartOptions();
  loadData();
});
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
</style>
