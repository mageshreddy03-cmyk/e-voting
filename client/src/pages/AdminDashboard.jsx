import { useState, useEffect } from "react";
import {
  UserPlus,
  Settings,
  BarChart3,
  LogOut,
  List,
  Menu,
  X
} from "lucide-react";
import AddCandidate from "./AddCandidate";
import ElectionControl from "./ElectionControl";
import Results from "./Results";
import CandidateList from "../components/CandidateList";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CitizensLIst from "../components/CitizensLIst";

function AdminDashboard() {
  const [active, setActive] = useState("add");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("admin"))) {
      navigate("/admin");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("admin");
    toast.success("Logout successful...");
    navigate("/admin");
  };

  const renderContent = () => {
    switch (active) {
      case "add":
        return <AddCandidate />;
      case "candidate-list":
        return <CandidateList />;
      case "citizens-list":
        return <CitizensLIst/>
      case "control":
        return <ElectionControl />;
      case "results":
        return <Results />;
      default:
        return <AddCandidate />;
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100 relative">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}  
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-xl font-bold">Admin</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-8 hidden md:block">
          Admin Panel
        </h1>

        <SidebarButton
          icon={<UserPlus size={18} />}
          label="Add Candidate"
          active={active === "add"}
          onClick={() => {
            setActive("add");
            setSidebarOpen(false);
          }}
        />

        <SidebarButton
          icon={<List size={18} />}
          label="Candidate List"
          active={active === "candidate-list"}
          onClick={() => {
            setActive("candidate-list");
            setSidebarOpen(false);
          }}
        />
        <SidebarButton
          icon={<List size={18} />}
          label="Citizens List"
          active={active === "citizens-list"}
          onClick={() => {
            setActive("citizens-list");
            setSidebarOpen(false);
          }}
        />

        <SidebarButton
          icon={<Settings size={18} />}
          label="Election Control"
          active={active === "control"}
          onClick={() => {
            setActive("control");
            setSidebarOpen(false);
          }}
        />

        <SidebarButton
          icon={<BarChart3 size={18} />}
          label="Results"
          active={active === "results"}
          onClick={() => {
            setActive("results");
            setSidebarOpen(false);
          }}
        />

        <div className="mt-auto pt-6">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">

        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <h2 className="font-semibold">Admin Panel</h2>
          <div />
        </div>

        <div className="flex-1  overflow-y-auto">
          <div className="bg-white p-5 md:p-10 shadow-md min-h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-3 w-full text-left
      ${
        active
          ? "bg-indigo-600 text-white shadow-lg"
          : "hover:bg-slate-800 text-gray-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default AdminDashboard;