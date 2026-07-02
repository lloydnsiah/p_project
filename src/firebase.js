import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3CfvImFLov8nWhmm3d7JTdjiSfw2E-HU",
  authDomain: "pmsystem-8280d.firebaseapp.com",
  projectId: "pmsystem-8280d",
  storageBucket: "pmsystem-8280d.firebasestorage.app",
  messagingSenderId: "526337691749",
  appId: "1:526337691749:web:defc4874350e7a3380368c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app)
export const auth = getAuth(app)