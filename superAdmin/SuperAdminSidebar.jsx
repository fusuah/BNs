"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  ChevronLeft,
  Users,
  UserCheck,
  LogOut,
  FileBarChart,
  ClipboardList
} from "lucide-react";
import clsx from "clsx";
import { useSendLogoutMutation } from "@/service/auth/autApiSlice";

export default function SuperAdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Use the mutation hook for logout
  const [sendLogout] = useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed: ", err);
      // Fallback to login page even if API fails
      router.push("/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/superAdmin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "All BNS Users",
      path: "/superAdmin/users",
      icon: <Users size={20} />,
    },
    {
      name: "User Approvals",
      path: "/superAdmin/approvals",
      icon: <UserCheck size={20} />,
    },
    {
      name: "Beneficiaries",
      path: "/superAdmin/beneficiaryApprovals",
      icon: <ClipboardList size={20} />, 
    },
    {
      name: "Daily Diary",
      path: "/superAdmin/diary",
      icon: <Activity size={20} />,
    },
    {
      name: "Reports & Forms", // New Item
      path: "/superAdmin/reports",
      icon: <FileText size={20} />,
    },
    {
      name: "Feedback & Surveys",
      path: "/superAdmin/feedback",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "Settings",
      path: "/superAdmin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={clsx(
        "bg-green-800 text-white h-screen p-4 flex flex-col justify-between sticky top-0 transition-all duration-500",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div>
        {/* Top header & toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className={clsx("flex items-center gap-2 overflow-hidden transition-all", isSidebarOpen ? "w-auto" : "w-0")}>
             {/* <FileBarChart size={24} className="shrink-0" /> */}
             <div className="text-xl font-bold whitespace-nowrap">
               BNS ASSIST
             </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-300 p-1 rounded hover:bg-green-700 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-lg transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white font-semibold text-green-800 shadow-sm"
                    : "hover:bg-green-700 text-green-50"
                )}
                title={!isSidebarOpen ? item.name : ""}
              >
                <div className="shrink-0">{item.icon}</div>
                <span className={clsx("text-sm transition-opacity duration-300", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-green-700 pt-4 mt-4">
        <button
          onClick={handleLogout}
          className={clsx(
            "flex items-center gap-3 p-3 rounded-lg transition-all w-full text-left whitespace-nowrap",
            "hover:bg-red-600 text-white"
          )}
          title={!isSidebarOpen ? "Sign Out" : ""}
        >
          <div className="shrink-0"><LogOut size={20} /></div>
          <span className={clsx("text-sm transition-opacity duration-300", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden")}>
            Sign Out
          </span>
        </button>
        
        {isSidebarOpen && (
          <div className="text-xs text-center mt-4 text-green-200 opacity-70">
            © 2025 BNS ASSIST
          </div>
        )}
      </div>
    </aside>
  );
}