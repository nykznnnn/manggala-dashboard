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

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

import { motion } from "framer-motion";

import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/clients", label: "Clients", icon: <Users size={20} /> },
    { path: "/pencairan", label: "Pencairan", icon: <Wallet size={20} /> },
    { path: "/angsuran", label: "Angsuran", icon: <CreditCard size={20} /> },
    { path: "/simulasi-pencairan", label: "Simulasi", icon: <Calculator size={20} /> },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // =========================
  // smoother minimal motion
  // =========================
  const sidebar = {
    hidden: { x: -20, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -6 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  const page = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="main-layout">

      {/* SIDEBAR */}
      <motion.aside
        className="sidebar"
        variants={sidebar}
        initial="hidden"
        animate="show"
      >

        {/* TOP BRAND */}
        <div className="sidebar-top">
          <div className="brand-logo">
            <img src={logo} alt="Manggala" />
          </div>

          <div className="brand-text">
            <h2>MANGGALA</h2>
            <span>Data Management System</span>
          </div>
        </div>

        {/* MENU */}
        <motion.nav className="sidebar-menu">
          {navItems.map((itemData) => (
            <motion.div key={itemData.path} variants={item}>
              <Link
                to={itemData.path}
                className={`sidebar-link ${
                  isActive(itemData.path) ? "active" : ""
                }`}
              >
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">{itemData.icon}</span>
                  <span>{itemData.label}</span>
                </div>

                <span className="sidebar-arrow">
  <ChevronRight size={14} />
</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* FOOTER (PIN BAWAH) */}
        <div className="sidebar-footer">
          <motion.button
            onClick={handleLogout}
            className="logout-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </div>

      </motion.aside>

      {/* CONTENT */}
      <motion.main
        className="main-content"
        variants={page}
        initial="hidden"
        animate="show"
      >
        <div className="main-content-wrapper">
          <Outlet />
        </div>
      </motion.main>

    </div>
  );
}