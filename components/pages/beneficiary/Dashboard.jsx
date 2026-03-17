"use client";

import { Bell, FileText, MessageCircle } from "lucide-react";
import NutritionSummary from "@/components/beneficiary/NutritionSummary";
import UpcomingEvents from "@/components/beneficiary/UpcomingEvents";
import "react-day-picker/style.css";
import Notifications from "@/components/beneficiary/Notifications";
import RemindersPanel from "@/components/beneficiary/RemindersPanel";
import useAuth from "@/hooks/useAuth";
function BeneficiaryDashboardPage() {
  const { name } = useAuth();
  return (
    <div className="text-black w-full flex flex-col overflow-x-hidden  ">
      {/* PAGE TITLE */}
      <div className="w-full  flex justify-between items-center">
        <div>
          <strong className="text-2xl">Welcome, {name}!</strong>
          <p className="text-gray-500">
            Track health progress and upcoming appointments
          </p>
        </div>
      </div>

      <div className="w-full my-6 flex gap-6  flex-col sm:flex-row ">
        <NutritionSummary />
        <div className="w-[35%] flex flex-col gap-6  max-[640px]:w-full">
          <Notifications />
          <RemindersPanel />
        </div>
      </div>

      <div className="flex gap-6 max-[640px]:flex-col">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 w-full ">
          <div className="flex items-center space-x-2">
            <FileText className="text-green-500 w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-900">
              Nutrition Records
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Track Juan's growth and nutrition history
          </p>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition">
            View Full Records
          </button>
        </div>

        {/* Chat Assistance Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 w-full">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-indigo-500 w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-900">
              Chat Assistance
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Ask questions about nutrition and childcare
          </p>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg transition">
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryDashboardPage;
