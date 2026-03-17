"use client";
import Persist from "@/components/auth/persist/Persist";
import PortalSideBar from "@/components/beneficiary/PortalSideBar";
import useAuth from "@/hooks/useAuth";
import { useGetuserAccountDataQuery } from "@/service/beneficiaryPortal/beneficiaryApiSlice";
import {
  selectBeneficiary,
  setBeneficiary,
} from "@/service/beneficiaryPortal/beneficiaryPortalSlice";
import { PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function BeneficiaryLayout({ children }) {
  const { type, user_type, id } = useAuth();

  /* API CALL */
  const beneficiaryData = useGetuserAccountDataQuery({ id, user_type });

  const dispacth = useDispatch();
  const router = useRouter();
  const beneficiary = useSelector(selectBeneficiary);

  useEffect(() => {
    if (beneficiaryData?.data) {
      dispacth(setBeneficiary({ ...beneficiaryData?.data }));
    }
  }, [beneficiaryData?.data]);

  const [isSideBarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (type !== "bns-beneficiary") {
      if (type === "bns-worker") {
        router.replace("/bnsUser");
      } else if (type === "bns-admin") {
        router.replace("/superAdmin");
      }
    }
  }, [router, type]);

  console.log(beneficiary);

  return (
    <Persist>
      <div className="flex  bg-[#F0F9FF]">
        {/* Left Sidebar */}
        <PortalSideBar
          isSidebarOpen={isSideBarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Right Main Content */}
        <div className="flex flex-col w-full overflow-x-hidden">
          <header className="h-16 w-full flex justify-start items-center p-6">
            <PanelLeft
              size={16}
              className="text-black"
              onClick={() => setIsSidebarOpen(!isSideBarOpen)}
            />
          </header>
          {/* Page content */}
          <main className="p-6 w-full overflow-auto">{children}</main>
        </div>
      </div>{" "}
    </Persist>
  );
}
