import { createContext, useEffect, useState } from "react";
import { db } from "../firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";

export const ClientsContext = createContext({
  clients: [],
});

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClients(data);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        setClients([]); // fallback biar UI gak crash
      }
    );

    return () => unsub();
  }, []);

  return (
    <ClientsContext.Provider value={{ clients }}>
      {children}
    </ClientsContext.Provider>
  );
}