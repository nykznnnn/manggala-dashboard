import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}