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
        <el-form-item label="Type" prop="type">
          <el-select placeholder="Select the type of Egg" v-model="form.type">
            <el-option label="White" value="White" />
            <el-option label="Brown" value="Brown" />
          </el-select>
        </el-form-item>
        <el-form-item label="Size" prop="size">
          <el-select placeholder="Select the size of Egg" v-model="form.size">
            <el-option label="Unsorted" value="Unsorted" />
            <el-option label="Pullet" value="Pullet" />
            <el-option label="Big" value="Big" />
            <el-option label="Small" value="Small" />
          </el-select>
        </el-form-item>
        <div class="flex items-center justify-center">
          <el-switch
            v-model="value"
            class="mb-2"
            size="small"
            active-text="Record Eggs By Crates"
            inactive-text="Record Eggs By Number"
            @change="handleSwitchChange"
          />
        </div>
        <el-form-item
          label="Eggs Collected (Crates)"
          prop="cratesEntered"
          v-if="value"
        >
          <!-- <el-input-number
            v-model="cratesEntered"
            placeholder="Number of Crates"
            :min="0"
            class="w-full!"
          /> -->
          <div class="flex items-center gap-2 w-full">
            <div class="flex-1">
              <el-input-number
                v-model="cratesEntered"
                placeholder="Crates"
                :min="0"
                class="w-full!"
              />
              <span class="text-xs text-gray-400">Crates (x30)</span>
            </div>

            <span class="font-bold text-gray-400 mb-8">+</span>

            <div class="flex-1">
              <el-input-number
                v-model="extraPiecesEntered"
                placeholder="Loose Eggs"
                :min="0"
                :max="29"
                class="w-full!"
              />
              <span class="text-xs text-gray-400">Loose Pieces</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="Eggs Collected" v-else>
          <el-input-number
            v-model="piecesEntered"
            placeholder="Number of Eggs Collected"
            :min="0"
            class="w-full!"
          />
        </el-form-item>
        <el-form-item label="Broken Eggs" prop="eggsBroken">
          <el-input-number
            v-model="form.eggsBroken"
            placeholder="Number of Eggs broken"
            :min="0"
            class="w-full!"
          />
        </el-form-item>
        <el-form-item label="Damaged Eggs" prop="eggsDamaged">
          <el-input-number
            v-model="form.eggsDamaged"
            placeholder="Spoilt or Damaged Eggs"
            :min="0"
            class="w-full!"
          />
        </el-form-item>

        <el-form-item label="Comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            placeholder="Add comments..."
          />
        </el-form-item>
        <div
          class="my-4 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4"
        >
          <div>
            <p class="text-sm text-gray-500">Net Eggs</p>
            <p class="text-xs text-gray-400">Collected - Broken - Damaged</p>
          </div>

          <span class="text-2xl font-bold">
            {{ totalEggs }}
          </span>
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
const cratesEntered = ref(null);
const extraPiecesEntered = ref(null);
const piecesEntered = ref(null);
const EGGS_PER_CRATE = 30;
const value = ref(false);

// const eggsCollected = computed(() => {
//   return Number(cratesEntered.value || 0) * EGGS_PER_CRATE;
// });

// const totalEggs = computed(() => {
//   if(value.value) {
//     return eggsCollected.value - Number(form.eggsBroken || 0) - Number(form.eggsDamaged || 0);
//   } else {
//     return Number(piecesEntered.value || 0) - Number(form.eggsBroken || 0) - Number(form.eggsDamaged || 0);
//   }
//   // return (
//   //   eggsCollected.value -
//   //   Number(form.eggsBroken || 0) -
//   //   Number(form.eggsDamaged || 0)
//   // );
// });

const eggsCollected = computed(() => {
  if (value.value) {
   const cratesTotal = Number(cratesEntered.value || 0) * EGGS_PER_CRATE;
    const extraTotal = Number(extraPiecesEntered.value || 0);
    return cratesTotal + extraTotal;
  }

  return Number(piecesEntered.value || 0);
});

const totalEggs = computed(() => {
  return (
    eggsCollected.value -
    Number(form.eggsBroken || 0) -
    Number(form.eggsDamaged || 0)
  );
});

const form = reactive({
  companyId: store.state.companyID,
  batchName: "",
  type: "",
  size: "",
  eggsBroken: null,
  eggsDamaged: null,
  comment: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

// Clear unused input state when switching modes
const handleSwitchChange = () => {
  if (value.value) {
    piecesEntered.value = null;
  } else {
    cratesEntered.value = null;
    extraPiecesEntered.value = null;
  }
  formRef.value?.clearValidate();
};

const rules = {
  batchName: [
    { required: true, message: "Batch Name is required", trigger: "blur" },
  ],
  type: [{ required: true, message: "Type is required", trigger: "blur" }],
  size: [{ required: true, message: "Size is required", trigger: "blur" }],
  cratesEntered: [
    {
      validator: (rule, value, callback) => {
        if (cratesEntered.value <= 0) {
          callback(new Error("Please enter at least 1 crate"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
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
        where("companyId", "==", store.state.companyID),
        where("batchName", "==", form.batchName),
        where("date", "==", form.date),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Batch already exists.");
        return;
      }

      if (totalEggs.value < 0) {
        ElMessage.error(
          "Broken and damaged eggs cannot exceed total eggs collected.",
        );
        return;
      }

      await addDoc(collection(db, "eggs"), {
        ...form,
        eggsCollected: eggsCollected.value,
        totalEggs: totalEggs.value,
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
