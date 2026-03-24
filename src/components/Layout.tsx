import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Layout;
