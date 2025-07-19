"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgH8qM7dwgarGYByyl78rDSP5qZxAgEeU",
  authDomain: "mi-uni-9b5a3.firebaseapp.com",
  projectId: "mi-uni-9b5a3",
  storageBucket: "mi-uni-9b5a3.firebasestorage.app",
  messagingSenderId: "218758680875",
  appId: "1:218758680875:web:c7966345a495dea9b1b56e",
  measurementId: "G-2RFV63LP77"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);