<template>
  <body>
    <div
      class="group select-none w-120 flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-xl"
    >
      <div class="">
        <div class="text-center p-3 flex-auto justify-center">
          <div class="flex items-center justify-center">
            <Icon
              icon="material-symbols:logout"
              width="100"
              height="100"
              style="color: #fb2c36"
              class="cursor-pointer transition-all hover:translate-y-1 duration-300"
            />
          </div>

          <h2 class="text-4xl font-bold py-4 my-4 text-gray-200">Log Out?</h2>
          <p class="font-bold text-lg text-gray-500 px-2">
            Do you really want to log out?
          </p>
        </div>
        <div class="p-2 mt-2 text-center space-x-1 md:block">
          <button
            @click="emit('close')"
            class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
          >
            Cancel
          </button>
          <button
            @click="emit('delete')"
            class="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { defineEmits } from "vue";

const emit = defineEmits(["close", "delete"]);
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
