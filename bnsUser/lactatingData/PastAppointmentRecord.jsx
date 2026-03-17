import React from "react";

function PastAppointmentRecord({
  lactatingInformation,
  setIsRecording,
  lactatingUser,
}) {
  const renderDetails = lactatingInformation?.map((data, index) => {
    return (
      <details
        className="group p-4 w-full  border-b border-gray-200 "
        key={data?._id}
      >
        <summary className="cursor-pointer flex justify-between mb-1">
          <span className="font-medium">2025, Jun</span>
          <span className="ml-2 text-sm text-gray-500 group-open:rotate-180 transition-transform">
            <i className="bi bi-chevron-down"></i>
          </span>
        </summary>
        {/* CONTENT */}
        <div className="mt-4 text-gray-700">
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
              Breestfeed Status : <b>{data?.breestFeedStatus}</b>
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
  });
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-[24px]">Nutrition Records</h3>
      <div className="w-full flex gap-12 border p-4 border-gray-200 rounded-md ">
        {/* LEFT */}
        <div className="w-1/2  ">
          <h3 className="text-sm font-semibold mb-[24px]">Past Records</h3>
          {renderDetails}
        </div>
        {/* RIGHT */}
        <div className="w-1/2  h-fit">
          {/*  */}

          <div className="w-full flex">
            <div className="flex w-1/2 gap-4">
              <div className="h-16 w-16 min-w-16 bg-green-100 rounded-full overflow-hidden">
                <img
                  src={
                    lactatingUser?.imgUrl
                      ? lactatingUser?.imgUrl
                      : "/asset/default-dp.jpg"
                  }
                  className="h-full w-full scale-[1.2] rounded-full"
                  alt="User Avatar"
                />
              </div>
              {/* NAME/EMAIl */}
              <div className="">
                <h3 className="text-lg font-semibold mt-2">
                  {lactatingUser?.name}
                </h3>
                <h1 className="text-sm text-gray-500 mb-8">
                  {lactatingUser?.email}
                </h1>
              </div>
            </div>

            <div className="w-1/2 flex justify-between  mb-[24px]">
              <h3 className="text-sm font-semibold mb-[4px]">
                Age <br />
                <span className=" text-lg fonr-semibold">
                  {lactatingUser?.age}
                </span>
              </h3>
              <h3 className="text-sm font-semibold mb-[4px]">
                Child Age <br />
                <span className=" text-lg fonr-semibold">
                  {lactatingUser?.childAge}
                </span>
              </h3>{" "}
              <h3 className="text-sm font-semibold mb-[4px]">
                Weight <br />
                <span className=" text-lg fonr-semibold">
                  {
                    lactatingUser?.lactatinginformation[
                      lactatingInformation?.length - 1
                    ]?.weightKg
                  }
                </span>
              </h3>
            </div>
          </div>

          {/*  */}
          <div
            className="w-full flex justify-between gap-2  mb-[24px]  
          "
          >
            <h3 className="text-sm font-semibold mb-[4px] w-full">
              Address
              <br />
              <span className=" text-lg fonr-semibold">
                {lactatingUser?.address}
              </span>
            </h3>

            <h3 className="text-sm font-semibold mb-[4px] w-full">
              Status
              <br />
              <span className=" text-lg fonr-semibold">
                {
                  lactatingUser?.lactatinginformation[
                    lactatingInformation?.length - 1
                  ]?.breestFeedStatus
                }
              </span>
            </h3>
          </div>

          <h3 className="text-sm font-semibold mb-[24px]">
            Add new monthly Records
          </h3>

          <div className="w-full flex justify-center items-center border border-gray-200 rounded-md py-8 ">
            <button
              onClick={() => setIsRecording(true)}
              className="bg-[#4CAF50]  py-[8px] px-[22px] rounded-md text-white text-[12px] font-semibold cursor-pointer"
            >
              {" "}
              <i className="bi bi-plus mr-4"></i> Add New Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastAppointmentRecord;
