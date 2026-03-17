"use client";
import { Users, UserPlus, Calendar } from "lucide-react";
import NutritionChart from "@/components/superAdmin/NutritionChart";
import ServiceSatisfactionCard from "@/components/superAdmin/ServiceSatisfactionCard";
import BarangayHeatmap from "@/components/superAdmin/BarangayPerformanceHeatmap";

// 🔹 NEW COMPONENTS
import DailyAccomplishments from "@/components/superAdmin/DailyAccomplishments";
import InventoryManagement from "@/components/superAdmin/InventoryManagement";
import MalnutritionAnalytics from "@/components/superAdmin/MalnutritionAnalytics";

// 🔹 API HOOKS
import { useGetHeatmapReportQuery } from "@/service/dailyDiary/dailyDiaryApiSlice";
import { useGetTableNutritionDataQuery } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import { useGetAllPregnantDataQuery } from "@/service/pregnantData/pregnantDataApiSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function SuperAdminDashboard() {
  const { data } = useGetHeatmapReportQuery();
  const dashboardStats = data?.data || data; 

  const { data: dataTrends } = useGetTableNutritionDataQuery();
  
  const {
    data: pregnantData = [],
    isLoading,
    isError,
  } = useGetAllPregnantDataQuery();

  // 🔹 Extract Barangay from address
  const extractBarangay = (address = "") => {
    const match = address.match(/Brgy\.?\s*([^,]+)|Barangay\s*([^,]+)/i);
    return match ? (match[1] || match[2]).trim() : "Unknown";
  };

  // 🔹 Count pregnant women per barangay
  const barangayCount = pregnantData.reduce((acc, person) => {
    if (person.type !== "pregnant") return acc;

    const barangay = extractBarangay(person.address);
    acc[barangay] = (acc[barangay] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(barangayCount).map(([barangay, total]) => ({
    barangay,
    total,
  }));

  return (
    <div className="text-black p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* 1. HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's an overview of community health operations.
        </p>
      </div>

      {/* 2. KEY METRICS - Kept at top for quick summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div>
            <h4 className="text-sm text-gray-500 font-medium mb-1">Total BNS Users</h4>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats?.totalBnsUsers || 0}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <Users className="text-green-600 w-6 h-6" />
          </div>
        </div>

        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div>
            <h4 className="text-sm text-gray-500 font-medium mb-1">Active Barangays</h4>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats?.activeBarangays || 0}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
             <UserPlus className="text-green-600 w-6 h-6" />
          </div>
        </div>

        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div>
            <h4 className="text-sm text-gray-500 font-medium mb-1">Reports This Month</h4>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardStats?.reportThisMonthCount || 0}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <Calendar className="text-green-600 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. PRIORITY SECTION: OPERATIONS & INVENTORY */}
      {/* Moved to the top as requested */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Accomplishments (Activity & Attendance) - Takes 2/3 width */}
        <div className="lg:col-span-2">
            <DailyAccomplishments />
        </div>
        
        {/* Inventory Management - Takes 1/3 width */}
        <div className="lg:col-span-1">
            <InventoryManagement />
        </div>
      </div>

      {/* 4. ANALYTICS ROW: Malnutrition & Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {/* Malnutrition Analytics */}
         <div className="w-full">
            <MalnutritionAnalytics />
         </div>
         
         {/* Barangay Heatmap */}
         <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
               <h3 className="font-bold text-lg text-gray-800">Barangay Performance</h3>
               <p className="text-sm text-gray-500">Activity levels and task compliance heatmap</p>
            </div>
            <div className="w-full min-h-[400px]">
                <BarangayHeatmap rows={dashboardStats?.rows} />
            </div>
         </div>
      </div>

      {/* 5. TRENDS & SATISFACTION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
           {dataTrends?.data ? (
             <NutritionChart data={dataTrends?.data?.data} />
           ) : (
             <div className="h-full min-h-[300px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
                <div className="flex flex-col items-center gap-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <p>Loading Nutrition Trends...</p>
                </div>
             </div>
           )}
        </div>
        <div className="w-full h-full">
           <ServiceSatisfactionCard />
        </div>
      </div>

      {/* 6. PREGNANT DATA ROW */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Pregnant Women Statistics</h3>
            <p className="text-sm text-gray-500">
              Distribution of registered pregnant women per barangay
            </p>
          </div>
        </div>

        <div className="w-full h-[350px]">
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg">
                <p>No pregnant data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="barangay" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="total" name="Pregnant Women" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}

export default SuperAdminDashboard;