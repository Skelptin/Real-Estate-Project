// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mestate-23600.firebaseapp.com",
    projectId: "mestate-23600",
    storageBucket: "mestate-23600.appspot.com",
    messagingSenderId: "747808379354",
    appId: "1:747808379354:web:561f050e8c1a9ee4e730e3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);