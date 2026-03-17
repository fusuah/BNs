"use client";

import BeneficiariesAddForm from "@/components/bnsUser/benefeciaries/BeneficiariesAddForm";
import ModalInfo from "@/components/bnsUser/benefeciaries/ModalInfo";
import AddingDataForm from "@/components/bnsUser/pregnantData/AddingDataForm";
import { useGetAllPregnantDataQuery } from "@/service/pregnantData/pregnantDataApiSlice";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

const Beneficiaries = ({}) => {
  /* API  */
  // Destructure data, isLoading, isError, error from the query hook
  const { data: pregData, isLoading, isError, error } = useGetAllPregnantDataQuery();

  // Normalize data source: Handle if pregData is the array directly or inside a .data property
  const dataSource = useMemo(() => {
    if (Array.isArray(pregData)) return pregData;
    if (pregData?.data && Array.isArray(pregData.data)) return pregData.data;
    return [];
  }, [pregData]);

  const [filterData, setFilterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  const [modalInfoOpen, setModalInfoOpen] = useState(false);

  const [formUpdateData, setFormUpdateData] = useState({
    name: "",
    expectedDevlivery: "",
    pregnancyAge: 0,
    address: "",
    birthDate: "",
    email: "",
    number: "",
    type: "",
    pregnantinformation: [
      {
        bloodPressure: "",
        weightKg: 0,
        muacCm: 0,
        pregnacyRisk: "",
        supplement: "",
        recommendation: [
          {
            title: "",
            description: "",
          },
        ],
        date: "",
      },
    ],
    createdAt: "",
    updatedAt: "",
  });

  // Calculate Statistics dynamically
  const stats = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return { total: 0, checkupThisMonth: 0, normal: 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let checkupCount = 0;
    let normalCount = 0;

    dataSource.forEach((user) => {
      // Check pregnant information
      const info = user?.pregnantinformation;
      if (info && info.length > 0) {
        const lastInfo = info[info.length - 1];

        // Checkup this month logic
        if (lastInfo.date) {
          const recDate = new Date(lastInfo.date);
          if (recDate.getMonth() === currentMonth && recDate.getFullYear() === currentYear) {
            checkupCount++;
          }
        }

        // Normal (Low Risk) logic
        // Assuming "Low" risk equates to "Normal" status in the dashboard
        if (lastInfo.pregnacyRisk?.toLowerCase() === "low") {
          normalCount++;
        }
      }
    });

    return { total: dataSource.length, checkupThisMonth: checkupCount, normal: normalCount };
  }, [dataSource]);

  // Identify potential "Given Birth" beneficiaries (Overdue delivery date)
  const givenBirthCandidates = useMemo(() => {
    if (!dataSource) return [];
    const now = new Date();
    return dataSource.filter(user => {
        if (!user.expectedDelivery) return false;
        const deliveryDate = new Date(user.expectedDelivery);
        return deliveryDate < now; // If expected delivery is in the past
    });
  }, [dataSource]);

  // Update table data when API data changes
  useEffect(() => {
    if (dataSource) {
      setFilterData(dataSource);
    }
  }, [dataSource]);

  /* Search Function */
  const searchData = (searchQuery) => {
    if (!dataSource) return;

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = dataSource.filter(
      (child) =>
        child.name?.toLowerCase().includes(lowerQuery) ||
        child.address?.toLowerCase().includes(lowerQuery) ||
        child.barangay?.toLowerCase().includes(lowerQuery)
    );
    setFilterData(filtered);
  };

  /* BG Status Setter */
  const setBg = (txt) => {
    if (typeof txt !== 'string') return "#9ca3af";
    if (txt?.toLowerCase() === "low") {
      return "#4CAF50"; // Green
    } else if (txt?.toLowerCase() === "moderate") {
      return "#FFC107"; // Amber
    } else if (txt?.toLowerCase() === "high") {
      return "#2196F3"; // Blue
    } else if (txt?.toLowerCase() === "very high") {
      return "#EF5350"; // Red
    } else {
      return "#9ca3af"; // Gray default
    }
  };

  // console.log(filterData);

  const renderChildrenData = filterData?.map((data, index) => {
    const latestInfo = data?.pregnantinformation && data.pregnantinformation.length > 0
        ? data.pregnantinformation[data.pregnantinformation.length - 1]
        : {};

    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" key={data._id || index}>
        <td className="font-regular py-[16px] px-[16px]">
          {data?.name} <br />
          <span className="text-[12px] text-[#64748b] ">
            {/* Safe render for pregnancyAge to avoid NaN */}
            {data?.pregnancyAge || 0} mos
          </span>
        </td>
        <td className="font-regular py-[16px]">{data?.expectedDelivery ? new Date(data.expectedDelivery).toLocaleDateString() : "-"}</td>
        {/* <td className="font-regular py-[16px]">{data?.email}</td> */}
        <td className="font-regular py-[16px]">
          {data?.address} <br />
          {/* <span className="text-[12px] text-[#64748b] ">
            
            Barangay: {data?.barangay}
          </span> */}
        </td>

        <td className={`font-regular py-[16px] flex  `}>
          {latestInfo?.pregnacyRisk ? (
             <p
                className="rounded-full text-white px-2 py-0.5 text-[10px] mt-[16px] uppercase font-semibold"
                style={{ backgroundColor: setBg(latestInfo.pregnacyRisk) }}
            >
                {latestInfo.pregnacyRisk}
            </p>
          ) : (
            <span className="text-gray-400 mt-[16px] text-xs">N/A</span>
          )}
        </td>
        <td className="font-regular py-[16px] ">
          {latestInfo?.date ? new Date(latestInfo.date).toLocaleDateString() : "-"}
        </td>
        <td className="font-regular py-[16px] px-[16px]">
          <i
            className="bi bi-file-earmark cursor-pointer p-2 rounded-md  duration-200  hover:bg-[#FFC105]  "
            onClick={() => {
              setModalInfoOpen(true);
              setFormUpdateData(data);
              setFormStatus("update");
            }}
          ></i>
        </td>

        <td className="font-regular py-[16px] px-[16px]">
          <Link
            href={`/bnsUser/pregnantData/${data?._id}`}
            className="primary-btn text-white text-[12px] hover:opacity-80 transition-opacity"
          >
            Update/Upload
          </Link>
        </td>
      </tr>
    );
  });

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h3 className="font-bold">Error Loading Data</h3>
        <p>{error?.data?.message || "Unable to fetch pregnant records."}</p>
        <p className="text-xs text-gray-400 mt-2">Check console for details.</p>
      </div>
    );
  }

  return (
    <>
      <ModalInfo
        modalInfoOpen={modalInfoOpen}
        setModalInfoOpen={setModalInfoOpen}
        {...formUpdateData}
      />
      <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
        {/* Nutrition Data Title Box */}
        <div className="w-full flex flex-col mb-[32px] ">
          <h1 className="text-3xl font-bold ">Pregnant Data Records</h1>
          <p className="text-[16px] text-[#64748b] mb-2 ">
            Manage all beneficiaries in the system
          </p>
        </div>

        {open ? (
          <>
            <AddingDataForm setOpen={setOpen} formStatus={formStatus} />
          </>
        ) : (
          <>
            <div className="w-full mb-4 flex flex-col md:flex-row justify-center items-start cursor-pointer gap-4">
              <div className="w-full md:w-1/2">
                <h3 className="text-[16px] font-semibold mb-[12px]">For You</h3>
                <div className=" flex w-full gap-[12px] overflow-auto rounded-md mb-4">
                  <div className="flex p-4 justify-between w-full items-center border border-gray-200 rounded-md bg-white shadow-sm">
                    <p className="text-[16px]  gap-[-22px]">
                      Visit your Task to view if you have task for this Page
                      <br />
                      <span className="text-primary-color text-[12px]">
                        View Task Info
                      </span>
                    </p>
                    <h1 className="text-[12px] bg-[#4CAF50] text-white px-[9px] py-2 rounded-full">
                      01
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <h3 className="text-[16px] font-semibold mb-[12px]">
                  Beneficiary Reminder
                </h3>
                <div className=" flex flex-col gap-[12px] overflow-auto rounded-md mb-4">
                  <div className="flex border border-gray-200 p-4 justify-between w-full items-center bg-white shadow-sm">
                    <p className="text-[16px]  gap-[-22px]">
                      <b className="text-primary-color"> {dataSource?.length > 0 ? dataSource.length : "No"} Pregnant Women </b>
                      <br />
                      to remind for their monthly schedule <br />
                      <span className="text-[12px]">monthly schedule</span>
                    </p>
                    <button className=" primary-btn text-white text-[12px] cursor-pointer hover:opacity-50">
                      Remind All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="w-full p-[24px] border border-gray-200  rounded-md bg-white shadow-sm">
              {/* TITLE */}
              <div className="w-full flex flex-col md:flex-row gap-[24px] mb-7">
                <div className="w-full md:w-1/2">
                  <h3 className="text-[24px] font-semibold">
                    Pregnant Nutrition Records
                  </h3>
                  <p className="text-[14px]  text-[#64748b] mb-[24px]">
                    Manage all beneficiaries in the system
                  </p>

                  {/* Mini Dash */}
                  <div className="w-full mb-[24px]">
                    <div className="w-full flex justify-between gap-4">
                      <div className="text-[12px]">
                        total count <br />
                        <b className="text-[16px] font-bold text-primary-color ">
                          {/* Safe render for stats to avoid NaN */}
                          {isLoading ? "..." : (stats.total || 0)}
                        </b>
                      </div>
                      <div className="text-[12px]">
                        check up this month
                        <br />
                        <b className="text-[16px] font-bold text-secondary-color ">
                          {isLoading ? "..." : (stats.checkupThisMonth || 0)}
                        </b>
                      </div>
                      <div className="text-[12px]">
                        Normal (Low Risk)
                        <br />
                        <b className="text-[16px] font-bold text-[#4CAF50] ">
                          {isLoading ? "..." : (stats.normal || 0)}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="w-full flex justify-between">
                    <h3 className="text-[16px] font-semibold ">Given Birth</h3>{" "}
                    <span className="flex gap-4">
                      <button className="hover:text-primary-color">{"<"}</button>
                      <button className="hover:text-primary-color">{">"}</button>
                    </span>
                  </div>
                  <p className="text-[14px] text-[#64748b]  mb-3 ">
                    Beneficiaries with past expected delivery dates
                  </p>

                  {givenBirthCandidates.length > 0 ? (
                      <div className="w-full flex items-center justify-between border border-gray-200 p-4 rounded-md">
                        <div>
                          <h3 className="text-[16px] font-medium text-primary-color">
                            {givenBirthCandidates[0]?.name}
                          </h3>
                          <p className="text-[12px] font-medium ">
                             Due: {new Date(givenBirthCandidates[0]?.expectedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                        <i className="bi bi-arrow-bar-right cursor-pointer hover:text-primary-color"></i>
                      </div>
                  ) : (
                      <div className="w-full flex items-center justify-center border border-gray-200 border-dashed p-4 rounded-md text-gray-400 text-sm">
                          No pending deliveries found
                      </div>
                  )}
                </div>
              </div>

              {/* Search and Exports */}
              <div className="w-full flex flex-col md:flex-row gap-4 mb-[32px]">
                {/* Input */}
                <div className="border border-gray-200 w-full flex p-[8px] rounded-md gap-4 items-center bg-gray-50">
                  <i className="bi bi-search ml-2 text-gray-500"></i>
                  <input
                    type="search"
                    name=""
                    id=""
                    className=" w-full text-[14px] outline-none border-none bg-transparent placeholder:text-[14px]"
                    placeholder="Search By Name, Address, or Barangay..."
                    onChange={(e) => searchData(e.target.value)}
                  />
                </div>

                <button
                  className="py-[8px] px-[12px] cursor-pointer font-semibold bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-80"
                  onClick={() => {
                    setOpen(true);
                    setFormStatus("add");
                  }}
                >
                  <i className="bi bi-plus text-lg"></i>
                  Add New Beneficiaries
                </button>
              </div>

              {/* TABLE */}
              <div className="w-full overflow-auto">
                <table className="text-[14px] w-full border border-gray-200 rounded-md ">
                    <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th className="text-[#64748b]  font-medium text-left py-[12px]  px-[16px] ">
                        Name
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Expected Delivery
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Address
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Pregnancy Risk
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Last Checkup
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Overview
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px] px-[16px]">
                        Action
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">Loading data...</td>
                            </tr>
                        ) : filterData && filterData.length > 0 ? (
                            renderChildrenData
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                    {dataSource?.length > 0 ? "No records match your search." : "No pregnant data records found."}
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
    </>
  );
};

export default Beneficiaries;