<!-- <template>
  <div class="h-screen p-6 gap-2 flex flex-col bg-white">
    <div
      class="flex-[4] background flex relative flex-col items-center justify-center rounded-4xl p-8 text-white text-2xl font-light shadow-lg"
    >
      <button
        @click="model_login = true"
        class="absolute top-4 right-20 px-12 py-1.5 rounded-full text-lg bg-primary text-secondary hover:bg-[#09b2e0]
         hover:text-white transition-all hover:translate-y-1 duration-300 z-99"
      >
        Login
      </button>
      <h1 class="text-8xl font-bold text-center mb-4">
        Smart Poultry Farm <br />
        Management System
      </h1>
      <p class="text-xl max-w-4xl mt-8 text-center leading-relaxed italic">
        Streamline your poultry operations with a centralized platform designed
        to monitor flock performance, record daily activities, track income and
        expenses, manage inventory, and generate insightful reports.
      </p>
    </div>

    <div class="flex-1">
      <div class="grid grid-cols-4 h-full gap-4">
        <div
          class="bg-[#36454F] rounded-2xl flex items-center p-2 text-white text-2xl font-light shadow-lg"
        >
          <div class="flex-3 flex flex-col gap-2 p-4">
            <span class="font-bold">Professional</span>
            <span class="text-sm text-gray-300">
              Streamline your poultry operations with a centralized platform
              designed to monitor flock performance, record daily activities,
              track income and expenses, manage inventory, and generate
              reports.
            </span>
          </div>
        </div>
        <div
          class="bg-black rounded-2xl flex items-center justify-center text-white text-2xl font-light shadow-lg"
        >
          <div class="flex-3 flex flex-col gap-2 p-4">
            <span class="font-bold"
              >Manage Your Poultry Farm</span
            >
            <span class="text-sm text-gray-300">
              Keep track of bird populations, mortality rates, feed consumption,
              egg production, sales, and farm expenses in one place. Our system
              provides real-time insights to help you maximize efficiency and
              profitability.
            </span>
          </div>
        </div>
        <div
          class="bg-[#36454F] rounded-2xl flex items-center justify-center text-white text-2xl font-light shadow-lg"
        >
          <div class="flex-3 flex flex-col gap-2 p-4">
            <span class="font-bold">Multi-Farm Focus</span>
            <span class="text-sm text-gray-300">
              Whether you manage a single farm or multiple poultry operations,
              our platform helps you monitor flock health, record transactions,
              track production, and access comprehensive reports.
            </span>
          </div>
        </div>
        <div
          class="bg-black rounded-2xl flex items-center justify-center text-white text-2xl font-light shadow-lg"
        >
          <div class="flex-3 flex flex-col gap-2 px-2">
            <span class="font-bold">PoultryPro Management System</span>
            <span class="text-sm text-gray-300">
              A smart solution for tracking production, mortality, feed usage,
              sales, expenses, and overall farm performance. Everything you need
              to manage your poultry business efficiently.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoginComponent v-if="model_login" @close="model_login = false" />
</template> -->

<template>
  <main>
    <div class="h-full w-2/3 p-8 flex flex-col items-center justify-center">
      <h1 class="text-8xl font-bold text-center mb-2">
        Smart Poultry Farm <br />
        Management System
      </h1>
      <p class="text-xl max-w-4xl mt-8 text-center leading-relaxed italic">
        Streamline your poultry operations with a centralized platform designed
        to monitor flock performance, record daily activities, track income and
        expenses, manage inventory, and generate insightful reports.
      </p>

      <button
        @click="model_login = true"
        class="px-28 py-4 mt-8 rounded-full text-xl text-white bg-primary hover:bg-secondary
         hover:text-white transition-all hover:translate-y-1 duration-300"
      >
        Login
      </button>
    </div>
  </main>
  <LoginComponent v-if="model_login" @close="model_login = false" />
</template>

<script setup>
import { ref } from "vue";
import LoginComponent from "../components/LoginComponent.vue";
const model_login = ref(false);
</script>

<style scoped>
main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 3.5rem;
  gap: 0.5rem;
  background-color: white;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.6)),
    url("../images/bg_image_1.jpg");
  background-size: cover;
  background-position: center;
  align-items: end;
  justify-content: center;
}

.neu-button {
  background-color: #e0e0e0;
  border-radius: 50px;
  box-shadow:
    inset 4px 4px 10px #bcbcbc,
    inset -4px -4px 10px #ffffff;
  color: #4d4d4d;
  cursor: pointer;
  font-size: 18px;
  padding: 15px 40px;
  transition: all 0.2s ease-in-out;
  border: 2px solid rgb(206, 206, 206);
}

.neu-button:hover {
  box-shadow:
    inset 2px 2px 5px #bcbcbc,
    inset -2px -2px 5px #ffffff,
    2px 2px 5px #bcbcbc,
    -2px -2px 5px #ffffff;
}

.neu-button:focus {
  outline: none;
  box-shadow:
    inset 2px 2px 5px #bcbcbc,
    inset -2px -2px 5px #ffffff,
    2px 2px 5px #bcbcbc,
    -2px -2px 5px #ffffff;
}
</style>
