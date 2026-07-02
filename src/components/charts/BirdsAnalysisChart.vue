<template>
  <div class="flex flex-col gap-4">
    <span class="text-2xl font-semibold my-2 italic">Birds Analysis & Charts</span>
    
    <div class="mt-3 w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="w-full card bg-white rounded-2xl shadow p-6">
        <span class="block mb-4 text-gray-700 font-medium text-lg">
          Bird Analysis Monthly: <b>{{ months[currentMonth] }}</b>
        </span>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentBirdSummary.newStock">
                <template #title>
                  <div class="inline-flex items-center gap-1">
                    New Stock in <b class="ml-1 text-md">{{ months[currentMonth] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentBirdSummary.dead">
                <template #title>
                  <div class="inline-flex items-center gap-1">
                    Dead Birds in <b class="ml-1 text-md">{{ months[currentMonth] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentBirdSummary.sold">
                <template #title>
                  <div class="inline-flex items-center">
                    Sold Birds in <b class="ml-1 text-md">{{ months[currentMonth] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="currentBirdSummary.total">
                <template #title>
                  <div class="inline-flex items-center">
                    Net Monthly Shift in <b class="ml-1 text-md">{{ months[currentMonth] }}</b>
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="w-full card bg-white rounded-2xl shadow p-6">
        <span class="block mb-4 text-gray-700 font-medium text-lg">Flock Analytics Overall</span>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalNewStock" title="Total New Stock Purchased" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalDead" title="Total Cumulative Deaths" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalSold" title="Total Birds Sold Out" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" class="mb-4">
            <div class="statistic-card p-4 border border-gray-100 rounded-xl">
              <el-statistic :value="totalBirds" title="Current Active Flock Size" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="card border border-gray-100 p-4 rounded-xl">
          <h3 class="text-base font-semibold mb-4 text-gray-700">
            Flock Lifecycle Breakdown Monthly Table
          </h3>
          <el-table :data="birdTable" style="width: 100%">
            <el-table-column prop="month" label="Month" width="90" />
            <el-table-column prop="newStock" label="New Stock" />
            <el-table-column prop="dead" label="Dead" />
            <el-table-column prop="sold" label="Sold" />
            <el-table-column prop="total" label="Running Flock Total" />
          </el-table>
        </div>
        
        <div class="card border border-gray-100 p-4 rounded-xl">
          <h3 class="text-base font-semibold mb-4 text-gray-700">
            Flock Entry vs Exit Trends
          </h3>
          <Chart
            v-if="barChart"
            type="bar"
            :data="barChart"
            :options="chartOptions"
            class="h-120"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
      <h3 class="text-base font-semibold mb-4 text-gray-700 self-start">
        Current Month Breed Composition ({{ months[currentMonth] }})
      </h3>
      <div class="w-full max-w-md">
        <Chart v-if="typePie" type="pie" :data="typePie" class="h-120" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import Chart from "primevue/chart";
import { Warning } from "@element-plus/icons-vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const store = useStore();
const currentMonth = new Date().getMonth();

const birdsData = ref([]);
const typePie = ref(null);
const barChart = ref(null);

const monthlyBirdData = reactive(
  Array.from({ length: 12 }, () => ({
    newStock: 0,
    dead: 0,
    sold: 0,
    broilers: 0,
    layers: 0,
    cockerels: 0,
  }))
);

// Generates correct continuous running totals from Jan to Dec
const birdTable = computed(() => {
  let runningTotal = 0;
  return monthlyBirdData.map((month, index) => {
    runningTotal += (month.newStock - month.dead - month.sold);
    return {
      month: months[index],
      newStock: month.newStock,
      dead: month.dead,
      sold: month.sold,
      total: runningTotal
    };
  });
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
});

const totalNewStock = computed(() => monthlyBirdData.reduce((sum, m) => sum + m.newStock, 0));
const totalDead = computed(() => monthlyBirdData.reduce((sum, m) => sum + m.dead, 0));
const totalSold = computed(() => monthlyBirdData.reduce((sum, m) => sum + m.sold, 0));
const totalBirds = computed(() => totalNewStock.value - totalDead.value - totalSold.value);

const currentBirdSummary = computed(() => {
  const month = monthlyBirdData[currentMonth];
  return {
    newStock: month.newStock,
    dead: month.dead,
    sold: month.sold,
    total: month.newStock - month.dead - month.sold,
    broilers: month.broilers,
    layers: month.layers,
    cockerels: month.cockerels,
  };
});

function resetBirdData() {
  monthlyBirdData.forEach((month) => {
    month.newStock = 0;
    month.dead = 0;
    month.sold = 0;
    month.broilers = 0;
    month.layers = 0;
    month.cockerels = 0;
  });
}

function buildCharts() {
  const month = monthlyBirdData[currentMonth];

  typePie.value = {
    labels: ["Broilers", "Layers", "Cockerels"],
    datasets: [
      {
        data: [month.broilers, month.layers, month.cockerels],
        backgroundColor: ["#F59E0B", "#10B981", "#6366F1"],
      },
    ],
  };

  barChart.value = {
    labels: months,
    datasets: [
      {
        label: "New Stock",
        backgroundColor: "#22C55E",
        data: monthlyBirdData.map((m) => m.newStock),
      },
      {
        label: "Dead",
        backgroundColor: "#EF4444",
        data: monthlyBirdData.map((m) => m.dead),
      },
      {
        label: "Sold",
        backgroundColor: "#3B82F6",
        data: monthlyBirdData.map((m) => m.sold),
      },
    ],
  };
}

function calculateBirdData() {
  resetBirdData();

  birdsData.value.forEach((item) => {
    if (!item.createdAt) return;

    const date = typeof item.createdAt.toDate === "function" ? item.createdAt.toDate() : new Date(item.createdAt);
    const month = date.getMonth();
    const qty = Number(item.numberofbirds) || 0;

    // Map categories
    if (item.category === "New Stock") monthlyBirdData[month].newStock += qty;
    if (item.category === "Dead") monthlyBirdData[month].dead += qty;
    if (item.category === "Sold") monthlyBirdData[month].sold += qty;

    // Map breeds
    if (item.type === "Broilers") monthlyBirdData[month].broilers += qty;
    if (item.type === "Layers") monthlyBirdData[month].layers += qty;
    if (item.type === "Cockerels") monthlyBirdData[month].cockerels += qty;
  });

  buildCharts();
}

const loadData = () => {
  const birdsQuery = query(
    collection(db, "birds"),
    where("companyId", "==", store.state.companyID)
  );
  
  onSnapshot(birdsQuery, (snapshot) => {
    birdsData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    calculateBirdData();
  });
};

onMounted(() => {
  loadData();
});
</script>