<template>
  <div class="relative page">
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-4">Update Revenue Form</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Buyer" prop="customerName">
          <el-input
            v-model="form.customerName"
            placeholder="Name of customer or company"
          />
        </el-form-item>
        <el-form-item label="Currency" prop="currency">
          <el-select
            v-model="form.currency"
            placeholder="Select Currency"
            class="w-full"
          >
            <el-option label="Ghana Cedis" value="GHS" />
            <el-option label="USD" value="USD" />
          </el-select>
        </el-form-item>

        <el-form-item label="Payment Method" prop="paymentMethod">
          <el-select
            v-model="form.paymentMethod"
            placeholder="Select Method"
            class="w-full"
          >
            <el-option label="Cash" value="cash" />
            <el-option label="Mobile Money" value="momo" />
          </el-select>
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-select
            v-model="form.status"
            placeholder="Select Status"
            class="w-full"
          >
            <el-option label="Paid" value="paid" />
            <el-option label="Unpaid" value="unpaid" />
            <el-option label="Draft" value="draft" />
          </el-select>
        </el-form-item>

        <el-form-item label="Comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            placeholder="Add comments..."
          />
        </el-form-item>

        <div class="mx-4">
          <div class="flex justify-between items-center my-4">
            <p class="text-sm text-gray-500">Revenue list</p>
            <el-button @click="addRevenue">Add Revenue</el-button>
          </div>

          <el-form-item
            v-for="(revenue, index) in form.revenue"
            :key="revenue.key"
            :label="'Revenue ' + (index + 1)"
          >
            <div class="flex flex-row items-center gap-2 justify-center w-full">
              <el-autocomplete
                v-model="revenue.name"
                :fetch-suggestions="searchrevenue"
                placeholder="Search revenue"
                @select="(item) => handleSelectService(item, index)"
                class="w-full"
              />
              <el-input-number
                v-model="revenue.qty"
                :min="1"
                class="w-100!"
                 placeholder="Qty"
              />
              <el-input-number
                v-model="revenue.price"
                :min="1"
                :precision="2"
                class="w-100!"
                 placeholder="Unit Price"
              />
              <el-input
                :model-value="revenue.itemTotal.toFixed(2)"
                disabled
                class="w-72!"
              />
              <el-button
                type="danger"
                @click="removeRevenue(revenue)"
                class="w-44!"
              >
                Delete
              </el-button>
            </div>
          </el-form-item>

          <div class="my-4 flex justify-between px-5">
            <span>Total</span>
            <span class="text-xl font-bold">
              {{ grandTotal.toFixed(2) }} GHC
            </span>
          </div>
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
import { reactive, onMounted, ref, computed, watch } from "vue";
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
import { RevenueService } from "../services/RevenueService";

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();
const revenue = ref([]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  companyId: store.state.companyID,
  revenue: [
    {
      key: crypto.randomUUID(),
      name: "",
      price: null,
      qty: null,
      itemTotal: 0,
    },
  ],
  paymentMethod: "",
  customerName: "",
  currency: "",
  status: "",
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

watch(
  () => form.revenue,
  (items) => {
    items.forEach((item) => {
      item.itemTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
    });
  },
  { deep: true }
);

const rules = {
  customerName: [
    {
      required: true,
      message: "Batch name is required",
      trigger: "blur",
    },
  ],

  paymentMethod: [
    {
      required: true,
      message: "Select payment method",
      trigger: "change",
    },
  ],

  status: [
    {
      required: true,
      message: "Select payment status",
      trigger: "change",
    },
  ],

  currency: [
    {
      required: true,
      message: "Select currency",
      trigger: "change",
    },
  ],
};

const handleSelectService = (item, index) => {
  const row = form.revenue[index];

  row.name = item.name;
  row.price = null;
  row.qty = null;
};

const searchrevenue = (queryString, cb) => {
  const results = queryString
    ? revenue.value.filter((item) =>
        item.name.toLowerCase().includes(queryString.toLowerCase()),
      )
    : revenue.value;

  cb(
    results.map((item) => ({
      value: item.name,
      ...item,
    })),
  );
};

const addRevenue = () => {
  form.revenue.push({
    key: crypto.randomUUID(),
    name: "",
    price: null,
    qty: null,
    itemTotal: 0,
  });
};

const calculateItemTotal = (item) => {
  item.itemTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
};

const removeRevenue = (row) => {
  if (form.revenue.length === 1) {
    ElMessage.warning("At least one revenue is required.");
    return;
  }
  const index = form.revenue.indexOf(row);

  if (index !== -1) {
    form.revenue.splice(index, 1);
  }
};

// Fixed: Coerced item.price into a number inside the accumulator
const grandTotal = computed(() => {
  return form.revenue.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
});

onMounted(() => {
  revenue.value = RevenueService.getData();
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Updating Revenues's Details...",
    });

    try {
      // ✅ Update User
      await updateDoc(doc(db, "revenues", props.data.id), {
        ...form,
        total: grandTotal.value,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("Revenues Updated successfully");
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
  width: 70rem;
  max-height: 90vh;
  border-radius: 8px;
  overflow: auto;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
