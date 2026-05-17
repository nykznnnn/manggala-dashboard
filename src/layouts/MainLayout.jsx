import logo from "../assets/logo.png";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();

  // =========================
  // ACTIVE LINK
  // =========================
  function isActive(path) {
  if (path === "/") return location.pathname === "/";

  return location.pathname.startsWith(path + "/") ||
         location.pathname === path;
}

  // =========================
  // NAV ITEMS
  // =========================
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/clients", label: "Clients" },
    { path: "/pencairan", label: "Pencairan" },
    { path: "/angsuran", label: "Angsuran" },
  ];

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO AREA */}
        <div className="logo-area">
          <div className="logo">
            <img src={logo} alt="Manggala Logo" />
          </div>
        </div>

        {/* MENU */}
        <nav className="menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

      </aside>

      {/* MAIN */}
      <main className="content">
        {/* PAGE CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}