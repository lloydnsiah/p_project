<template>
  <div class="relative page">
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-4">Update Record</h2>
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
          <el-button type="success" @click.prevent="onSubmit">Update</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
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
const value = ref(false);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const EGGS_PER_CRATE = 30;
const cratesEntered = ref(null);
const piecesEntered = ref(null);
const extraPiecesEntered = ref(null);

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
  eggsBroken: 0,
  eggsDamaged: 0,
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
      // Initialize crates entered from the existing total eggs collected count
      if (data.eggsCollected) {
        cratesEntered.value = Math.floor(data.eggsCollected / EGGS_PER_CRATE);
        extraPiecesEntered.value = data.eggsCollected % EGGS_PER_CRATE;
        piecesEntered.value = data.eggsCollected; // Also set piecesEntered for consistency
      }
    }
  },
  { immediate: true },
);

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

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating Details...",
    });

    try {
      // ✅ Update User
      await updateDoc(doc(db, "eggs", props.data.id), {
        ...form,
        eggsCollected: eggsCollected.value,
        totalEggs: totalEggs.value,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("Updated successfully");
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
