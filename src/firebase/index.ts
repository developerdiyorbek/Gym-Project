// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDusrrQ2iFFTkFpvqaep9TB4KPMyeVDstE",
  authDomain: "gym-project-24f84.firebaseapp.com",
  projectId: "gym-project-24f84",
  storageBucket: "gym-project-24f84.appspot.com",
  messagingSenderId: "922781709754",
  appId: "1:922781709754:web:7d3679e277cc56cd551983",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
