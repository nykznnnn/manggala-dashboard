import { db } from "./firestore";
import { doc, updateDoc } from "firebase/firestore";

// update sebagian data client
export async function updateClient(clientId, payload) {
  const ref = doc(db, "clients", clientId);
  await updateDoc(ref, payload);
}