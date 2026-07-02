<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">Update Inventory Details</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="Inventory Name"  prop="name">
      <el-input v-model="form.name" placeholder="Enter the name of the inventory"/>
    </el-form-item>
    <el-form-item label="Currency" prop="currency">
      <el-select placeholder="GHS" v-model="form.currency">
        <el-option label="Ghana cedi" value="GHS" />
        <el-option label="USD" value="USD" />
      </el-select>
    </el-form-item>
    <el-form-item label="Feature" prop="feature">
      <el-select placeholder="Features" v-model="form.feature">
        <el-option label="Stock In" value="Stock In" />
        <el-option label="Stock Out" value="Stock Out" />
        <el-option label="Other" value="Other" />
      </el-select>
    </el-form-item>
    <el-form-item label="Purchase Price" prop="price">
      <el-input v-model="form.price" placeholder="Enter the purchase price"/>
    </el-form-item>
    <el-form-item label="Type" prop="type">
      <el-select placeholder="Type of Inventory, either Purchased or Rented" v-model="form.type">
        <el-option label="Purchased" value="Purchased" />
        <el-option label="Rental" value="Rental" />
      </el-select>
    </el-form-item>
     <el-form-item label="Comment">
      <el-input type="textarea" v-model="form.comment"/>
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
  currency: "",
  price: "",
  type: "",
  feature: "",
  comment: "",
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
      Object.assign(form, data);
    }
  },
  { immediate: true },
);

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  currency: [{ required: true, message: "Currency is required", trigger: "blur" }],
  feature: [{ required: true, message: "Feature is required", trigger: "blur" }],
  price: [
    { required: true, message: "Amount is required", trigger: "blur" },
    {
      pattern: /^[0-9+.\-\s]+$/,
      message: "Invalid Amount",
      trigger: "blur",
    },
  ],

  type: [
    { required: true, message: "Please select a type", trigger: "change" },
  ]
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating Inventory's Details...",
    });

    try {
      // ✅ Update User
      await updateDoc(doc(db, "inventory", props.data.id), {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("inventory Updated successfully");
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
