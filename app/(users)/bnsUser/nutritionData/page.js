"use client";

import AddingNutritionForm from "@/components/bnsUser/nutritionData/AddingNutritionForm";
import NutritionDataForm from "@/components/bnsUser/nutritionData/NutritionDataForm";
import { useEffect, useState, useMemo } from "react";
import { useGetChildrenNutritionDataQuery } from "../../../../service/childrenNutritionData/childrenNurtritionDataApiSlice";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphMalnourish = ({ data }) => {
  const malnourishedStatuses = ["underweight", "severely underweight"];

  const chartData = useMemo(() => {
    const monthCounts = {};

    if (data && data.length > 0) {
      data.forEach((child) => {
        // Iterate through all information records for each child
        child?.information?.forEach((info) => {
          const status = (info?.status || "").toLowerCase();
          if (malnourishedStatuses.includes(status)) {
            const date = new Date(info.date);
            // Check for valid date
            if (!isNaN(date.getTime())) {
                const monthKey = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
                });
                monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
            }
          }
        });
      });
    }

    const labels = Object.keys(monthCounts).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      labels,
      datasets: [
        {
          label: "Malnourished Children",
          data: labels.map((label) => monthCounts[label]),
          backgroundColor: "rgba(76, 175, 80, 0.25)",
          borderColor: "#277C2B",
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", display: false },
      title: {
        display: false,
        text: "Malnourishment Rate per Month",
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="w-full h-[250px]">
      <Bar options={options} data={chartData} />
    </div>
  );
};

const UserNutriotionData = () => {
  /* API FUNCTION */
  // Added isError and error for debugging
  const { data: cnData, isLoading, isSuccess, isError, error } = useGetChildrenNutritionDataQuery();

  // DEBUG: Log the raw data from the API
  console.log("Raw API Data (cnData):", cnData);
  if (isError) console.error("API Error:", error);

  // Normalize data source: Handle if cnData is the array directly or inside a .data property
  // This fixes the issue where cnData.data is undefined when cnData is already the array
  const dataSource = useMemo(() => {
    if (Array.isArray(cnData)) return cnData;
    if (cnData?.data && Array.isArray(cnData.data)) return cnData.data;
    return [];
  }, [cnData]);

  const [filterData, setFilterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  const [formUpdateData, setFormUpdateData] = useState({
    name: "",
    mother: "",
    ageMonths: 0,
    gender: "",
    status: "",
    birthDate: "",
    information: {
      weightKg: 0,
      heightCm: 0,
      muacCm: 0,
      date: "",
      recommendation: [],
    },
  });

  // Calculate Statistics dynamically
  const stats = useMemo(() => {
    // Return zeros if no data is available yet
    if (!dataSource || dataSource.length === 0) return { total: 0, checkupThisMonth: 0, normal: 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let checkupCount = 0;
    let normalCount = 0;
    
    // We want stats for ALL approved children
    const activeChildren = dataSource.filter(child => child.approve === true);
    const total = activeChildren.length;

    activeChildren.forEach(child => {
        if (child.information && child.information.length > 0) {
            const latestInfo = child.information[child.information.length - 1];
            
            if (latestInfo.status?.toLowerCase() === 'normal') {
                normalCount++;
            }

            if (latestInfo.date) {
                const recDate = new Date(latestInfo.date);
                if (recDate.getMonth() === currentMonth && recDate.getFullYear() === currentYear) {
                    checkupCount++;
                }
            }
        }
    });

    const calculatedStats = { total, checkupThisMonth: checkupCount, normal: normalCount };
    // DEBUG: Log calculated statistics
    console.log("Calculated Stats:", calculatedStats);
    
    return calculatedStats;
  }, [dataSource]);

  // Update table data when API data changes
  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      // Filter only approved children for the list
      const approvedData = dataSource.filter((data) => {
        return data?.approve === true;
      });
      
      // DEBUG: Log filtered data for table
      console.log("Filtered Data for Table (Approved Only):", approvedData);

      setFilterData(approvedData);
    } else {
        console.log("No data available in dataSource");
        setFilterData([]);
    }
  }, [dataSource]); // Dependency on dataSource ensures update when data arrives

  /* Search Function */
  const searchData = (searchQuery) => {
    if (!dataSource) return;
    
    console.log("Search Query:", searchQuery);

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = dataSource.filter((child) => {
       const matchesSearch = 
          child.name?.toLowerCase().includes(lowerQuery) ||
          child.mother?.toLowerCase().includes(lowerQuery) ||
          (child.information?.[child.information.length - 1]?.status?.toLowerCase() || "").includes(lowerQuery) ||
          child.address?.toLowerCase().includes(lowerQuery);
       
       return child.approve === true && matchesSearch;
    });
    setFilterData(filtered);
  };

  /* BG Status Setter */
  const setBg = (txt) => {
    if (txt?.toLowerCase() === "normal") {
      return "#4CAF50";
    } else if (txt?.toLowerCase() === "underweight") {
      return "#FFC107";
    } else if (txt?.toLowerCase() === "overweight") {
      return "#2196F3";
    } else if (txt?.toLowerCase() === "severely underweight") {
      return "#EF5350";
    } else {
      return "#9ca3af"; 
    }
  };

  const renderChildrenData = filterData?.map((data, index) => {
    const latestInfo = data?.information && data.information.length > 0 
        ? data.information[data.information.length - 1] 
        : {};

    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" key={data._id || index}>
        <td className="font-regular py-[16px] px-[16px]">
          {data?.name} <br />
          <span className="text-[12px] text-[#64748b] ">
            Mother: {data?.mother}
          </span>
        </td>
        <td className="font-regular py-[16px]">{data?.ageMonths}</td>
        <td className="font-regular py-[16px] capitalize">{data?.gender}</td>
        <td className="font-regular py-[16px]">
          {latestInfo?.weightKg || "-"}
        </td>
        <td className="font-regular py-[16px]">
          {latestInfo?.heightCm || "-"}
        </td>
        <td className="font-regular py-[16px]">
          {latestInfo?.muacCm || "-"}
        </td>
        <td className={`font-regular py-[16px] flex`}>
            {latestInfo?.status ? (
                <p
                    className="rounded-full text-white px-2 py-0.5 text-[10px] mt-[16px] uppercase font-semibold"
                    style={{ backgroundColor: setBg(latestInfo.status) }}
                >
                    {latestInfo.status}
                </p>
            ) : (
                <span className="text-gray-400 mt-[16px] text-xs">N/A</span>
            )}
        </td>
        <td className="font-regular py-[16px] ">
          {latestInfo?.date ? new Date(latestInfo.date).toLocaleDateString() : "-"}
        </td>
        <td className="font-regular py-[16px] px-[16px]">
          <button
            className="bg-green-600 text-white px-3 py-1.5 rounded text-[12px] cursor-pointer hover:bg-green-700 transition-colors"
            onClick={() => {
              setOpen(true);
              setFormUpdateData(data);
              setFormStatus("update");
            }}
          >
            Edit / Record
          </button>
        </td>
      </tr>
    );
  });

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h3 className="font-bold">Error Loading Data</h3>
        <p>{error?.data?.message || "Unable to fetch nutrition records."}</p>
        <p className="text-xs text-gray-400 mt-2">Check console for details.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-[1220px] max-h-[1000px] mx-auto px-4 py-6 ">
      {/* Nutrition Data Title Box */}
      <div className="w-full flex flex-col mb-[32px] ">
        <h1 className="text-3xl font-bold ">Children Nutrition Data</h1>
        <p className="text-[16px] text-[#64748b] mb-2 ">
          Manage and monitor children&apos;s nutritional status
        </p>
      </div>

      {open ? (
        formStatus === "update" ? (
          <>
            <NutritionDataForm
              formUpdateData={formUpdateData}
              setOpen={setOpen}
              formStatus={formStatus}
            />
          </>
        ) : (
          <>
            <AddingNutritionForm setOpen={setOpen} />
          </>
        )
      ) : (
        <>
          <div className="w-full mb-4 flex flex-col md:flex-row justify-center items-start gap-4">
            <div className="w-full md:w-1/2">
              <h3 className="text-[16px] font-semibold mb-[12px]">
                Malnourished Tracker
              </h3>
              <div className="flex w-full gap-[12px] overflow-auto rounded-md mb-4 border border-gray-100 p-2 bg-white shadow-sm">
                <GraphMalnourish data={dataSource} />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-[16px] font-semibold mb-[12px]">
                Beneficiary Reminder
              </h3>
              <div className="flex flex-col gap-[12px] overflow-auto rounded-md mb-4">
                <div className="flex border border-gray-200 p-4 justify-between w-full items-center bg-white rounded-lg shadow-sm">
                  <div className="text-[14px]">
                    <b className="text-green-600">
                      Post Event for Children
                    </b>{" "}
                    <br />
                    <span className="text-gray-500 text-xs">Create events relevant for Health and Nutrition</span>
                  </div>
                  <Link
                    href={"reminders"}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-[12px] hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    Go to Events
                  </Link>
                </div>
              </div>

              <h3 className="text-[16px] font-semibold mb-[12px]">
                Forms Management
              </h3>
              <div className="flex flex-col gap-[12px] overflow-auto rounded-md mb-4">
                <div className="flex border border-gray-200 p-4 justify-between w-full items-center bg-white rounded-lg shadow-sm">
                  <div className="text-[14px]">
                    <b className="text-green-600">View Form for Reports</b>{" "}
                    <br />
                    <span className="text-gray-500 text-xs">Access forms for your reports</span>
                  </div>
                  <Link
                    href={"voiceReport/nutritionistForm"}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-[12px] hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="w-full p-[24px] border border-gray-200 rounded-md bg-white shadow-sm">
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-[24px] gap-4">
              {/* TITLE */}
              <div className="flex flex-col ">
                <h3 className="text-[24px] font-semibold">Nutrition Records</h3>
                <p className="text-[14px] text-[#64748b]">
                  Overview of all registered children
                </p>
              </div>

              {/* MINI DASH */}
              <div className="w-full md:w-auto">
                <div className="w-full flex justify-between gap-4">
                  <div className="text-[12px] border border-gray-200 p-3 rounded-[7px] min-w-[100px] text-center bg-gray-50">
                    Total Count <br />
                    <b className="text-[20px] font-bold text-green-600">
                      {isLoading ? "..." : stats.total}
                    </b>
                  </div>
                  <div className="text-[12px] border border-gray-200 p-3 rounded-[7px] min-w-[100px] text-center bg-gray-50">
                    Check-ups (Month)
                    <br />
                    <b className="text-[20px] font-bold text-yellow-500">
                      {isLoading ? "..." : stats.checkupThisMonth}
                    </b>
                  </div>
                  <div className="text-[12px] border border-gray-200 p-3 rounded-[7px] min-w-[100px] text-center bg-gray-50">
                    Normal Status
                    <br />
                    <b className="text-[20px] font-bold text-blue-500">
                        {isLoading ? "..." : stats.normal}
                    </b>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Add Button */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mb-[32px]">
              {/* Input */}
              <div className="border border-gray-200 w-full flex p-[8px] rounded-md gap-4 items-center bg-gray-50">
                <i className="bi bi-search text-gray-500 ml-2"></i>
                <input
                  type="search"
                  className="w-full text-[14px] outline-none border-none bg-transparent placeholder:text-gray-400"
                  placeholder="Search By Name, Parent, or Address..."
                  onChange={(e) => searchData(e.target.value)}
                />
              </div>

              <button
                className="py-[8px] px-[16px] cursor-pointer font-semibold bg-[#4CAF50] text-white rounded-md flex justify-center items-center gap-2 text-nowrap text-[14px] hover:bg-green-700 transition-colors shadow-sm"
                onClick={() => {
                  setOpen(true);
                  setFormStatus("add");
                }}
              >
                <i className="bi bi-plus text-lg"></i>
                Add New
              </button>
            </div>
            
            {/* TABLE */}
            <div className="w-full max-h-[500px] overflow-auto">
              <table className="text-[14px] w-full border border-gray-200 rounded-md">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-[16px]">
                      Name
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Age (months)
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Gender
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Weight(kg)
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Height(cm)
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      MUAC(cm)
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Status
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-2">
                      Date Recorded
                    </th>
                    <th className="text-[#64748b] font-medium text-left py-[12px] px-[16px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan="9" className="text-center py-8 text-gray-500">Loading data...</td>
                        </tr>
                    ) : filterData && filterData.length > 0 ? (
                        renderChildrenData
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center py-8 text-gray-500">
                                {dataSource?.length > 0 
                                    ? "No approved records found. (Check 'Approvals' page)" 
                                    : "No records found in database."}
                            </td>
                        </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="h-[24px]"></div>
    </div>
  );
};

export default UserNutriotionData;