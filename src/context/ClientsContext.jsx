import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  db,
} from "../firebase/config";

import {
  AuthContext,
} from "./AuthContext";

export const ClientsContext =
  createContext({
    clients: [],
  });

export function ClientsProvider({
  children,
}) {
  const [clients, setClients] =
    useState([]);

  const {
    user,
    loading: authLoading,
  } = useContext(AuthContext);

  useEffect(() => {

    // tunggu auth selesai
    if (authLoading) return;

    // kalau belum login
    if (!user) {
      setClients([]);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "clients"),

      (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setClients(data);
      },

      (error) => {
        console.error(
          "Firestore snapshot error:",
          error
        );

        setClients([]);
      }
    );

    return () => unsub();

  }, [user, authLoading]);

  return (
    <ClientsContext.Provider
      value={{ clients }}
    >
      {children}
    </ClientsContext.Provider>
  );
}