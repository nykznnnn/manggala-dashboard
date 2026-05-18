import logo from "../assets/logo.png";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
console.log("MAIN LAYOUT RENDER");
  // =========================
  // ACTIVE LINK
  // =========================
  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
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

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO */}
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
              className={isActive(item.path) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>

    </div>
  );
}