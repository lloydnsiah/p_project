<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">Update Employee Details</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="Employee's Name" prop="name">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="Phone Number" prop="number">
      <el-input v-model="form.number"/>
    </el-form-item>
    <el-form-item label="Emergency Contact Name">
      <el-input v-model="form.emergencyContact"/>
    </el-form-item>
    <el-form-item label="Emergency Contact Number">
      <el-input v-model="form.emergencyContactNumber"/>
    </el-form-item>
    <el-form-item label="Role" prop="role">
      <el-input v-model="form.role"/>
    </el-form-item>
    <el-form-item label="Start Date" prop="startDate">
          <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
        </el-form-item>

         <el-form-item label="End Date" prop="endDate">
          <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
        </el-form-item>
        <el-form-item label="Card Type" prop="cardType">
          <el-select placeholder="Select card type" v-model="form.cardType">
            <el-option label="Ghana Card" value="Ghana Card" /> 
            <el-option label="NHIS" value="NHIS" /> 
            <el-option label="Driver License" value="Driver License" />
            <el-option label="SSNIT Card" value="SSNIT Card" />
            <el-option label="Others" value="Others" />
          </el-select>
        </el-form-item>

        <el-form-item label="Card Number" prop="cardNumber">
          <el-input v-model="form.cardNumber" />
        </el-form-item>
    
    <el-form-item style="margin-top: 40px; margin-left: 30px; align-content: center; align-items: center; width: 100%; display: flex;">
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
const formRef = ref();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  companyId: store.state.companyID,
  name: "",
  number: "",
  emergencyContact: "",
  emergencyContactNumber: "",
  role: "",
  startDate: "",
  endDate: "",
  cardType: "",
  cardNumber: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

watch(
  () => props.data,
  (data) => {
    if (data) {
      Object.assign(form, {
        ...data,
        startDate: data.startDate?.toDate
          ? data.startDate.toDate()
          : data.startDate,
        endDate: data.endDate?.toDate
          ? data.endDate.toDate()
          : data.endDate,
      });
    }
  },
  { immediate: true }
);

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
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
  startDate: [
    { required: true, message: "Start date is required", trigger: "change" },
  ],
};


const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating Employee's Details...",
    });

    try {
      // ✅ Update User
      await updateDoc(doc(db, "employees", props.data.id), {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("Employee Updated successfully");
      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to Update");
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
  background-color: #FFF;
  padding: 30px;
  width: 40rem;
  border-radius: 8px;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
