<template>
  <div class="relative">
    <TopBar @open="visible = true" />
    <Drawer
      v-model:visible="visible"
      header="Menu"
      :pt="{
        root: { class: 'bg-black text-white border-0 shadow-none' },
        header: { class: 'bg-[#212121] text-white border-0' },
        content: { class: 'bg-[#212121] text-white border-0' },
      }"
    >
      <div class="flex flex-col h-full">
        <span class="text-sm mb-4 text-gray-400 italic">Welcome Back!</span>
        <div class="flex-1 flex flex-col">
          <span class="text-gray-400 text-sm mb-2">Main</span>

          <router-link
            :to="{ name: 'Dashboard' }"
            class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
          >
            <Icon
              class="icon"
              icon="material-symbols:home-outline-rounded"
              width="24"
              height="24"
            />
            <span>Dashboard</span>
          </router-link>

          <div class="mt-8 flex flex-col gap-4">
            <span class="text-gray-400 text-sm">Farm Management</span>
            <router-link
              :to="{ name: 'Revenue Page' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols:receipt-outline-rounded"
                width="24"
                height="24"
              />
              <span>Revenues</span>
            </router-link>
            <router-link
              :to="{ name: 'Expenses Page' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:shadow-minus"
                width="24"
                height="24"
              />
              <span>Expenses</span>
            </router-link>
            <router-link
              :to="{ name: 'Eggs Records' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:egg-sharp"
                width="24"
                height="24"
              />
              <span>Eggs Records</span>
            </router-link>
            <router-link
              :to="{ name: 'Birds Management' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:bookmark-manager"
                width="24"
                height="24"
              />
              <span>Birds Management</span>
            </router-link>
          </div>

          <div class="mt-8 flex flex-col gap-4">
            <span class="text-gray-400 text-sm">Management</span>
            <router-link
              :to="{ name: 'Inventories' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:inventory-2"
                width="24"
                height="24"
              />
              <span>Inventory</span>
            </router-link>
            <router-link
              :to="{ name: 'Employees' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:supervised-user-circle"
                width="24"
                height="24"
              />
              <span>Employees</span>
            </router-link>
            <router-link
              :to="{ name: 'Suppliers' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:sell"
                width="24"
                height="24"
              />
              <span>Suppliers</span>
            </router-link>
          </div>

          <div class="mt-8 flex flex-col gap-4" 
          v-if="store.state.userrole === 'Admin'">
            <span class="text-gray-400 text-sm">User Management</span>
            <router-link
              :to="{ name: 'User Page' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols:user-attributes-outline-rounded"
                width="24"
                height="24"
              />
              <span>Users</span>
            </router-link>
            <router-link
              :to="{ name: 'Companies' }"
              class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-sm font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
            >
              <Icon
                class="icon"
                icon="material-symbols-light:factory-outline"
                width="24"
                height="24"
              />
              <span>Companies</span>
            </router-link>
          </div>
        </div>
        <div class="flex flex-col">
          <!-- <button
            class="w-full cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
          >
            LogOut
          </button> -->
        </div>
      </div>
    </Drawer>
    <div class="relative">
      <router-view />
    </div>
    <SpeedDial
      :model="items"
      direction="up"
      style="position: fixed; left: 2rem; bottom: 2rem"
      :tooltipOptions="{ position: 'left' }"
    />
  </div>
</template>

<script setup>
import TopBar from "../components/TopBar.vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const visible = ref(false);

const items = ref([
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => {
      router.push({ name: "Dashboard" });
    },
  },
  {
    label: "Revenue Page",
    icon: "pi pi-receipt",
    command: () => {
      router.push({ name: "Revenue Page" });
    },
  },
  {
    label: "Expenses Page",
    icon: "pi pi-minus",
    command: () => {
      router.push({ name: "Expenses Page" });
    },
  },
  {
    label: "Eggs Records",
    icon: "pi pi-cart-arrow-down",
    command: () => {
      router.push({ name: "Eggs Records" });
    },
  },
  {
    label: "Birds Management",
    icon: "pi pi-wallet",
    command: () => {
      router.push({ name: "Birds Management" });
    },
  },
  {
    label: "Inventory Page",
    icon: "pi pi-hammer",
    command: () => {
      router.push({ name: "Inventories" });
    },
  },
  {
    label: "Employee Page",
    icon: "pi pi-users",
    command: () => {
      router.push({ name: "Employees" });
    },
  },
  {
    label: "Supplier Page",
    icon: "pi pi-user-plus",
    command: () => {
      router.push({ name: "Suppliers" });
    },
  },
]);
</script>

<style scoped>
.router-link-exact-active {
  background-color: #f6f6f6;
  color: #000;
}
</style>
