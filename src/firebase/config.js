// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWWmTTz4lLoObi6tg_vGNuWII0rXRP0jU",
  authDomain: "manggala-database.firebaseapp.com",
  projectId: "manggala-database",
  storageBucket: "manggala-database.firebasestorage.app",
  messagingSenderId: "555782240860",
  appId: "1:555782240860:web:1ad97d33baea75c680c499"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;