"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Bell,
  Menu,
  ChevronLeft,
  User,
  ClipboardList,
  LogOut // Import LogOut icon
} from "lucide-react";
import clsx from "clsx";
import useAuth from "@/hooks/useAuth"; 
import { useGetuserAccountDataQuery, useGetChildrenByMotherMutation } from "@/service/beneficiaryPortal/beneficiaryApiSlice";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logOut } from "@/service/auth/authSlice"; // Import logOut action

export default function PortalSideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { id, user_type, name } = useAuth(); // Assuming 'name' is available in token/auth
  const [mounted, setMounted] = useState(false);
  const [myChildren, setMyChildren] = useState([]);
  const dispatch = useDispatch(); // Initialize dispatch

  // Query to get full user profile if name isn't in auth token or to ensure we have correct name
  const { data: userData } = useGetuserAccountDataQuery(
    { id, user_type },
    { skip: !id || !user_type }
  );

  const [getChildren, { isLoading: isLoadingChildren }] = useGetChildrenByMotherMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch children when we have the mother's name
  useEffect(() => {
    const fetchChildren = async () => {
      const motherName = userData?.data?.name || name;
      // Only fetch if user is NOT a child themselves (so they are a guardian/mother)
      if (motherName && user_type !== 'children') {
        try {
          const res = await getChildren(motherName).unwrap();
          if (res?.data) {
            setMyChildren(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch children", error);
        }
      }
    };

    fetchChildren();
  }, [userData, name, user_type]);

  const handleLogout = () => {
    dispatch(logOut()); // Dispatch logout action
    router.push("/login"); // Redirect to login page
  };

  const menuItems = [
    {
      href: "/beneficiary",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      href: "/beneficiary/appointments",
      icon: <Calendar size={20} />,
      label: "Appointments",
    },
    {
        href: "/beneficiary/nutritionRecords",
        icon: <ClipboardList size={20} />,
        label: "Nutrition Records",
    },
    {
      href: "/beneficiary/chatAssistance",
      icon: <MessageCircle size={20} />,
      label: "Chat Assistance",
    },
    {
      href: "/beneficiary/notifications",
      icon: <Bell size={20} />,
      label: "Notifications",
    },
    // Only show Guardian Profile if the user is NOT a child
    // This prevents the issue where a logged-in child sees their own profile on the "Guardian Profile" page
    ...(user_type !== 'children' ? [{
        href: "/beneficiary/guardianProfile",
        icon: <User size={20} />,
        label: "Guardian Profile",
    }] : []),
  ];

  return (
    <aside
      className={clsx(
        "bg-[#FAFAFA] text-gray-700 h-screen p-4 flex flex-col justify-start sticky top-0 transition-all duration-300 border-r border-gray-200",
        // HYDRATION FIX: Use a stable initial width or check mounted
        (mounted ? isSidebarOpen : true) ? "w-64" : "w-20"
      )}
    >
      {/* Top header & toggle */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className={clsx("flex items-center gap-2 overflow-hidden transition-all", (mounted ? isSidebarOpen : true) ? "w-auto" : "w-0")}>
           <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">B</div>
           <span className="font-bold text-lg whitespace-nowrap">Beneficiary</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
        >
          {(mounted ? isSidebarOpen : true) ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors whitespace-nowrap group relative",
                isActive
                  ? "bg-green-50 text-green-700 font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              )}
              title={!(mounted ? isSidebarOpen : true) ? label : ""}
            >
              <div className={clsx("shrink-0", isActive ? "text-green-600" : "text-gray-500 group-hover:text-gray-900")}>
                  {icon}
              </div>
              <span className={clsx("text-sm transition-opacity duration-300", (mounted ? isSidebarOpen : true) ? "opacity-100" : "opacity-0 w-0 hidden")}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Dynamic Children Links */}
        {mounted && isSidebarOpen && myChildren.length > 0 && (
            <div className="mt-6">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">My Children</p>
                {myChildren.map(child => (
                    <div
                        key={child._id}
                        className="w-full cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 mb-1"
                        onClick={() => router.push(`/beneficiary/childProfile/${child._id}`)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 uppercase">
                                {child.name.substring(0, 2)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{child.name}</p>
                                <p className="text-xs text-gray-500">View Profile</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </nav>

      {/* Self Child Profile Link (if user IS the child) */}
      {mounted && isSidebarOpen && id && user_type === 'children' && (
        <div
            className="w-full mt-4 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            onClick={() => router.push(`/beneficiary/childProfile/${id}`)}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                    ME
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">My Profile</p>
                    <p className="text-xs text-gray-500">View Details</p>
                </div>
            </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center gap-3 p-3 rounded-lg transition-colors whitespace-nowrap group relative hover:bg-red-50 text-gray-600 hover:text-red-600"
          )}
          title={!(mounted ? isSidebarOpen : true) ? "Log Out" : ""}
        >
          <div className="shrink-0">
            <LogOut size={20} />
          </div>
          <span className={clsx("text-sm transition-opacity duration-300 font-medium", (mounted ? isSidebarOpen : true) ? "opacity-100" : "opacity-0 w-0 hidden")}>
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}