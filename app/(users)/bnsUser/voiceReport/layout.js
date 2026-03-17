"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const VoiceReportLayout = ({ children }) => {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md
        ${
          pathname === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;
  return (
    <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
      {/* Voice Reports Title Box */}
      <div className="w-full flex flex-col mb-[32px] ">
        <h1 className="text-3xl font-bold ">Nutrition Forms</h1>
        <p className="text-[16px] text-[#64748b] mb-2 ">
          Record and manage forms from the municipal nutritionist
        </p>
      </div>

      {/* Mini Nav */}

      

      <div className="w-full"> {children} </div>

      <div className="h-[24px]"></div>
    </div>
  );
};

export default VoiceReportLayout;
