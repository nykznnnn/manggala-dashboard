import app from "./config";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc, // 👈 TAMBAH INI
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc, // 👈 TAMBAH INI JUGA
};