"use client";
import React from "react";
import { useGetOneLactatingDataQuery } from "@/service/lactatingData/lactatingDataApiSlice";
import UpdateRecordLactating from "@/components/bnsUser/lactatingData/UpdateRecordLactating";

function Page({ params }) {
    // Unwrapping params using React.use() (Compatible with Next.js 15+ patterns)
    const { id } = React.use(params);
    
    // Fetch data using the hook
    const { data: lactatingUser, isLoading, isError } = useGetOneLactatingDataQuery(id);
    
    console.log("Fetched Lactating User Data:", lactatingUser);

    return (
        <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
            {/* Name Title*/}
            <div className="w-full flex flex-col mb-[32px] ">
                <h1 className="text-3xl font-bold ">Update/Upload Data Records</h1>
                <p className="text-[16px] text-[#64748b] mb-2 ">
                    Edit and Add new Record for Monthly Checkups
                </p>
            </div>

            {/* Conditional Rendering to handle loading/undefined states */}
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
            ) : !lactatingUser ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500">
                    <p>No record found.</p>
                </div>
            ) : (
                <UpdateRecordLactating data={lactatingUser} />
            )}
        </div>
    );
}

export default Page;