import { Outlet } from "react-router";
import SideBar from "./components/Sidebar";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="layout">
      <SideBar />

      <div className="content">
        <Header />

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
