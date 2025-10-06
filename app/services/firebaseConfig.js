// services/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBhnS7Klo4XcksmSVmD2RtN7ckpz3p9xX8",
  authDomain: "internsync-435f0.firebaseapp.com",
  projectId: "internsync-435f0",
  storageBucket: "internsync-435f0.appspot.com",
  messagingSenderId: "1028469357708",
  appId: "1:1028469357708:web:d936783ea35e74eb114fa9",
  measurementId: "G-N5B7HE8C7K",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const storage = getStorage(app);


export default app;
