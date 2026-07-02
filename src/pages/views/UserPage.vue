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
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-sm shadow-sm text-white cursor-pointer bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Add User
      </button>
    </div>
    <div class="flex-1 flex flex-col gap-1 mx-2">
      <span class="text-gray-400 text-2xl ml-4 italic">User List</span>
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
          <Column field="name" header="Full Name" style="width: 20%"></Column>
          <Column field="email" header="Email" style="width: 20%"></Column>

          <Column
            field="number"
            header="Phone Number"
            style="width: 15%"
          ></Column>
          <Column field="role" header="Role" style="width: 15%"></Column>
          <Column
            field="companyName"
            header="Company"
            style="width: 20%"
          ></Column>
          <Column header="Status" style="width: 10%">
            <template #body="slotProps">
              <Tag
                v-if="slotProps.data.status"
                value="Active"
                severity="success"
              />
              <Tag v-else value="Deactivated" severity="danger" />
            </template>
          </Column>
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
  <AddNewUser v-if="modal_add" @close="modal_add = false" />
  <UpdateUser
    v-if="modal_update"
    @close="modal_update = false"
    :data="selectedData"
  />
  <DeleteDialog
    v-if="modal_delete"
    @close="modal_delete = false"
    @delete="deleleData()"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { ElLoading } from "element-plus";
import { CustomerService } from "../../services/CustomerService";
import AddNewUser from "../../components/AddNewUser.vue";
import UpdateUser from "../../components/UpdateUser.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const tableData = ref([]);
const data = ref([]);
const route = useRoute();
const selectedData = ref(null);

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Users Data...",
  });

  const usersCollection = collection(db, "users");

  onSnapshot(usersCollection, (snapshot) => {
    tableData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loadingInstance.close();
    console.log("Data", tableData.value);
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
    text: "Deleting User Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "users", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};
</script>
