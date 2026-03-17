"use client";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Heart,
  Syringe,
  Apple,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { growthData } from "@/data/bnsUserSampleData";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectBeneficiary } from "@/service/beneficiaryPortal/beneficiaryPortalSlice";
import { useParams } from "next/navigation";
import { useGetuserAccountDataQuery } from "@/service/beneficiaryPortal/beneficiaryApiSlice";

// Helper to format date to "MMM YYYY"
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};
const TABS = ["Overview", "Growth Chart", "Immunization", "Nutrition"];

function ChildProfilePage() {
  const { childId } = useParams(); // Get ID from URL
  const [tab, setTab] = useState("Overview");

  // Fetch data directly using the ID
  // Assuming 'children' is the correct user_type for child profiles
  const { data: fetchedData, isLoading } = useGetuserAccountDataQuery(
    { id: childId, user_type: "children" },
    { skip: !childId }
  );

  const userData = fetchedData?.data || {};

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };

  // Safely get latest info
  const latestInfo = userData?.information && userData.information.length > 0 
    ? userData.information[userData.information.length - 1] 
    : {};

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading child profile...</div>;
  }

  if (!userData?._id) {
      return <div className="p-8 text-center text-gray-500">Child profile not found.</div>;
  }

  return (
    <div className="space-y-6 text-black">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child Profile</h1>
          <p className="text-muted-foreground">
            View and manage {userData?.name}'s health information
          </p>
        </div>
        <button className="flex gap-2 justify-center items-center bg-green-500 p-2 rounded text-white">
          <FileText className="h-4 w-4" />
          Export Health Records
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white p-6 rounded-2xl shadow">
        <div className="h-24 w-24  border-1 border-gray-200 flex justify-center items-center  rounded-full bg-[#4CAF50] overflow-hidden">
           {/* Fix: img tag was div */}
           {/* <img src="/placeholder.svg" alt="Juan Dela Cruz" /> */}
          <div className="text-4xl text-white">
            {getInitials(userData?.name)}
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold">{userData?.name}</h2>
            <p className="text-muted-foreground">
              Child ID: BNS-{userData?._id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full text-sm"
            >
              {userData?.gender}
            </div>
            <div
              className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-full text-sm"
            >
              {userData?.ageMonths} months old
            </div>
            <div
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 rounded-full text-sm"
            >
              {latestInfo?.status || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="bg-blue-50 px-4 py-2 rounded-md">
            <p className="text-sm text-blue-700">Last Check-up</p>
            <p className="font-medium text-blue-900">
                {latestInfo?.date ? new Date(latestInfo.date).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 text-sm">Edit Profile</div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit  my-6">
        {TABS.map((t) => {
          const isActive = tab === t;

          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                isActive ? "bg-white shadow text-black" : "text-gray-500"
              }`}
            >
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {tab === "Overview" && (
        <>
          {/* overview content row 1 */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="bg-white p-6 shadow rounded-2xl w-full lg:w-3/10">
              <div className="flex items-center gap-2 mb-6 text-2xl font-semibold">
                <User className="h-5 w-5 text-green-500" />
                Basic Information
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{userData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{userData?.ageMonths} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{userData?.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mother</p>
                  <p className="font-medium">{userData?.mother}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-2xl w-full lg:w-7/10">
              <div className="flex items-center gap-2 mb-6 text-2xl font-semibold">
                <Activity className="h-5 w-5 text-green-500" />
                Health Status
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">{latestInfo?.weightKg || 0} kg</span>
                  </div>

                  <div>
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[75%] transition-all"></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Normal for age</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">{latestInfo?.heightCm || 0} cm</span>
                  </div>

                  <div>
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[60%] transition-all"></div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Above average</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">MUAC</span>
                    <span className="font-medium">{latestInfo?.muacCm || 0} cm</span>
                  </div>
                  <div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[60%] transition-all"></div>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Acceptable range
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/*growth */}
      {tab === "Growth Chart" && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div>
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <Ruler className="h-5 w-5 text-green-500" />
                Growth Chart
              </div>
              <div className="text-gray-500">
                Track {userData?.name}'s growth patterns over time
              </div>
            </div>
            <div>
              <div className=" bg-gray-100 flex items-center justify-center rounded-md mt-6">
                <div className="bg-[#eaf3f9] p-6 rounded-xl w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: "Weight (kg)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Height (cm)",
                          angle: -90,
                          position: "insideRight",
                        }}
                      />
                      <Tooltip
                        labelFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}`;
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        name="Weight (kg)"
                        stroke="#8884d8"
                        dot
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="height"
                        name="Height (cm)"
                        stroke="#82ca9d"
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/*Immunization */}
      {tab === "Immunization" && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 font-semibold text-2xl mb-6">
              <Syringe className="h-5 w-5 text-green-500" />
              Immunization Records
            </div>

            <div className="space-y-4">
              <p className="text-gray-500">No immunization records available.</p>
            </div>
          </div>
        </>
      )}

      {/*Nutrition Assessment */}
      {tab === "Nutrition" && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 font-semibold text-2xl mb-6">
              <Apple className="h-5 w-5 text-green-500" />
              Nutrition Assessment
            </div>

            <div className="space-y-6">
               <p className="text-gray-500">No assessment data available.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChildProfilePage;