// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdXfMariTtXNVKGVo4i0sb7CloQL11aRQ",
  authDomain: "ai-trip-planner-1be62.firebaseapp.com",
  projectId: "ai-trip-planner-1be62",
  storageBucket: "ai-trip-planner-1be62.appspot.com", // 🔧 Fixed typo here (was `.app`, should be `.appspot.com`)
  messagingSenderId: "679899508246",
  appId: "1:679899508246:web:a44b1cc081450344298f37",
  measurementId: "G-T5HL2LGHPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
