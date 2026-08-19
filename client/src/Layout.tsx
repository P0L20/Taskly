import { Outlet } from "react-router";
import SideBar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect, useState } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  return (
    <div className={`layout ${isCollapse ? "collapse-sidebar" : ""}`}>
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setIsCollapse(!isCollapse)}
        isCollapse={isCollapse}
      />
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
