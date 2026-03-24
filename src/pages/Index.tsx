import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default Index;
