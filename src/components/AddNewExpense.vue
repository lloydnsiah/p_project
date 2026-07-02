<template>
  <div class="relative page">
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-4">New Expense Form</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-splitter>
          <el-splitter-panel size="50%">
            <div class="mx-4">
              <el-form-item label="Batch Name" prop="batchName">
                <el-input
                  v-model="form.batchName"
                  placeholder="Add name to expense"
                />
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

              <el-form-item label="Payment Status" prop="paymentStatus">
                <el-select
                  v-model="form.paymentStatus"
                  placeholder="Select Status"
                  class="w-full"
                >
                  <el-option label="Paid" value="paid" />
                  <el-option label="Unpaid" value="unpaid" />
                  <el-option label="Draft" value="draft" />
                </el-select>
              </el-form-item>

              <el-form-item label="Company/Name">
                <el-input
                  v-model="form.companyName"
                  placeholder="Add company or individuals name"
                />
              </el-form-item>

              <el-form-item label="Comment">
                <el-input
                  v-model="form.comment"
                  type="textarea"
                  placeholder="Add comments..."
                />
              </el-form-item>
            </div>
          </el-splitter-panel>

          <el-splitter-panel :min="200" :resizable="false">
            <div class="mx-4">
              <div class="flex justify-between items-center my-4">
                <p class="text-sm text-gray-500">Expenses</p>
                <el-button @click="addExpense">Add Expense</el-button>
              </div>

              <el-form-item
                v-for="(expense, index) in form.expenses"
                :key="expense.key"
                :label="'Expense ' + (index + 1)"
              >
                <div
                  class="flex flex-row items-center gap-2 justify-center w-full"
                >
                  <el-autocomplete
                    v-model="expense.name"
                    :fetch-suggestions="searchExpenses"
                    placeholder="Search expense"
                    @select="(item) => handleSelectService(item, index)"
                    class="w-full"
                  />
                  <el-input-number
                    v-model="expense.price"
                    placeholder="Price"
                    :min="0"
                    class="w-90!"
                  />
                  <el-button type="danger" @click="removeExpense(expense)">
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
          </el-splitter-panel>
        </el-splitter>

        <el-form-item class="mt-5">
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
import { ExpensesService } from "../services/ExpensesService";

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();
const expenses = ref([]);

const form = reactive({
  companyId: store.state.companyID,
  batchName: "",
  expenses: [
    {
      key: 1,
      name: "",
      price: null,
    },
  ],
  paymentMethod: "",
  paymentStatus: "draft",
  currency: "",
  companyName: "",
  comment: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  batchName: [
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

  paymentStatus: [
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

  companyName: [
    {
      required: true,
      message: "Company name is required",
      trigger: "blur",
    },
  ],
};

const handleSelectService = (item, index) => {
  form.expenses[index].name = item.name;
  form.expenses[index].price = item.price;
};

const searchExpenses = (queryString, cb) => {
  const results = queryString
    ? expenses.value.filter((item) =>
        item.name.toLowerCase().includes(queryString.toLowerCase()),
      )
    : expenses.value;

  cb(
    results.map((item) => ({
      value: item.name,
      ...item,
    })),
  );
};

const addExpense = () => {
  form.expenses.push({
    key: Date.now() + Math.random(), // Added randomness to prevent key collisions if double clicked quickly
    name: "",
    price: null,
  });
};

const removeExpense = (row) => {
  if (form.expenses.length === 1) {
    ElMessage.warning("At least one expense is required.");
    return;
  }

  const index = form.expenses.indexOf(row);

  if (index !== -1) {
    form.expenses.splice(index, 1);
  }
};

// Fixed: Coerced item.price into a number inside the accumulator
const grandTotal = computed(() => {
  return form.expenses.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );
});

onMounted(() => {
  expenses.value = ExpensesService.getData();
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    console.log("Data", form);

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Expense ...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      // // Check duplicate supplier
      // const q = query(collection(db, "expenses"), where("number", "==", form.number));

      // const snapshot = await getDocs(q);

      // if (!snapshot.empty) {
      //   loading.close();
      //   ElMessage.error("Employee already exists.");
      //   return;
      // }

      await addDoc(collection(db, "expenses"), {
        ...form,
        total: grandTotal.value,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Expense created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create expenses");
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
  width: 80rem;
  max-height: 90vh;
  border-radius: 8px;
  overflow: auto;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
