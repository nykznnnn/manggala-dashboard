import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Pencairan from "./pages/Pencairan";
import Angsuran from "./pages/Angsuran";
import ClientDetail from "./pages/ClientDetail";
import SimulasiPencairan from "./pages/SimulasiPencairan";

import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="clients"
          element={<Clients />}
        />

        <Route
          path="pencairan"
          element={<Pencairan />}
        />

        <Route
          path="angsuran"
          element={<Angsuran />}
        />

        <Route
          path="clients/:id"
          element={<ClientDetail />}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

        <Route
          path="simulasi-pencairan"
          element={<SimulasiPencairan />}
        />
      </Route>

    </Routes>
  );
}