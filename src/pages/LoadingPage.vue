<template>
  <div class="bg-[#212121] h-screen flex items-center justify-center relative">
    <div class="loader-wrapper">
      <span class="loader-letter">G</span>
      <span class="loader-letter">e</span>
      <span class="loader-letter">n</span>
      <span class="loader-letter">e</span>
      <span class="loader-letter">r</span>
      <span class="loader-letter">a</span>
      <span class="loader-letter">t</span>
      <span class="loader-letter">i</span>
      <span class="loader-letter">n</span>
      <span class="loader-letter">g</span>

      <div class="loader"></div>
    </div>
    <div class="absolute top-5 left-0 right-0 w-full text-gray-400 flex flex-col items-center">
      <span class="text-2xl italic">Welcome: {{ currentUserData.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import { getAuth, onAuthStateChanged,} from "firebase/auth";
import {  signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const name = ref("");
const email = ref("");
const currentUserData = ref({});
const currentUserStatus = ref(null);
 const auth = getAuth();

let unsubscribeUser = null;

onMounted(() => {


  onAuthStateChanged(auth, (user) => {
    if (user) {
      name.value = user.email.split("@")[0];
      email.value = user.email;

      loadUser(user.email); // ✅ pass string
    } else {
      currentUserData.value = null;
    }
  });
});

const loadUser = (email) => {
  // cleanup old listener
  if (unsubscribeUser) unsubscribeUser();

  const q = query(
    collection(db, "users"),
    where("email", "==", email),
    limit(1),
  );

  unsubscribeUser = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        currentUserData.value = {
          id: userDoc.id,
          ...userDoc.data(),
        };
        store.commit("SET_USERDATA", currentUserData.value);
        currentUserStatus.value = currentUserData.value.status;
        setTimeout(() => {
          move()
        }, 5000);
      } else {
        ElMessage.error("No user document found for this email.");
        currentUserData.value = null;
      }
    },
    (error) => {
      console.error("Error loading user:", error);
    },
  );
};

const move = () => {

  if(currentUserStatus.value){
     router.push({ name: "Dashboard"})
  }else{
   logout();
  }
};

const logout = () => {
  signOut(auth)
    .then(() => {
     router.push({ name: 'Home' })
    })
    .catch((error) => {
      alert(error.message);
    });
};


onUnmounted(() => {
  if (unsubscribeUser) unsubscribeUser();
});
</script>


<style scoped>
/* From Uiverse.io by dexter-st */ 
.loader-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  font-family: "Inter", sans-serif;
  font-size: 1.2em;
  font-weight: 300;
  color: white;
  border-radius: 50%;
  background-color: transparent;
  user-select: none;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: transparent;
  animation: loader-rotate 2s linear infinite;
  z-index: 0;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(90deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 30px 0 #ad5fff inset,
      0 60px 60px 0 #471eec inset;
  }
  50% {
    transform: rotate(270deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 10px 0 #d60a47 inset,
      0 40px 60px 0 #311e80 inset;
  }
  100% {
    transform: rotate(450deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 30px 0 #ad5fff inset,
      0 60px 60px 0 #471eec inset;
  }
}

.loader-letter {
  display: inline-block;
  opacity: 0.4;
  transform: translateY(0);
  animation: loader-letter-anim 2s infinite;
  z-index: 1;
  border-radius: 50ch;
  border: none;
}

.loader-letter:nth-child(1) {
  animation-delay: 0s;
}
.loader-letter:nth-child(2) {
  animation-delay: 0.1s;
}
.loader-letter:nth-child(3) {
  animation-delay: 0.2s;
}
.loader-letter:nth-child(4) {
  animation-delay: 0.3s;
}
.loader-letter:nth-child(5) {
  animation-delay: 0.4s;
}
.loader-letter:nth-child(6) {
  animation-delay: 0.5s;
}
.loader-letter:nth-child(7) {
  animation-delay: 0.6s;
}
.loader-letter:nth-child(8) {
  animation-delay: 0.7s;
}
.loader-letter:nth-child(9) {
  animation-delay: 0.8s;
}
.loader-letter:nth-child(10) {
  animation-delay: 0.9s;
}

@keyframes loader-letter-anim {
  0%,
  100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: scale(1.15);
  }
  40% {
    opacity: 0.7;
    transform: translateY(0);
  }
}



</style>
