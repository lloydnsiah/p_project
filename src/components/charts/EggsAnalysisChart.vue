<template>
  <div class="flex flex-col gap-4">
    <span class="text-2xl font-semibold my-2 italic">Egg Analysis & Charts</span>
    <div class="mt-3 w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="w-full card">
        <span
        class="block mb-4 text-gray-700 font-medium"
          >Egg Analysis Monthly: <b>{{ months[currentMonthIndex] }}</b></span
        >
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentMonthSummary.eggs_collected">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Eggs Produced in :
                    <b class="ml-2 text-md">{{ months[currentMonthIndex] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentMonthSummary.broken_eggs">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Broken Eggs in: <b class="ml-2 text-md">{{ months[currentMonthIndex] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentMonthSummary.damaged_eggs" title="New transactions today">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Damaged Eggs in <b class="ml-2 text-md">{{ months[currentMonthIndex] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentMonthSummary.total" title="New transactions today">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Total Eggs in <b class="ml-2 text-md">{{ months[currentMonthIndex] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="w-full card">
        <span class="block mb-4 text-gray-700 font-medium">Egg Analysis Overall</span>
        <el-row :gutter="16">
          <el-col :xs="20" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
             <el-statistic :value="totalCollected">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Total number of Eggs Collected
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="20" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalDamaged">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Total number of Eggs Damaged

                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="20" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalBroken">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Total number of Broken Eggs
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :xs="20" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalGood">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Total Good Eggs 
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-base font-semibold mb-4 text-gray-700">
            Eggs Collected vs Broken Eggs vs Damaged Eggs Monthly Table
          </h3>
          <el-table :data="tableRows" style="width: 100%; margin-top: 20px">
            <el-table-column prop="month" label="Month" />
            <el-table-column prop="eggs_collected" label="Collected Eggs" />
            <el-table-column prop="broken_eggs" label="Broken Eggs" />
            <el-table-column prop="damaged_eggs" label="Damaged Eggs" />
            <el-table-column prop="total" label="Good Eggs" />
          </el-table>
        </div>
        <div class="card">
          <h3 class="text-base font-semibold mb-4 text-gray-700">
            Eggs Collected vs Broken Eggs vs Damaged Eggs Chart
          </h3>
          <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="h-120"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
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
const eggsData = ref([]);

const chartData = ref();
const chartOptions = ref();

const monthlyData = reactive(
  Array.from({ length: 12 }, () => ({
    eggs_collected: 0,
    broken_eggs: 0,
    damaged_eggs: 0,
    total: 0,
  }))
);;

const currentMonthSummary = computed(() => {
  return monthlyData[currentMonthIndex];
});

const chartColors = {
  revenue: "#42A5F5",
  expense: "#EF5350",
};

const tableRows = ref([]);

const buildTable = () => {
  tableRows.value = monthlyData.map((m, i) => ({
    month: months[i],
    eggs_collected: m.eggs_collected,
    broken_eggs: m.broken_eggs,
    damaged_eggs: m.damaged_eggs,
    total: m.total,
  }));
};

const totalCollected = computed(() => {
  return eggsData.value.reduce(
    (sum, item) => sum + Number(item.eggsCollected || 0),
    0
  );
});

const totalBroken = computed(() => {
  return eggsData.value.reduce(
    (sum, item) => sum + Number(item.eggsBroken || 0),
    0
  );
});

const totalDamaged = computed(() => {
  return eggsData.value.reduce(
    (sum, item) => sum + Number(item.eggsDamaged || 0),
    0
  );
});

const totalGood = computed(() => {
  return eggsData.value.reduce(
    (sum, item) => sum + Number(item.totalEggs || 0),
    0
  );
});

function resetMonthlyData() {
  for (let i = 0; i < 12; i++) {
    monthlyData[i].eggs_collected = 0;
    monthlyData[i].broken_eggs = 0;
    monthlyData[i].damaged_eggs = 0;
    monthlyData[i].total = 0;
  }
}

function updateChart() {
  resetMonthlyData();

  eggsData.value.forEach((item) => {
    if (!item.createdAt) return;

    const month = item.createdAt.toDate().getMonth();

    monthlyData[month].eggs_collected += Number(item.eggsCollected || 0);
    monthlyData[month].broken_eggs += Number(item.eggsBroken || 0);
    monthlyData[month].damaged_eggs += Number(item.eggsDamaged || 0);
    monthlyData[month].total += Number(item.totalEggs || 0);
  });

  buildTable();

  chartData.value = {
    labels: months,
    datasets: [
      {
        label: "Eggs Collected",
        backgroundColor: "#3B82F6",
        data: monthlyData.map((m) => m.eggs_collected),
      },
      {
        label: "Broken Eggs",
        backgroundColor: "#EF4444",
        data: monthlyData.map((m) => m.broken_eggs),
      },
      {
        label: "Damaged Eggs",
        backgroundColor: "#F59E0B",
        data: monthlyData.map((m) => m.damaged_eggs),
      },
      {
        label: "Good Eggs",
        backgroundColor: "#10B981",
        data: monthlyData.map((m) => m.total),
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
}

const loadData = () => {
  
  //Eggs
  const eggsQuery = query(
    collection(db, "eggs"),
    where("companyId", "==", store.state.companyID),
  );
  onSnapshot(eggsQuery, (snapshot) => {
    eggsData.value = snapshot.docs.map((doc) => ({
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

.statistic-card p-4 border border-gray-100 rounded-xl {
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

<!-- const colors = {
    revenue: "#10B981",
    expenses: "#EF4444",
    eggs: "#F59E0B",
    birds: "#3B82F6",
    mortality: "#8B5CF6"
}

or

backgroundColor: [
    "#4F46E5",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444"
] -->
