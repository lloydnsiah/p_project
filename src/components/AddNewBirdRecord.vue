<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">
        Add Stock
      </h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Category" prop="category">
          <el-select placeholder="New Stock or Dead Birds or Sold" v-model="form.category">
            <el-option label="New Stock" value="New Stock" />
            <el-option label="Sold" value="Sold" />
            <el-option label="Dead" value="Dead" />
          </el-select>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select placeholder="New Stock or Dead Birds or Sold" v-model="form.type">
            <el-option label="Broilers" value="Broilers" />
            <el-option label="Layers" value="Layers" />
            <el-option label="Cockerels" value="Cockerels" />
          </el-select>
        </el-form-item>
        <el-form-item label="Batch Name" prop="batchName">
          <el-input v-model="form.batchName" placeholder="Enter Batch Name"/>
        </el-form-item>
        <el-form-item label="Number of Birds" prop="numberofbirds">
          <el-input-number v-model="form.numberofbirds" placeholder="Enter number of Stock" class="w-full!"/>
        </el-form-item>
        <el-form-item label="Cause of Death" prop="role" v-if="form.category === 'Dead'">
          <el-select placeholder="Cause of death." v-model="form.causeofDeath">
            <el-option label="Disease" value="Disease" /> 
            <el-option label="Heat" value="Heat" /> 
            <el-option label="Injury" value="Injury" />
            <el-option label="Unknown" value="Unknown" />
            <el-option label="Others" value="Others" />
          </el-select>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input  type="textarea" v-model="form.comment"/>
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
  category: "",
  type: "",
  batchName: "",
  numberofbirds: null,
  causeofDeath: "",
  comment: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  category: [{ required: true, message: "Category is required", trigger: "blur" }],
  type: [{ required: true, message: "Type is required", trigger: "blur" }],
  batchName: [{ required: true, message: "Batch Name is required", trigger: "blur" }],
  numberofbirds: [
    { required: true, message: "Number is required", trigger: "blur" },
    {
      pattern: /^[0-9\s]+$/,
      message: "Invalid number",
      trigger: "blur",
    },
  ],
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Employee Details...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      // Check duplicate supplier
      const q = query(
        collection(db, "birds"),
        where("batchName", "==", form.batchName),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Batch already exists.");
        return;
      }

      await addDoc(collection(db, "birds"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Employee created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create employees");
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
  background-color: #fff;
  padding: 30px;
  width: 40rem;
  border-radius: 8px;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
