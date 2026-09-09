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
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-sm shadow-sm text-white cursor-pointer bg-blue-600 
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Add Inventory
      </button>
    </div>
    <div class="flex-1 flex flex-col gap-1 mx-2">
      
      <div v-if="!tableData.length" class="card">
        <span class="text-gray-400 text-2xl ml-4 italic">Inventory List</span>
        <el-empty description="No data available" />
      </div>
      <div v-else class="card">
        <DataTable
          :value="tableData"
          :paginator="tableData?.length > 5"
          :rows="5"
          :rowsPerPageOptions="[5, 10]"
          tableStyle="min-width: 50rem"
          size="small"
          v-model:filters="filters"
          :globalFilterFields="[
            'name',
            'currency',
            'price',
            'feature',
            'createdBy',
          ]"
        >
          <template #header>
            <div class="flex justify-content-end">
              <div class="flex items-center w-full justify-between">
                <div class="flex flex-col gap-1">
                  <h1 class="text-2xl text-gray-800">Inventory List</h1>
                </div>
                <div class="flex gap-2">
                  <IconField iconPosition="left">
                    <InputIcon>
                      <i class="pi pi-search"></i>
                    </InputIcon>
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Keyword Search"
                    />
                  </IconField>
                  
                </div>
              </div>
            </div>
          </template>
          <template #empty> No Data found. </template>
          <Column field="name" header="Inventory Name" style="width: 20%"></Column>
          <Column
            field="currency"
            header="Currency"
            style="width: 5%"
          ></Column>
          <Column
            field="price"
            header="Purchase Price"
            style="width: 20%"
          ></Column>
          <Column header="Inventory Type" style="width: 14%">
            <template #body>
              <Tag
                value="Active"
                severity="success"
              />
            </template>
          </Column>
          <Column
            field="feature"
            header="Feature"
            style="width: 13%"
          ></Column>
          <Column
            field="createdBy"
            header="Created By"
            style="width: 13%"
          ></Column>
          <Column
            field="date"
            header="Created At"
            style="width: 15%"
          ></Column>
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
        </DataTable>
      </div>
    </div>
  </div>
  <AddInventory v-if="modal_add" @close="modal_add = false" />
  <UpdateInventory v-if="modal_update" @close="modal_update = false" :data="selectedData"/>
  <DeleteDialog v-if="modal_delete" @close="modal_delete = false" @delete="deleleData()"/>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
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
import AddInventory from "../../components/AddInventory.vue";
import UpdateInventory from "../../components/UpdateInventory.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";

const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const tableData = ref([]);
const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const store = useStore();

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Inventory Data...",
  });

  const usersCollection = query(
    collection(db, "inventory"),
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
    text: "Deleting Inventory Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "inventory", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};

const filters = ref({
  global: { value: null },
  name: { value: null },
  currency: { value: null },
  price: { value: null },
  feature: { value: null },
  createdBy: { value: null },
});
</script>
