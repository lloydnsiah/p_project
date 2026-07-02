<template>
  <div class="relative page">
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-4">New Record Form</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Batch Name" prop="batchName">
          <el-input
            v-model="form.batchName"
            placeholder="Add a name for the batch"
          />
        </el-form-item>
        <el-form-item label="Eggs Collected" prop="eggsCollected">
          <el-input-number
            v-model="form.eggsCollected"
            placeholder="Number of Eggs Produced"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="Broken Eggs" prop="eggsBroken">
          <el-input-number
            v-model="form.eggsBroken"
            placeholder="Number of Eggs broken"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="Damaged Eggs" prop="eggsDamaged">
          <el-input-number
            v-model="form.eggsDamaged"
            placeholder="Spoilt or Damaged Eggs"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="Comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            placeholder="Add comments..."
          />
        </el-form-item>

        <div class="my-4 flex justify-between px-5">
          <span>Total</span>
          <span class="text-xl font-bold" 
          > {{ totalEggs }} eggs </span>
        </div>

        <el-form-item>
          <el-button @click="emit('close')">Close</el-button>
          <el-button type="primary" @click.prevent="onSubmit">Create</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from "vue";
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

const totalEggs = computed(() => {
  return (
    Number(form.eggsCollected) -
    Number(form.eggsBroken) -
    Number(form.eggsDamaged)
  );
});

const form = reactive({
  companyId: store.state.companyID,
  batchName: "",
  eggsCollected: 0,
  eggsBroken: 0,
  eggsDamaged: 0,
  totalEggs: 0,
  comment: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  batchName: [
    { required: true, message: "Batch Name is required", trigger: "blur" },
  ],
  number: [
    { required: false },
    { type: "number", message: "Must be a number" },
  ],
  eggsCollected: [
    { required: true, message: "Enter eggs collected", trigger: "blur" },
  ],
  eggsBroken: [
    { required: true, message: "Enter broken eggs", trigger: "blur" },
  ],
  eggsDamaged: [
    { required: true, message: "Enter damaged eggs", trigger: "blur" },
  ],
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Record...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      // Check duplicate supplier
      const q = query(
        collection(db, "eggs"),
        where("batchName", "==", form.batchName),
        where("date", "==", form.date),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Batch already exists.");
        return;
      }

      const total =
        Number(form.eggsCollected) -
        Number(form.eggsBroken) -
        Number(form.eggsDamaged);

      if (total < 0) {
        ElMessage.error(
          "Broken and damaged eggs cannot exceed eggs collected.",
        );
        loading.close();
        return;
      }

      await addDoc(collection(db, "eggs"), {
        ...form,
        totalEggs: total,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Egg record created successfully.");
      formRef.value.resetFields();
      emit("close");
    } catch (error) {
      ElMessage.error("Failed to create egg record.");
    } finally {
      loading.close();
    }
  });
};
</script>

<style scoped>
.page {
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
  max-height: 90vh;
  border-radius: 8px;
  overflow: auto;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
