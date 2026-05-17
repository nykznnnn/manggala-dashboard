import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Pencairan from "./pages/Pencairan";
import Angsuran from "./pages/Angsuran";
import ClientDetail from "./pages/ClientDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            MAIN APP (WITH LAYOUT)
        ========================= */}
        <Route path="/" element={<MainLayout />}>
          
          {/* DASHBOARD */}
          <Route index element={<Dashboard />} />

          {/* CLIENTS */}
          <Route path="clients" element={<Clients />} />

          {/* PENCAIRAN */}
          <Route path="pencairan" element={<Pencairan />} />

          {/* ANGSURAN */}
          <Route path="angsuran" element={<Angsuran />} />

          {/* DETAIL CLIENT */}
          <Route path="clients/:id" element={<ClientDetail />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}