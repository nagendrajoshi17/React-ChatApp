import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzfksKpeRlfnzieLIL4ehMkvNdaeCXETM",
  authDomain: "chat-app-57296.firebaseapp.com",
  projectId: "chat-app-57296",
  storageBucket: "chat-app-57296.appspot.com",
  messagingSenderId: "54468723860",
  appId: "1:54468723860:web:19f27aa00ba2bc9876a081"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()