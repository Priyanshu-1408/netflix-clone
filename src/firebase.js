// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNOouB8aQwXM8vJoTm0C_kkEEuEmZnCe4",
  authDomain: "netflix-clone-6e34c.firebaseapp.com",
  projectId: "netflix-clone-6e34c",
  storageBucket: "netflix-clone-6e34c.firebasestorage.app",
  messagingSenderId: "740287700230",
  appId: "1:740287700230:web:881b17952eb5ce34489287",
  measurementId: "G-B7YTC37C3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
