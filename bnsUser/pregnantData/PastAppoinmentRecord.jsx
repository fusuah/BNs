import { SpadeIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";

const PastAppoinmentRecord = ({ pregnantinformation, setIsRecording }) => {
  const renderDetails = pregnantinformation?.map((data) => {
    {
      return (
        <details
          className="group p-4 w-full  border-b border-gray-200 "
          key={data?._id}
        >
          <summary className="cursor-pointer flex justify-between">
            <span className="font-medium">2025, Jun</span>
            <span className="ml-2 text-sm text-gray-500 group-open:rotate-180 transition-transform">
              <i className="bi bi-chevron-down"></i>
            </span>
          </summary>

          {/* CONTENT */}
          <div className="mt-2 text-gray-700">
            <div className="w-full flex gap-12 mb-2 border-b border-b-gray-200">
              <h3 className="text-sm font-semibold mb-[24px] w-1/2 flex justify-between">
                WeightKg : <b>{data?.weightKg}</b>
              </h3>
              <h3 className="text-sm font-semibold mb-[24px] w-1/2 flex justify-between">
                MUAC : <b>{data?.muacCm}</b>
              </h3>
            </div>
            <div className="w-full flex gap-12 mb-2 border-b border-b-gray-200">
              <h3 className="text-sm font-semibold mb-[24px] w-1/2 flex justify-between">
                Blood Pressure : <b>{data?.bloodPressure}</b>
              </h3>
              <h3 className="text-sm font-semibold mb-[24px] w-1/2 flex justify-between text-nowrap">
                Pregnacy Risk :
                <b className=" text-green-500 ">{data?.pregnacyRisk}</b>
              </h3>
            </div>
            <div className="w-full flex gap-12 mb-2 border-b border-b-gray-200 ">
              <h3 className="text-sm font-semibold mb-[24px] w-full flex justify-between text-nowrap">
                Supplement :{" "}
                <b className="w-full text-center">{data?.supplement}</b>
              </h3>
            </div>

            <div className="w-full flex flex-col gap-1 mb-2 border-b border-b-gray-200 ">
              <h3 className="text-sm font-semibold mb-[12px] w-full flex justify-between text-nowrap">
                Notes :
              </h3>
              <p className="text-sm  mb-[24px] w-full">{data?.note}</p>
            </div>

            <div className="w-full flex flex-col gap-1 mb-2 border-b border-b-gray-200 ">
              <h3 className="text-sm font-semibold mb-[12px] w-full flex justify-between text-nowrap">
                Recommendation
              </h3>

              {data?.recommendation?.map((items, index) => (
                <p className="text-sm  mb-[24px] w-full" key={index}>
                  <b>{items?.title}</b>
                  <br />
                  {items?.description}
                </p>
              ))}
            </div>
          </div>
        </details>
      );
    }
  });

  const formatToYearMonth = (dateString) => {
    return format(new Date(dateString), "yyyy, MMM");
  };

  return (
    <div className="w-full">
      {/* Nutrition Measurements */}

      <h3 className="text-lg font-semibold mb-[24px]">Nutrition Records</h3>

      <div className="w-full flex gap-12 border p-4 border-gray-200 rounded-md ">
        {/* LEFT */}
        <div className="w-1/2  ">
          <h3 className="text-sm font-semibold mb-[24px]">Past Records</h3>
          {renderDetails}
        </div>
        {/* RIGHT */}
        <div className="w-1/2  h-[400px]">
          <h3 className="text-sm font-semibold mb-[24px]">Latest Records</h3>

          <h3 className="text-lg font-semibold mb-[24px]">
            {formatToYearMonth(
              pregnantinformation[pregnantinformation?.length - 1]?.date
            )}
          </h3>
          <div className="w-full flex justify-between mb-[24px]">
            <h3 className="text-sm font-semibold mb-[4px]">
              Blood Pressure <br />
              <span className=" text-lg fonr-semibold">
                {
                  pregnantinformation[pregnantinformation?.length - 1]
                    ?.bloodPressure
                }
              </span>
            </h3>
            <h3 className="text-sm font-semibold mb-[4px]">
              Weight Kg <br />
              <span className=" text-lg fonr-semibold">
                {pregnantinformation[pregnantinformation?.length - 1]?.weightKg}
              </span>
            </h3>
            <h3 className="text-sm font-semibold mb-[4px]">
              MUAC Cm
              <br />
              <span className=" text-lg fonr-semibold">
                {pregnantinformation[pregnantinformation?.length - 1]?.muacCm}
              </span>
            </h3>
          </div>
          <div
            className="w-full flex justify-between  mb-[24px]  
          "
          >
            <h3 className="text-sm font-semibold mb-[4px]">
              Pregnancy Risk
              <br />
              <span className=" text-lg text-primary-color fonr-semibold">
                {
                  pregnantinformation[pregnantinformation?.length - 1]
                    ?.pregnacyRisk
                }
              </span>
            </h3>
            <h3 className="text-sm font-semibold mb-[4px] w-[54%]">
              Supplement
              <br />
              <span className=" text-lg text-secondary-color fonr-semibold">
                {
                  pregnantinformation[pregnantinformation?.length - 1]
                    ?.supplement
                }
              </span>
            </h3>
          </div>

          <h3 className="text-sm font-semibold mb-[24px]">
            Add new monthly Records
          </h3>

          <div className="w-full flex justify-center items-center border border-gray-200 rounded-md py-8 ">
            <button
              className="bg-[#4CAF50]  py-[8px] px-[22px] rounded-md text-white text-[12px] font-semibold cursor-pointer"
              onClick={() => setIsRecording(true)}
            >
              {" "}
              <i className="bi bi-plus mr-4"></i> Add New Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastAppoinmentRecord;
