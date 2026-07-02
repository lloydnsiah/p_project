<template>
  <div class="flex flex-col gap-4">
    <RevenueExpensesChart />
    <EggsAnalysisChart />
    <BirdsAnalysisChart />
  </div>
</template>

<script setup>

import RevenueExpensesChart from "../components/charts/RevenueExpenditureChart.vue";
import EggsAnalysisChart from "./charts/EggsAnalysisChart.vue";
import BirdsAnalysisChart from "./charts/BirdsAnalysisChart.vue";
</script>
