"use client";
import ProfileBnsUser from "@/components/bnsUser/setting/ProfileBnsUser";
import SystemBnsUser from "@/components/bnsUser/setting/SystemBnsUser";
import Link from "next/link";
import { useState } from "react";

const Settings = () => {
  const [view, setview] = useState("profile");

  const linkClasses = (path) =>
    `w-full py-2 px-4  text-[14px] flex justify-start items-center gap-3 duration-200
    ${
      view === path
        ? "bg-[#f1f5f9] border-l-5 border-[#4CAF50]"
        : "bg-transparent text-[#64748b] hover:bg-[#E1F1E1] hover:text-black"
    }`;
  return (
    <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
      <h1 className="text-3xl font-bold ">Settings</h1>
      <p className="text-[16px] text-[#64748b] mb-2 ">
        Manage your profile and system settings
      </p>

      {/* MAIN CONTENT */}
      <div className="w-full flex gap-6">
        {/* MINI NAV */}

        <div className="w-[20%] border border-gray-200 rounded-md flex flex-col p-4">
          <button
            className={linkClasses("profile")}
            onClick={() => setview("profile")}
          >
            <i className="bi bi-person"></i> Profile
          </button>

          {/* <button
              className={linkClasses("system")}
              onClick={() => setview("system")}
            >
              <i className="bi bi-gear"></i>System
            </button> */}
        </div>

        {/* CONTENT */}

        <div className="w-[80%] border border-gray-200 rounded-md ">
          {view === "profile" ? (
            <ProfileBnsUser />
          ) : view === "system" ? (
            <SystemBnsUser />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="h-[24px]"></div>
    </div>
  );
};

export default Settings;
