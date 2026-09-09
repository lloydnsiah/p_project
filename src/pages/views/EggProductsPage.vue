<template>
  <div class="section_container h-[calc(100vh-64px)] flex flex-col gap-8">
    <div
      class="flex justify-between bg-primary py-2 px-4 rounded-sm items-center text-white"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-lg font-bold">{{ route.name }}</h1>
        <p class="text-sm italic text-gray-300">{{ route.meta.description }}</p>
      </div>
      <button
        @click="modal_add = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-sm shadow-sm text-white cursor-pointer bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Add Record
      </button>
    </div>
      <div v-if="!tableData.length" class="card">
        <span class="text-gray-400 text-2xl ml-4 italic">Egg Records</span>
        <el-empty description="No data available" />
      </div>
      <div v-else class="card">
        <DataTable
          v-model:expandedRows="expandedRows"
          dataKey="id"
          :value="tableData"
          :paginator="tableData?.length > 5"
          :rows="5"
          size="small"
          :rowsPerPageOptions="[5, 10]"
          tableStyle="min-width: 50rem"
          v-model:filters="filters"
          :globalFilterFields="[
            'batchName',
            'type',
            'size',
            'totalEggs',
            'date',
          ]"
        >
          <template #header>
            <div class="flex justify-content-end">
              <div class="flex items-center w-full justify-between">
                <div class="flex flex-col gap-1">
                  <h1 class="text-2xl text-gray-800">Egg Records</h1>
                </div>
                <div class="flex gap-4 items-center">
                  <IconField iconPosition="left">
                    <InputIcon>
                      <i class="pi pi-search"></i>
                    </InputIcon>
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Keyword Search"
                    />
                  </IconField>
                  <el-button @click="visible = true" v-if="tableData.length"
                    >Show Data</el-button
                  >
                </div>
              </div>
            </div>
          </template>
          <template #empty> No Data found. </template>
          <Column field="date" header="Created At" style="width: 10%"></Column>
          <Column
            field="batchName"
            header="Batch Name"
            style="width: 20%"
          ></Column>
          <Column
            field="type"
            header="Type of Egg"
            style="width: 20%"
           
          ></Column>
          <Column
            field="size"
            header="Size"
            style="width: 10%"
            
          ></Column>

          <Column
            field="totalEggs"
            header="Total Eggs"
            style="width: 10%"
          ></Column>
          <Column field="comment" header="Comment" style="width: 30%"></Column>
          <Column expander style="width: 5rem" />
          <Column header="Actions">
            <template #body="slotProps">
              <div class="flex flex-row gap-4">
                <!-- <Button label="Edit" severity="success" variant="text" /> -->
                <Button
                  @click="updateData(slotProps.data)"
                  icon="pi pi-pencil"
                  severity="info"
                  variant="text"
                  raised
                  rounded
                  aria-label="Search"
                  size="small"
                />
                <Button
                  @click="confirmDelete(slotProps.data)"
                  icon="pi pi-times"
                  severity="danger"
                  variant="text"
                  raised
                  rounded
                  aria-label="Cancel"
                  size="small"
                />
                <!-- <Button label="Delete" severity="danger" variant="text" /> -->
              </div>
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-3">
              <h2 class="font-bold mb-2">Details</h2>
              <div class="w-full flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span>Eggs Collected:</span>
                  <b> {{ slotProps.data.eggsCollected }} </b>
                </div>
                <div class="flex items-center justify-between">
                  <span>Broken Eggs:</span>
                  <b> {{ slotProps.data.eggsBroken }} </b>
                </div>
                <div class="flex items-center justify-between">
                  <span>Damaged Eggs:</span>
                  <b> {{ slotProps.data.eggsDamaged }} </b>
                </div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
 
  <AddEggRecord v-if="modal_add" @close="modal_add = false" />
  <UpdateEggRecord
    v-if="modal_update"
    @close="modal_update = false"
    :data="selectedData"
  />
  <DeleteDialog
    v-if="modal_delete"
    @close="modal_delete = false"
    @delete="deleleData()"
  />

  <Dialog
    v-model:visible="visible"
    maximizable
    modal
    header="Egg Analysis Overall"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="w-full card">
      <div
        class="my-4 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4"
      >
        <span>All Eggs Data</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
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
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
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
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
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
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
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
      <div
        class="my-4 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4"
      >
        <span>White Eggs Data</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalWhiteCollected">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of White Eggs Collected
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalWhiteDamaged">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of White Eggs Damaged
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalWhiteBroken">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of Broken White Eggs
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalWhiteGood">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total White Good Eggs
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
      <div
        class="my-4 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4"
      >
        <span>Brown Eggs Data</span>
      </div>

      <el-row :gutter="16">
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalBrownCollected">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of Brown Eggs Collected
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalBrownDamaged">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of Brown Eggs Damaged
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalBrownBroken">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total number of Broken Brown Eggs
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :xs="18" :sm="12" :md="12" class="mb-1">
          <div class="statistic-card p-4 border border-gray-100 rounded-xl">
            <el-statistic :value="totalBrownGood">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Total Good Brown Eggs
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
  </Dialog>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import AddSupplier from "../../components/AddSupplier.vue";
import { ElLoading, ElMessage } from "element-plus";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useStore } from "vuex";
import AddEggRecord from "../../components/AddEggRecord.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import UpdateEggRecord from "../../components/UpdateEggRecord.vue";

const expandedRows = ref({});
const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const visible = ref(false);
const tableData = ref([]);
const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const store = useStore();

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Data...",
  });

  const usersCollection = query(
    collection(db, "eggs"),
    where("companyId", "==", store.state.companyID),
    orderBy("createdAt", "desc"),
  );
  onSnapshot(usersCollection, (snapshot) => {
    tableData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loadingInstance.close();
  });
});

const updateData = (data) => {
  selectedData.value = data;
  modal_update.value = true;
};

const confirmDelete = (data) => {
  selectedData.value = data;
  modal_delete.value = true;
};

const deleleData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Deleting Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "eggs", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};

const totalCollected = computed(() =>
  tableData.value.reduce(
    (sum, item) => sum + Number(item.eggsCollected || 0),
    0,
  ),
);

const totalBroken = computed(() =>
  tableData.value.reduce((sum, item) => sum + Number(item.eggsBroken || 0), 0),
);

const totalDamaged = computed(() =>
  tableData.value.reduce((sum, item) => sum + Number(item.eggsDamaged || 0), 0),
);

const totalGood = computed(() =>
  tableData.value.reduce((sum, item) => sum + Number(item.totalEggs || 0), 0),
);

const totalWhiteGood = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "White" ? sum + Number(item.totalEggs || 0) : sum;
  }, 0),
);

const totalWhiteCollected = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "White" ? sum + Number(item.eggsCollected || 0) : sum;
  }, 0),
);

const totalWhiteBroken = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "White" ? sum + Number(item.eggsBroken || 0) : sum;
  }, 0),
);

const totalWhiteDamaged = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "White" ? sum + Number(item.eggsDamaged || 0) : sum;
  }, 0),
);
const totalBrownGood = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "Brown" ? sum + Number(item.totalEggs || 0) : sum;
  }, 0),
);

const totalBrownCollected = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "Brown" ? sum + Number(item.eggsCollected || 0) : sum;
  }, 0),
);

const totalBrownBroken = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "Brown" ? sum + Number(item.eggsBroken || 0) : sum;
  }, 0),
);

const totalBrownDamaged = computed(() =>
  tableData.value.reduce((sum, item) => {
    return item.type === "Brown" ? sum + Number(item.eggsDamaged || 0) : sum;
  }, 0),
);

const filters = ref({
  global: { value: null },
  batchName: { value: null },
  type: { value: null },
  size: { value: null },
  totalEggs: { value: null },
  date: { value: null },
});

</script>
