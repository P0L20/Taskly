import { NavLink } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  FolderOpen,
  Settings,
} from "lucide-react";
import logo from "../assets/logo-expand.png";

export default function SideBar() {
  const navBars = [
    {
      to: "/",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
      to: "/calendar",
      name: "Calendar",
      icon: <CalendarDays size={20} strokeWidth={1.5} />,
    },
    {
      to: "/projects",
      name: "Projects",
      icon: <FolderOpen size={20} strokeWidth={1.5} />,
    },
    {
      to: "/settings",
      name: "Settings",
      icon: <Settings size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="nav-links-container sidebar">
      <div className="top-section">
        <div className="logo-wrapper">
          <img className="logo" src={logo} alt="logo" />
        </div>
      </div>

      <nav className="nav-links">
        {navBars.map((bar) => (
          <NavLink className="links" key={bar.to} to={bar.to}>
            <span>{bar.icon}</span>
            <span className="name-bar">{bar.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
