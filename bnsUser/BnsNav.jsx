"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const BnsNav = () => {
  const pathname = usePathname();
  const { name, barangay } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(pathname);

  const linkClasses = (path) =>
    `w-full py-2 px-4 rounded-md text-[14px] flex justify-start items-center gap-3 duration-200 
    ${
      pathname === path
        ? "bg-[#4CAF50] text-white"
        : "bg-transparent text-[#64748b] hover:bg-[#E1F1E1] hover:text-black"
    }`;

  const linkClassesWithNestedRoute = (path) =>
    `w-full py-2 px-4 rounded-md text-[14px] flex justify-start items-center gap-3 duration-200 
        ${
          pathname.startsWith(path)
            ? "bg-[#4CAF50] text-white"
            : "bg-transparent text-[#64748b] hover:bg-[#E1F1E1] hover:text-black"
        }`;

  // If not mounted, you can render a skeleton or just return the structure with empty user data
  // to match server HTML as closely as possible, or just render nothing for the user part.
  // Here we'll use empty strings during SSR to avoid mismatch if useAuth returns undefined initially.

  return (
    <div className="h-full flex  flex-col justify-between w-[255px] min-w-[255px] bg-[#F2F8F2]">
      <div>
        {/* BNS LOGO  */}
        <div className="w-full h-[64px] flex justify-center items-center py-4 border-b border-gray-200">
          <h1 className="font-bold text-bns-primary text-xl text-[#4CAF50]  ">
            BNS ASSIST
          </h1>
        </div>

        {/* BNS INFO  */}
        <div className="w-full flex flex-col justify-center items-start p-4 border-b border-gray-200">
          <h5 className="text-[14px] text-[#64748b] mb-1">User</h5>
          <h1 className="font-medium text-bns-primary text-[16px]  ">
            {mounted && name ? name : "User Not Found"}
          </h1>

          <h5 className="text-[12px] text-[#64748b]">
            BNS • {mounted && barangay ? barangay : "Undefined Barangay"}
          </h5>
        </div>

        {/* Nav Links  */}
        <div className="w-full flex flex-col justify-start items-start  p-4 ">
          <h4 className="text-[12px] text-[#64748b] font-medium mb-2">
            Personal
          </h4>
          <Link href={"/bnsUser"} className={linkClasses("/bnsUser")}>
            <i className="bi bi-house"></i>Dashboard
          </Link>

          <Link
            href={"/bnsUser/taskandschedule"}
            className={linkClasses("/bnsUser/taskandschedule")}
          >
            <i className="bi bi-clipboard"></i>Daily Routine
          </Link>
          <Link
            href={"/bnsUser/voiceReport"}
            className={linkClassesWithNestedRoute("/bnsUser/voiceReport")}
          >
            <i className="bi bi-file-earmark-arrow-down"></i>Nutrition Forms
          </Link>
          <h4 className="text-[12px] text-[#64748b] font-medium my-2">
            Beneficiary
          </h4>

          <Link
            href={"/bnsUser/nutritionData"}
            className={linkClasses("/bnsUser/nutritionData")}
          >
            <i className="bi bi-person-arms-up"></i>Children Nutrition
          </Link>
          <Link
            href={"/bnsUser/pregnantData"}
            className={linkClassesWithNestedRoute("/bnsUser/pregnantData")}
          >
            <i className="bi bi-person-standing-dress"></i>PregnantData
          </Link>

          <Link
            href={"/bnsUser/lactatingData"}
            className={linkClassesWithNestedRoute("/bnsUser/lactatingData")}
          >
            <i className="bi bi-person-heart"></i>LactatingtData
          </Link>
          <h4 className="text-[12px] text-[#64748b] font-medium my-2">
            Reminders
          </h4>
          <Link
            href={"/bnsUser/reminders"}
            className={linkClasses("/bnsUser/reminders")}
          >
            <i className="bi bi-bell-fill text-[18px]"></i>Event & Notification
          </Link>
        </div>
      </div>
      {/* Settings Links  */}
      {/* <div className="w-full h-max flex flex-col justify-start items-start  p-2 border-y border-gray-200">
        <Link
          href={"/bnsUser/setting"}
          className={linkClasses("/bnsUser/setting")}
        >
          <i className="bi bi-gear text-[18px]"></i>Settings
        </Link>
      </div> */}
    </div>
  );
};

export default BnsNav;