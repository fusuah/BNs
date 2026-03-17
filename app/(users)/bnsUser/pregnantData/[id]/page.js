"use client";
import React from "react";
import UpdateRecordPregnant from "@/components/bnsUser/pregnantData/UpdateRecordPregnant";
import { useGetOneDataPregnantQuery } from "@/service/pregnantData/pregnantDataApiSlice";

const SpecificDataPage = ({ params }) => {
  // Unwrapping params using React.use() (Compatible with Next.js 15+ patterns)
  const { id } = React.use(params);

  // Using the hook to fetch data. Added isError to handle the 400 Bad Request case.
  const { data: oneData, isLoading, isError } = useGetOneDataPregnantQuery(id);

  console.log("Fetched Data for ID " + id + ":", oneData);

  return (
    <div className="h-full w-full max-w-[1220px] max-h-[1000px] mx-auto px-4 py-6">
      {/* Title Section */}
      <div className="w-full flex flex-col mb-[32px]">
        <h1 className="text-3xl font-bold">Update/Upload Data Records</h1>
        <p className="text-[16px] text-[#64748b] mb-2">
          Edit and Add new Record for Monthly Checkups
        </p>
      </div>

      {/* Conditional Rendering Logic:
          1. Loading: Show spinner.
          2. Error: Show error message (handles the 400 Bad Request).
          3. No Data: Show 'No record found' to prevent passing undefined.
          4. Success: Render the form with valid data.
      */}
      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Loading record details...</p>
            </div>
        </div>
      ) : isError ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-red-500">
            <i className="bi bi-exclamation-circle text-2xl mb-2"></i>
            <p>Unable to load data. Please check the ID or try again.</p>
        </div>
      ) : !oneData ? (
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
            <p>No record found.</p>
        </div>
      ) : (
        <UpdateRecordPregnant updateData={oneData} />
      )}
    </div>
  );
};

export default SpecificDataPage;