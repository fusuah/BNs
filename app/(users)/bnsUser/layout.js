"use client";

import React, { useState, useEffect } from "react";
import BnsNav from "@/components/bnsUser/BnsNav";
import NotifBnsUser from "@/components/bnsUser/nav-components/NotifBnsUser";
import UserAccount from "@/components/bnsUser/nav-components/UserAccount";
import Persist from "@/components/auth/persist/Persist";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const BnsMainLayout = ({ children }) => {
  const { type, name, id } = useAuth();
  const [notifOpen, setnotifOpen] = useState(false);
  const [userAccountOpen, setuserAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (type !== "bns-worker") {
      if (type === "bns-admin") {
        router.replace("/superAdmin");
      } else if (type === "bns-beneficiary") {
        router.replace("/beneficiary");
      }
    }
  }, [router, type]);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };

  return (
    <Persist>
      <div className="h-screen w-full flex overflow-hidden font-poppins text-black">
        <BnsNav />

        <div className="w-full h-full flex flex-col flex-1 overflow-auto">
          {/* Header  */}
          <header className="w-full h-[64px] border-b border-gray-200 bg-white flex justify-between items-center px-6 sticky top-0 z-50">
            <h2></h2>

            {/* Profile & Notif  */}
            <div className="flex justify-center items-center gap-4 relative">
              <div
                className="relative"
                onClick={() => {
                  setnotifOpen((prev) => !prev);
                  setuserAccountOpen(false);
                }}
              >
                {/* <i className="bi bi-bell-fill text-[24px] text-[#4CAF50] cursor-pointer"></i> */}
                {/* <div className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-0 right-0 border border-white"></div> */}
                <NotifBnsUser notifOpen={notifOpen} />
              </div>

              {/* Profile Info & Dropdown */}
              <div className="relative">
                <h1 className="font-medium text-bns-primary text-[16px] text-right ">
                  {mounted && name ? name : "User Not Found"}
                </h1>
              </div>

              <div
                className=" h-[40px] w-[40px] bg-green-400 rounded-full relative cursor-pointer"
                onClick={() => {
                  setuserAccountOpen((prev) => !prev);
                  setnotifOpen(false);
                }}
              >
                <div className="w-full h-full rounded-full flex justify-center items-center text-xl text-white font-medium select-none">
                  {mounted && name ? getInitials(name) : ""}
                </div>
                <UserAccount userAccountOpen={userAccountOpen} />
              </div>
            </div>
          </header>

          {/* Children  */}
          {children}
        </div>
      </div>
    </Persist>
  );
};

export default BnsMainLayout;