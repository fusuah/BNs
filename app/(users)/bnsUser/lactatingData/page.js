"use client";

import BeneficiariesAddForm from "@/components/bnsUser/benefeciaries/BeneficiariesAddForm";
import { useEffect, useState, useMemo } from "react";
import { useGetAllLactatingDataQuery } from "@/service/lactatingData/lactatingDataApiSlice";
import Link from "next/link";
import ModalLactatingInfo from "@/components/bnsUser/benefeciaries/ModalLactatingInfo";
import AddingDataForm from "@/components/bnsUser/lactatingData/AddingDataForm";

const Beneficiaries = ({}) => {
  /* API */
  // Destructure data, isLoading, isError from the query hook
  const { data: lactatingData, isLoading, isError } = useGetAllLactatingDataQuery();

  // Normalize data source using useMemo
  const dataSource = useMemo(() => {
    if (Array.isArray(lactatingData)) return lactatingData;
    if (lactatingData?.data && Array.isArray(lactatingData.data)) return lactatingData.data;
    return [];
  }, [lactatingData]);

  const [filterData, setFilterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [formUpdateData, setFormUpdateData] = useState({
    name: "",
    age: 0,
    childAge: 0,
    address: "",
    birthDate: "",
    approve: false,
    email: "",
    number: "",
    bns_code: "",
    type: "",
    imgUrl: "",
    lactatinginformation: [
      {
        weightKg: 0,
        breestFeedStatus: "",
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
      const info = user?.lactatinginformation;
      if (info && info.length > 0) {
        const lastInfo = info[info.length - 1];

        // Checkup this month logic
        if (lastInfo.date) {
          const recDate = new Date(lastInfo.date);
          if (recDate.getMonth() === currentMonth && recDate.getFullYear() === currentYear) {
            checkupCount++;
          }
        }

        // Normal status logic (Checking breastFeedStatus or other indicators if available)
        // Assuming "Normal" status might come from breastFeedStatus or similar field
        // Since the previous example used setBg on 'breestFeedStatus', I'll use that.
        if (lastInfo.breestFeedStatus?.toLowerCase() === "normal") {
          normalCount++;
        }
      }
    });

    return { total: dataSource.length, checkupThisMonth: checkupCount, normal: normalCount };
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
      (lactating) =>
        lactating.name?.toLowerCase().includes(lowerQuery) ||
        lactating.address?.toLowerCase().includes(lowerQuery)
    );
    setFilterData(filtered);
  };

  /* BG Status Setter */
  const setBg = (txt) => {
    if (typeof txt !== 'string') return "#9ca3af";
    if (txt?.toLowerCase() === "normal") {
      return "#4CAF50";
    } else if (txt?.toLowerCase() === "underweight") {
      return "#FFC107";
    } else if (txt?.toLowerCase() === "overweight") {
      return "#2196F3";
    } else if (txt?.toLowerCase() === "severely underweight") {
      return "#EF5350";
    } else {
      return "#9ca3af"; // Default gray
    }
  };

  const renderChildrenData = filterData?.map((data, index) => {
    const latestInfo = data?.lactatinginformation && data.lactatinginformation.length > 0
        ? data.lactatinginformation[data.lactatinginformation.length - 1]
        : {};

    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" key={data._id || index}>
        <td className="font-regular py-[16px] px-[16px]">
          {data?.name} <br />
          <span className="text-[12px] text-[#64748b] ">
            {data?.age || 0} yrs old
          </span>
        </td>

        <td className="font-regular py-[16px]">{data?.childAge || 0}</td>
        <td className="font-regular py-[16px]">{data?.address || "N/A"}</td>

        <td className="font-regular py-[16px]">
           {latestInfo?.breestFeedStatus ? (
             <p
                className="rounded-full text-white px-2 py-0.5 text-[10px] mt-[16px] uppercase font-semibold inline-block"
                style={{ backgroundColor: setBg(latestInfo.breestFeedStatus) }}
            >
                {latestInfo.breestFeedStatus}
            </p>
          ) : (
            <span className="text-gray-400 mt-[16px] text-xs">N/A</span>
          )}
        </td>
        <td className="font-regular py-[16px]">
          {latestInfo?.date ? new Date(latestInfo.date).toLocaleDateString() : "N/A"}
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
            href={`/bnsUser/lactatingData/${data?._id}`}
            className="primary-btn text-white text-[12px] hover:opacity-80 transition-opacity"
          >
            Update/Upload
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <>
      <ModalLactatingInfo
        modalInfoOpen={modalInfoOpen}
        setModalInfoOpen={setModalInfoOpen}
        {...formUpdateData}
      />
      <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
        {/* Nutrition Data Title Box */}
        <div className="w-full flex flex-col mb-[32px] ">
          <h1 className="text-3xl font-bold ">Lactating Data Records</h1>
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
                      Visit Task to view if you have task for{" "}
                      <b>Lactating Beneficiaries</b>
                      <br />
                      <span className="text-primary-color text-[12px]">
                        View Task Info
                      </span>
                    </p>
                    <Link
                      href={"taskandschedule"}
                      className="text-[12px] bg-[#4CAF50] text-white px-[12px] py-2 rounded-full hover:opacity-80"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </Link>
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
                      <b className="text-primary-color">
                        {" "}
                        Post an Event for Lactating Beneficiaries
                      </b>
                      <br />
                      to make an event for the lactating beneficiaries <br />
                      <span className="text-[12px]">monthly schedule</span>
                    </p>
                    <Link
                      href={"reminders"}
                      className=" primary-btn text-white text-[12px] cursor-pointer hover:opacity-50"
                    >
                      Go to Events
                    </Link>
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
                    Lactating Data Records
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
                        Normal
                        <br />
                        <b className="text-[16px] font-bold text-[#2196F3] ">
                          {isLoading ? "..." : (stats.normal || 0)}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-[16px] font-semibold mb-[12px]">
                    Given Birth
                  </h3>

                  <div className="w-full flex items-center justify-between   border border-gray-200 p-4 rounded-md">
                    <div>
                      <h3 className="text-[16px] font-medium text-primary-color">
                        👩‍🍼 Empowering Mothers, Nourishing Generations
                      </h3>
                      <p className="text-[12px] font-medium ">
                        Track and support the nutritional health of lactating
                        mothers in your community. Regular checkups help ensure
                        both mother and child thrive during this critical stage.
                      </p>
                    </div>
                  </div>
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
                    className=" w-full text-[14px]  outline-none border-none bg-transparent placeholder:text-[14px]"
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
                        Children Age
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Address
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Status
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Last Checkup
                        </th>
                        <th className="text-[#64748b]  font-medium text-left py-[12px]">
                        Preview
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
                                    {dataSource?.length > 0 ? "No records match your search." : "No lactating data records found."}
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