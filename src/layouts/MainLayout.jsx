import logo from "../assets/logo.png";

import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  Calculator,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================
  // ACTIVE MENU
  // =========================================

  function isActive(path) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  }

  // =========================================
  // NAVIGATION MENU
  // =========================================

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      path: "/clients",
      label: "Clients",
      icon: <Users size={20} />,
    },

    {
      path: "/pencairan",
      label: "Pencairan",
      icon: <Wallet size={20} />,
    },

    {
      path: "/angsuran",
      label: "Angsuran",
      icon: <CreditCard size={20} />,
    },

    {
      path: "/simulasi-pencairan",
      label: "Simulasi Pencairan",
      icon: <Calculator size={20} />,
    },
  ];

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-layout">
      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <aside className="sidebar">
        {/* LOGO */}

        <div className="sidebar-top">
          <div className="brand-logo">
            <img src={logo} alt="Manggala Group" />
          </div>

          <div className="brand-text">
            <h2>MANGGALA GROUP</h2>
            <span>Finance Dashboard</span>
          </div>
        </div>

        {/* MENU */}

        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <div className="sidebar-link-left">
                <span className="sidebar-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </div>

              <ChevronRight size={16} />
            </Link>
          ))}
        </nav>

        {/* FOOTER */}

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}

      <main className="main-content">
        <div className="main-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}