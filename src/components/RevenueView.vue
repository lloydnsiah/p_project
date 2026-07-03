<template>
  <main class="page flex flex-col">
    <div class="view-container">
       <div>
        <div
          class="flex justify-between bg-primary py-2 px-4 rounded-sm items-center text-white"
        >
          <div class="flex flex-col gap-1">
            <h1 class="text-lg font-bold">Revenue Details</h1>
          </div>
          <button
            @click="emit('close')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-sm shadow-sm text-white cursor-pointer bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
        <div class="flex flex-row py-2 px-6 justify-between items-center">
          <div class="flex flex-col gap-2 mt-4">
            <div class="flex flex-row gap-2">
              <span class="font-bold">Created By:</span>
              <span>{{ props.data.createdBy }}</span>
            </div>
            <div class="flex flex-row gap-2">
              <span class="font-bold">Date:</span>
              <span>{{ props.data.date }}</span>
            </div>
            <div class="flex flex-row gap-2">
              <span class="font-bold">Customer Name:</span>
              <span>{{ props.data.customerName }}</span>
            </div>
            <div class="flex flex-row gap-2">
              <span class="font-bold">Payment Method:</span>
              <span class="capitalize">{{ props.data.paymentMethod }}</span>
            </div>
            <div class="flex flex-row gap-2 items-baseline">
              <span class="font-bold">ID:</span>
              <span class="text-sm text-gray-400 italic">{{ props.data.id }}</span>
            </div>
          </div>
          <div class="flex gap-2 items-center italic text-sm">
            <span>Status:</span>
            <span
              class="text-white bg-green-500 py-2 px-8 rounded font-bold capitalize"
              >{{ props.data.status }}</span
            >
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-4 px-6 h-[calc(60vh-200px)] overflow-auto">
          <span class="font-medium text-md italic">Item List</span>
          <DataTable :value="props.data.revenue" tableStyle="min-height: 1rem">
            <Column field="name" header="Name" />
            <Column field="price" header="Price" />
            <Column field="qty" header="Quantity" />
            <Column field="itemTotal" header="Item Total" />
          </DataTable>
          <div class="flex justify-end px-8 py-2 gap-2 items-baseline">
            <span class="font-medium text-md italic">Total: </span>
            <span class="font-bold text-2xl"
              >{{ props.data.total }}
              <small class="font-normal text-sm italic">{{
                props.data.currency
              }}</small></span
            >
          </div>
        </div>

        <div class="py-4 px-6 border border-gray-200 rounded flex flex-col gap-2 mx-4 my-2">
          <span class="font-medium text-sm italic">Comment</span>
          <span class="text-gray-700 text-sm">{{ props.data.comment }} </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { defineEmits } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);
</script>

<style scoped>
@page {
  margin: 15mm;
}
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

.view-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 30px;
  width: 50rem;
  height: 90vh;
  border-radius: 8px;
  overflow: auto;
}
</style>
