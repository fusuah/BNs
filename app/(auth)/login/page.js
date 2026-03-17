"use client";
import AdminLogIn from "@/components/auth/logIn/AdminLogIn";
import BeneficiaryLogIn from "@/components/auth/logIn/BeneficiaryLogIn";
import BnsWorkerLogIn from "@/components/auth/logIn/BnsWorkerLogIn";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const LogIn = () => {
  /* LOGIN PERSIST */
  const router = useRouter();

  const { type } = useAuth();
  // console.log(type);
  
  useEffect(() => {
    // Only redirect if there is a logged-in user type.
    // If type is null/undefined (not logged in), stay on this page.
    if (type === "bns-worker") {
      router.replace("/bnsUser");
    } else if (type === "bns-admin") {
      router.replace("/superAdmin");
    } else if (type === "bns-beneficiary") {
      router.replace("/beneficiary");
    }
  }, [router, type]);

  /* */ const [formView, setFormView] = useState("bnsworker");
  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md w-[33.33%] cursor-pointer
        ${
          formView === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  const formRender = () => {
    if (formView.toLowerCase() === "bnsworker") {
      return <BnsWorkerLogIn />;
    } else if (formView.toLowerCase() === "admin") {
      return <AdminLogIn />;
    } else if (formView.toLowerCase() === "beneficiary") {
      return <BeneficiaryLogIn />;
    }
  };
  return (
    <div className="w-full h-screen overflow-auto bg-white flex justify-start pt-[48px] items-center flex-col text-black">
      {/* LOGO */}

      <div className="flex gap-2 mb-[24px]">
        <span className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-md flex items-center justify-center text-white font-bold ">
          B
        </span>
        <h1 className="text-2xl font-bold ">BNS Assist</h1>
      </div>

      <h1 className="text-[30px] font-bold ">Welcome back</h1>
      <p className="text-sm text-gray-600 mb-[24px]">
        {" "}
        Sign in to your account to continue
      </p>

      {/* FORMS */}

      <div className="w-full max-w-[445px] rounded-lg shadow-sm border border-gray-200 mb-4 ">
        {/* MINI NAV */}
        <div className="w-full flex bg-[#F1F5F9] rounded-md p-2 mb-[16px]">
          <button
            className={linkClasses("bnsworker")}
            onClick={() => setFormView("bnsworker")}
          >
            BNS Worker
          </button>
          <button
            className={linkClasses("admin")}
            onClick={() => setFormView("admin")}
          >
            Admin
          </button>

          <button
            className={linkClasses("beneficiary")}
            onClick={() => setFormView("beneficiary")}
          >
            Beneficiary
          </button>
        </div>

        {formRender()}
      </div>

      <Link
        href={"/"}
        className="text-sm text-gray-600 mb-[24px] flex justify-center items-center gap-1"
      >
        {" "}
        <i className="bi bi-arrow-left"></i> <span>Back to Home </span>
      </Link>
    </div>
  );
};

export default LogIn;