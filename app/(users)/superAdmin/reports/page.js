"use client";
import React, { useState } from "react";
import SubmittedFormsList from "@/components/superAdmin/SubmittedFormsList";
import ManageFormTemplates from "@/components/superAdmin/ManageFormTemplates"; // Import the new component

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("submissions");

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Forms</h1>
          <p className="text-sm text-gray-500">
            Manage templates and review submissions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "submissions"
              ? "border-green-600 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Submitted Reports
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "templates"
              ? "border-green-600 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Manage Templates
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "submissions" ? (
          <SubmittedFormsList />
        ) : (
          <ManageFormTemplates />
        )}
      </div>
    </div>
  );
}