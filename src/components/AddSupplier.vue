<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">Add Supplier</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="Supplier's Name" prop="supplierName">
      <el-input v-model="form.supplierName" placeholder="Enter the Supplier's Name"/>
    </el-form-item>
    <el-form-item label="Contact Name" prop="contactName">
      <el-input v-model="form.contactName" placeholder="Enter the Contact name"/>
    </el-form-item>
    <el-form-item label="Number" prop="number">
      <el-input v-model="form.number" placeholder="Enter Phone number of Supplier"/>
    </el-form-item>
    <el-form-item label="Products" prop="products">
      <el-input-tag v-model="form.products" placeholder="Enter the vaious products they supply" aria-label="Please click the Enter key after input"/>
    </el-form-item>
    
    <el-form-item style="margin-top: 40px; margin-left: 30px; align-content: center; align-items: center; width: 100%; display: flex;">
      <el-button @click="emit('close')">Cancel</el-button>
      <el-button type="primary" @click.prevent="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
    </div>
  </body>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ElLoading, ElMessage } from "element-plus";
import { db } from "../firebase";

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();

const form = reactive({
  companyId: store.state.companyID,
  supplierName: "",
  contactName: "",
  number: "",
  products: [],
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  supplierName: [{ required: true, message: "Supplier's Name is required", trigger: "blur" }],
  contactName: [{ required: true, message: "Contact's Name is required", trigger: "blur" }],
  number: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9+\-\s]+$/,
      message: "Invalid phone number",
      trigger: "blur",
    },
  ],

  products: [
    { required: true, message: "Please select a product", trigger: "change" },
  ]
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Supplier...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      // Check duplicate supplier
      const q = query(
        collection(db, "suppliers"),
        where("supplierName", "==", form.supplierName),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Supplier already exists.");
        return;
      }

      await addDoc(collection(db, "suppliers"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Supplier created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create user");
    } finally {
      loading.close();
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
