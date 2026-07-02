<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">Add New User</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter User's name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Enter Email address" />
        </el-form-item>
        <el-form-item label="Number" prop="number">
          <el-input v-model="form.number" placeholder="Enter User's number" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select placeholder="User's Role" v-model="form.role">
            <el-option label="Admin" value="Admin" />
            <el-option label="Supervisor" value="Supervisor" />
            <el-option label="User" value="User" />
            <el-option label="Staff" value="Staff" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item label="Company" prop="companyId">
          <el-autocomplete
            v-model="state2"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="Search company"
            @select="handleSelect"
          />
        </el-form-item>

        <el-form-item
          style="
            margin-top: 40px;
            margin-left: 30px;
            align-content: center;
            align-items: center;
            width: 100%;
            display: flex;
          "
        >
          <el-button @click="emit('close')">Cancel</el-button>
          <el-button type="success" @click.prevent="onSubmit">Update</el-button>
        </el-form-item>
      </el-form>
    </div>
  </body>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from "vue";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import {
  serverTimestamp,
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ElLoading, ElMessage } from "element-plus";
import { db } from "../firebase";

const store = useStore();
const emit = defineEmits(["close"]);
const companyData = ref([]);
const state2 = ref("");
const formRef = ref();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  companyId: "",
  companyName: "",
  email: "",
  name: "",
  number: "",
  role: "",
  status: false,
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  name: [{ required: true, message: "Full name is required", trigger: "blur" }],
  email: [
    {
      required: true,
      message: "Email address is required",
      trigger: "blur",
    },
    {
      pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      message: "Enter a valid email address (e.g. email@gmail.com)",
      trigger: ["blur", "change"],
    },
  ],

  number: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9+\-\s]+$/,
      message: "Invalid phone number",
      trigger: "blur",
    },
  ],

  role: [
    { required: true, message: "Please select a role", trigger: "change" },
  ],

  companyId: [
    { required: true, message: "Please select a company", trigger: "change" },
  ],
};

const querySearch = (queryString, cb) => {
  const results = queryString
    ? companyData.value.filter((company) =>
        company.name.toLowerCase().includes(queryString.toLowerCase()),
      )
    : companyData.value;

  cb(results);
};

watch(
  () => props.data,
  (data) => {
    if (data) {
      Object.assign(form, data);

      // Show the selected company in the autocomplete
      state2.value = data.companyName || "";
    }
  },
  { immediate: true },
);

const handleSelect = (item) => {
  form.companyId = item.companyId;
  form.companyName = item.name;
  state2.value = item.name;
};

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading company Data...",
  });

  const usersCollection = collection(db, "companies");

  onSnapshot(usersCollection, (snapshot) => {
    companyData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      value: doc.data().name, // displayed in autocomplete
      ...doc.data(),
    }));
    state2.value = form.companyName || "";
    loadingInstance.close();
  });
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating User...",
    });

    try {
      // ✅ Update User
      await updateDoc(doc(db, "users", props.data.id), {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("User Updated successfully");
      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to User");
    } finally {
      loadingInstance.close();
    }
  });
};
</script>

<style scoped>
body {
  position: fixed;
  top: 0;
  left: 0;
  background: #000000b9;
  z-index: 50;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 30px;
  width: 40rem;
  border-radius: 8px;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
