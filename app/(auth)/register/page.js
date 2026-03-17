"use client";
import AdminLogIn from "@/components/auth/logIn/AdminLogIn";
import BeneficiaryLogIn from "@/components/auth/logIn/BeneficiaryLogIn";
import BnsWorkerLogIn from "@/components/auth/logIn/BnsWorkerLogIn";
import AdminCoordinatorRegister from "@/components/auth/register/AdminCoordinatorRegister";
import RegisterBNSWorker from "@/components/auth/register/RegisterBNSWorker";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [formView, setFormView] = useState("bnsworker");

  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md w-1/2 cursor-pointer
        ${
          formView === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  const formRender = () => {
    if (formView.toLowerCase() === "bnsworker") {
      return <RegisterBNSWorker />;
    } else if (formView.toLowerCase() === "admin") {
      return <AdminCoordinatorRegister />;
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

      <h1 className="text-[30px] font-bold ">Create your account</h1>
      <p className="text-sm text-gray-600 mb-[24px]">
        Join BNS Assist to streamline your nutrition work
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
            Admin/Coordinator
          </button>
        </div>

        {formRender()}
      </div>

      <Link
        href={".."}
        className="text-sm text-gray-600 mb-[24px] flex justify-center items-center gap-1"
      >
        {" "}
        <i className="bi bi-arrow-left"></i> <span>Back to Home </span>
      </Link>
    </div>
  );
};

export default Register;
