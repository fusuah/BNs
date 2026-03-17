"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetFormsByIdQuery } from "@/service/forms/formsApiSlice";
import ReactMarkdown from "react-markdown";
import { useGetChildrenNutritionDataQuery } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import remarkGfm from "remark-gfm";

const PageGoogleSheetEmbed = () => {
  const { data: childData } = useGetChildrenNutritionDataQuery();
  const { id } = useParams();

  // RTK Query hook
  const { data: responseData, isLoading } = useGetFormsByIdQuery(id);
  
  // Extract form data (handling wrapper { data: ... } or direct object)
  const formData = responseData?.data || responseData;

  const [view, setView] = useState("form");

  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md cursor-pointer
        ${
          view === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  const setBg = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "#22c55e"; // green
      case "overweight":
        return "#f59e0b"; // yellow
      case "severely underweight":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500">Loading form...</div>;

  return (
    <div className="w-full h-screen pt-8 px-4 overflow-auto bg-[#F9FAFB]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {formData?.formName || "Form Detail"}
      </h1>

      {/* Mini Nav */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-[#E2E8F0] rounded-md p-1 inline-flex gap-1">
            <button className={linkClasses("form")} onClick={() => setView("form")}>
            Form View
            </button>
            <button
            className={linkClasses("Documentation")}
            onClick={() => setView("Documentation")}
            >
            Documentation
            </button>
            <button className={linkClasses("data")} onClick={() => setView("data")}>
            Data Table
            </button>
        </div>

        <div className="bg-[#E2E8F0] rounded-md p-2 inline-block hover:bg-gray-300 transition-colors">
            <Link
            href={`/bnsUser/voiceReport/nutritionistForm`}
            className="text-[14px] font-medium py-1.5 px-3 text-[#64748b] hover:text-black flex items-center gap-2"
            >
            <i className="bi bi-arrow-left"></i> Back to Forms
            </Link>
        </div>
      </div>

      <div className="h-full w-full min-h-[600px] pb-10">
        {view === "form" ? (
          <>
            {formData?.embeddedLink ? (
                <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
                    <iframe
                    src={`${formData?.embeddedLink}`}
                    className="h-full w-full"
                    title="Embedded Form"
                    ></iframe>
                </div>
            ) : (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                    <p className="font-medium text-lg">No embedded link available.</p>
                    <p className="text-sm mt-2">Please contact the admin to update this form template.</p>
                    {/* Debug Info */}
                    <div className="mt-4 p-2 bg-gray-100 rounded text-[10px] font-mono text-gray-400 max-w-lg overflow-hidden truncate">
                        ID: {id} | Data: {JSON.stringify(formData).substring(0, 100)}...
                    </div>
                </div>
            )}
          </>
        ) : view === "Documentation" ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 min-h-[400px]">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Documentation & Instructions</h2>
                <div className="prose max-w-none text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData?.mdeText || "No documentation provided for this form."}
                    </ReactMarkdown>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Related Data</h2>
                    <p className="text-sm text-gray-500">
                        Copy data below to paste into the form.
                    </p>
                </div>
                <ChildrenTable data={childData || []} setBg={setBg} />
            </div>
        )}
      </div>
    </div>
  );
};

const ChildrenTable = ({ data, setBg }) => {
  const formatDate = (dateString) => {
    if(!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US");
  };

  const formatChildTable = (child, index) => {
    if (!child?.information || child.information.length === 0) return "";
    const rows = child.information[child.information.length - 1];

    // Added checks for undefined values to prevent "undefined" string in output
    const safe = (val) => val || "";

    const copy = `${index + 1}\t${safe(child.address)}\t${safe(child.mother)}\t${
      child.name
    }\tNO\t${child.gender === "male" ? "M" : "F"}\t${formatDate(
      child.birthDate
    )}\t${formatDate(rows.date)}\t${safe(rows.weightKg)}\t${safe(rows.heightCm)}\t${
      safe(child.ageMonths)
    }\t${safe(rows.status)}\t${safe(rows.muacCm)}`;

    return copy;
  };

  const handleCopy = (child, index) => {
    const text = formatChildTable(child, index);
    if (!text) {
        toast.error("No data to copy");
        return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`Copied report for ${child.name}`);
  };

  const handleCopyAll = () => {
    const allText = data.map(formatChildTable).filter(t => t).join("\n");
    if (!allText) {
        toast.error("No data to copy");
        return;
    }
    navigator.clipboard.writeText(allText);
    toast.success("Copied all reports!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50">
        <button
          onClick={handleCopyAll}
          className="bg-green-600 text-white text-[13px] px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <i className="bi bi-clipboard"></i> Copy All Reports
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
            <thead>
            <tr className="border-b border-gray-300 bg-gray-100 text-left text-xs uppercase tracking-wider text-gray-600">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Age (Mo)</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Height</th>
                <th className="py-3 px-4">MUAC</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Action</th>
            </tr>
            </thead>
            <tbody className="text-sm">
            {data.map((child, index) => {
                const latest = child?.information && child.information.length > 0 
                    ? child.information[child.information.length - 1] 
                    : {};
                
                return (
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" key={child._id}>
                    <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    <span className="text-xs text-gray-500">
                        Mother: {child.mother}
                    </span>
                    </td>
                    <td className="py-4 px-4">{child.ageMonths}</td>
                    <td className="py-4 px-4 capitalize">{child.gender}</td>
                    <td className="py-4 px-4">{latest?.weightKg || "-"}</td>
                    <td className="py-4 px-4">{latest?.heightCm || "-"}</td>
                    <td className="py-4 px-4">{latest?.muacCm || "-"}</td>
                    <td className="py-4 px-4">
                    {latest?.status ? (
                        <span
                            className="rounded-full text-white px-2 py-1 text-[10px] inline-block font-semibold uppercase tracking-wide"
                            style={{ backgroundColor: setBg(latest.status) }}
                        >
                            {latest.status}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                    )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                    {child.createdAt ? new Date(child.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-4 px-4 text-center">
                    <button
                        onClick={() => handleCopy(child, index)}
                        className="bg-white text-blue-600 text-[12px] px-3 py-1.5 rounded hover:bg-blue-50 transition-colors border border-blue-200 font-medium whitespace-nowrap"
                    >
                        Copy
                    </button>
                    </td>
                </tr>
                );
            })}
            {data.length === 0 && (
                <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-400">No children data available.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageGoogleSheetEmbed;