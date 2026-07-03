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
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-sm shadow-sm text-white cursor-pointer bg-orange 
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Add Record
      </button>
    </div>
    <div class="flex-1 flex flex-col gap-1 mx-2">
      <span class="text-gray-400 text-2xl ml-4 italic">Records List</span>
      <div v-if="!tableData.length" class="card">
        <el-empty description="No data available" />
      </div>
      <div v-else class="card">
        <DataTable
          :value="tableData"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10]"
          tableStyle="min-width: 50rem"
        >
          <Column field="category" header="Category" style="width: 15%"></Column>
          <Column
            field="type"
            header="Type"
            style="width: 15%"
          ></Column>
          <Column field="batchName" header="Batch Number" style="width: 20%"></Column>
          <Column
            field="numberofbirds"
            header="Number of Birds"
            style="width: 15%"
          ></Column>
          <Column
            field="comment"
            header="Comment"
            style="width: 20%"
          >
          <template #body="slotProps">
            <div>
              <span><b> {{ slotProps.data.causeofDeath }}</b>: {{ slotProps.data.comment }} </span>
            </div>
          </template>

        </Column>
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
  <AddNewBirdRecord v-if="modal_add" @close="modal_add = false" />
  <UpdateBirdManagement v-if="modal_update" @close="modal_update = false" :data="selectedData" />
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
import UpdateEmployee from "../../components/UpdateEmployee.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import UpdateBirdManagement from "../../components/UpdateBirdManagement.vue";

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
    text: "Loading Birds Data...",
  });

  const usersCollection = query(
    collection(db, "birds"),
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
    text: "Deleting Employee's Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "birds", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};


const customers = ref();
</script>
