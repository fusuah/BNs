"use client";

import FillUpModal from "@/components/bnsUser/voiceReports/FillUpModal";
import { useGetFormsQuery } from "@/service/forms/formsApiSlice";
import Link from "next/link";
import { useState } from "react";

const NutritionForm = () => {
  // Destructure 'data' from the hook result.
  // The API returns { data: [...] }, so 'formsResponse' will be that object.
  const { data: formsResponse, isLoading } = useGetFormsQuery();

  const [view, setView] = useState("BNAP");
  const [modalFormOpen, setModalFormOpen] = useState(false);

  const [formInfo, setFormInfo] = useState({
    formTitle: "",
    formDescription: "",
    formType: "",
  });

  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md pointer-cursor w-[25%] cursor-pointer
        ${
          view === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  /* FORM OPENFING FUNCTION */

  const openForm = (formTitle, formDescription, formType) => {
    setFormInfo({ formTitle, formDescription, formType });

    setModalFormOpen(true);
  };

  const setViewRender = () => {
    if (isLoading) return <p className="text-gray-500">Loading forms...</p>;

    // Safely access the array.
    // If formsResponse is the API payload { data: [...] }, then formsResponse.data is the array.
    // If the slice unwraps it, formsResponse might be the array. We check both.
    const formsList = Array.isArray(formsResponse) 
        ? formsResponse 
        : (formsResponse?.data || []);

    if (!formsList || formsList.length === 0) {
        return <p className="text-gray-500">No forms available.</p>;
    }

    return formsList.map((form) => (
      <div
        className="w-full p-[24px] border border-gray-200 rounded-md mb-4 bg-white"
        key={form._id}
      >
        {/* TITLE */}
        <div className="flex justify-between items-center w-full mb-2">
          <h3 className=" font-semibold text-[18px] flex items-center">
            <i className="bi bi-file-earmark-text mr-[8px] text-[#F05656]"></i>
            {form?.formName}
          </h3>
          <span className="text-[10px] py-0.5 px-2 bg-[#4CAF50] text-white rounded-full uppercase">
            {form?.formType || form?.formName?.slice(0, 3)}
          </span>
        </div>

        {/* CONTENT */}
        <p className="text-[12px] text-[#64748b] mb-[8px]">
          Uploaded on {form?.createdAt ? new Date(form.createdAt).toLocaleDateString() : "N/A"}
        </p>
        <p className="text-[14px] text-gray-700 mb-[24px]">
          {form?.formDescription || "Log form for nutrition education sessions conducted"}
        </p>

        <div className="w-full flex gap-5 justify-end items-center">
          <Link
            href={`/bnsUser/forms/${form?._id}`}
            className="py-[8px] px-[12px] cursor-pointer font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-2 min-w-min text-nowrap text-[14px] duration-200 hover:bg-[#FFC105] hover:text-black transition-colors"
          >
            <i className="bi bi-eye"></i>
            View Form
          </Link>
        </div>
      </div>
    ));
  };
  
  /* RENDERING THE FORM */
  return (
    <>
      <FillUpModal
        modalFormOpen={modalFormOpen}
        setModalFormOpen={setModalFormOpen}
        {...formInfo}
      />
      <div className="w-full p-[24px] border border-gray-200 bg-white rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-[24px] font-semibold text-gray-800">Nutritionist Forms</h3>
                <p className="text-[14px] text-[#64748b]">
                View and access automated forms data
                </p>
            </div>
        </div>

        {/* FORM LIST */}
        <div className="space-y-4">{setViewRender()}</div>
      </div>
    </>
  );
};

export default NutritionForm;