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

        <!-- <div class="flex items-center justify-center mb-4">
          <el-switch
            v-model="isCrateMode"
            size="small"
            active-text="Record Eggs By Crates"
            inactive-text="Record Eggs By Number"
            @change="handleSwitchChange"
          />
        </div> -->

        <!-- Mode 1: Crates + Loose Pieces -->
        <el-form-item
          label="Eggs Collected (Crates)"
          prop="cratesEntered"
          v-if="isCrateMode"
        >
          <div class="flex items-center gap-2 w-full">
            <div class="flex-1">
              <el-input-number
                v-model="form.cratesEntered"
                placeholder="Crates"
                :min="0"
                class="w-full!"
              />
              <span class="text-xs text-gray-400">Crates (x30)</span>
            </div>

            <span class="font-bold text-gray-400 mb-4">+</span>

            <div class="flex-1">
              <el-input-number
                v-model="form.piecesEntered"
                placeholder="Loose Eggs"
                :min="0"
                :max="29"
                class="w-full!"
              />
              <span class="text-xs text-gray-400">Loose Pieces</span>
            </div>
          </div>
        </el-form-item>

        <!-- Mode 2: Loose Pieces Only -->
        <el-form-item label="Eggs Collected" prop="piecesEntered" v-else>
          <el-input-number
            v-model="form.piecesEntered"
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
import { reactive, ref, computed, watch } from "vue";
import { defineEmits, defineProps } from "vue";
import { useStore } from "vuex";
import { serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { ElLoading, ElMessage } from "element-plus";
import { db } from "../firebase";

const store = useStore();
const emit = defineEmits(["close"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const formRef = ref();
const EGGS_PER_CRATE = 30;

const form = reactive({
  companyId: store.state.companyID,
  batchName: "",
  type: "",
  size: "",
  eggsBroken: 0,
  eggsDamaged: 0,
  cratesEntered: null,
  piecesEntered: null,
  comment: "",
  recordingMethod: "crates",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

// Computed boolean sync for mode toggle
const isCrateMode = computed({
  get: () => form.recordingMethod === "crates",
  set: (val) => {
    form.recordingMethod = val ? "crates" : "pieces";
  },
});

// Populate state from incoming props
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(form, {
        batchName: newData.batchName || "",
        type: newData.type || "",
        size: newData.size || "",
        eggsBroken: newData.eggsBroken || 0,
        eggsDamaged: newData.eggsDamaged || 0,
        comment: newData.comment || "",
        recordingMethod: newData.recordingMethod || "crates",
        date: newData.date || form.date,
      });

      // Calculate crates and loose pieces from total collected eggs
      if (newData.recordingMethod === "pieces") {
        form.piecesEntered = newData.eggsCollected || 0;
        form.cratesEntered = null;
      } else {
        const total = newData.eggsCollected || 0;
        form.cratesEntered = Math.floor(total / EGGS_PER_CRATE);
        form.piecesEntered = total % EGGS_PER_CRATE;
      }
    }
  },
  { immediate: true },
);

const eggsCollected = computed(() => {
  if (isCrateMode.value) {
    const cratesTotal = Number(form.cratesEntered || 0) * EGGS_PER_CRATE;
    const extraTotal = Number(form.piecesEntered || 0);
    return cratesTotal + extraTotal;
  }
  return Number(form.piecesEntered || 0);
});

const totalEggs = computed(() => {
  return (
    eggsCollected.value -
    Number(form.eggsBroken || 0) -
    Number(form.eggsDamaged || 0)
  );
});

const handleSwitchChange = () => {
  form.cratesEntered = null;
  form.piecesEntered = null;
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
        if (isCrateMode.value && !form.cratesEntered && !form.piecesEntered) {
          callback(new Error("Enter at least crates or loose pieces"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  piecesEntered: [
    {
      validator: (rule, value, callback) => {
        if (!isCrateMode.value && (value === null || value === undefined)) {
          callback(new Error("Please enter number of eggs collected"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    if (totalEggs.value < 0) {
      ElMessage.error(
        "Broken and damaged eggs cannot exceed total eggs collected.",
      );
      return;
    }

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating Details...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      await updateDoc(doc(db, "eggs", props.data.id), {
        ...form,
        eggsCollected: eggsCollected.value,
        cratesEntered: Number(form.cratesEntered || 0),
        piecesEntered: Number(form.piecesEntered || 0),
        totalEggs: totalEggs.value,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("Updated successfully");
      emit("close");
    } catch (error) {
      ElMessage.error("Failed to update record.");
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
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
}
</style>