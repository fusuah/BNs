import React from "react";
import { differenceInYears } from "date-fns";

const ModalInfo = ({
  modalInfoOpen,
  setModalInfoOpen,
  name,
  expectedDelivery,
  category,
  address,
  email,
  status,
  birthDate,
  number,
  pregnantinformation,
}) => {
  /* const modalInfoOpen = true; */
  const setBg = (txt) => {
    if (txt?.toLowerCase() === "low") {
      return "#4CAF50";
    } else if (txt?.toLowerCase() === "moderate") {
      return "#FFC107";
    } else if (txt?.toLowerCase() === "high") {
      return "#2196F3";
    } else if (txt?.toLowerCase() === "very high") {
      return "#EF5350";
    } else {
      return "#ffffff";
    }
  };

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return "N/A";
    const birthDate = new Date(birthDateStr);
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) return "N/A";
    const today = new Date();
    return differenceInYears(today, birthDate);
  };
  return (
    <div
      className={`h-screen w-screen flex  justify-center items-center bg-[#00000082] fixed top-0 left-0 z-[999] ${
        modalInfoOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-md relative ">
        <button
          className="absolute right-[5%] top-6"
          onClick={() => setModalInfoOpen(false)}
        >
          <i className="bi bi-x"></i>
        </button>

        <div className="w-[716px]  border border-gray-200 overflow-auto rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-[6px] ">{name}</h2>{" "}
          <div className="flex gap-2">
            <p className="text-[14px] text-[#64748b] mb-2 ">{category}</p>
            <p
              className={`bg-[${setBg(
                status
              )}] rounded-full text-white px-2 text-[14px] h-min  `}
            >
              {status}
            </p>
          </div>
          {/* FIRST INFO */}
          <div className="w-full flex gap-4 mb-4">
            <div className="w-1/2">
              <p className="text-[14px] text-[#64748b] mb-2 font-medium">
                Personal Information
              </p>
              {/* EXPECTEDDELIVERY */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  ExpectedDelivery :
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {expectedDelivery}
                </p>
              </div>
              {/* AGE */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  Age:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {calculateAge(birthDate?.slice(0, 10))}
                </p>
              </div>
              {/* BIRTHDATE */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  Birth Date:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {birthDate?.slice(0, 10)}
                </p>
              </div>
              {/* CONTACT */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  Contact Number:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {number}
                </p>
              </div>
            </div>

            {/* */}
            <div className="w-1/2">
              <p className="text-[14px] text-[#64748b] mb-2 font-medium">
                Address Information
              </p>
              {/* ADDRESS / STREET */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  Address:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {address}
                </p>
              </div>
              {/* EMAIL */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  Email:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  {email}
                </p>
              </div>
              {/*BNS CODE */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                  BNS-code:
                </p>
                <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                  BNS - ****
                </p>
              </div>
            </div>
          </div>
          {/* SECOND INFO */}
          <div className="w-full flex flex-col  mb-4">
            <p className="text-[14px] text-[#64748b] mb-2 font-medium">
              Health Information
            </p>

            <div className="w-full flex">
              {/* 2A */}
              <div className="w-full">
                {/* PREGNANCY RISK  */}
                <div className="w-full flex">
                  <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                    Pregnancy Risk:
                  </p>
                  <p
                    className={`bg-[${setBg(
                      pregnantinformation &&
                        pregnantinformation[pregnantinformation.length - 1]
                          ?.pregnacyRisk
                    )}] rounded-full text-white px-2 text-[14px] h-min  `}
                  >
                    {pregnantinformation &&
                      pregnantinformation[pregnantinformation.length - 1]
                        ?.pregnacyRisk}
                  </p>
                </div>
                {/* BLOOD PRESSURE */}
                <div className="w-full flex">
                  <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                    Blood Pressure:
                  </p>
                  <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                    {pregnantinformation &&
                      pregnantinformation[pregnantinformation.length - 1]
                        ?.bloodPressure}
                  </p>
                </div>
              </div>

              {/* 2B */}
              <div className="w-full">
                <p className="text-[14px] text-[#64748b] mb-2 font-medium"></p>
                {/* WEIGHT */}
                <div className="w-full flex">
                  <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                    Weight:
                  </p>

                  <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                    {pregnantinformation &&
                      pregnantinformation[pregnantinformation.length - 1]
                        ?.weightKg}
                    Kg
                  </p>
                </div>
                {/* MUAC */}
                <div className="w-full flex">
                  <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                    MUAC:
                  </p>
                  <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                    {pregnantinformation &&
                      pregnantinformation[pregnantinformation.length - 1]
                        ?.muacCm}
                    Cm
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex items-start ">
              <p className="text-[14px] text-black mb-2 font-medium w-1/2">
                Supplement :
              </p>
              <p className="text-[14px] text-black mb-2 font-regular w-1/2">
                {pregnantinformation &&
                  pregnantinformation[pregnantinformation.length - 1]
                    ?.supplement}
              </p>
            </div>
          </div>
          {/* THIRD INFO */}
          <div className="w-full flex gap-4  h-[200px] mb-4">
            <div className="w-full">
              <p className="text-[14px] text-[#64748b] mb-2 font-medium">
                Notes
              </p>

              {/* LAST CHECKUP */}
              <div className="w-full flex">
                <p className="text-[14px] text-black mb-2 font-regular w-full p-3 bg-[#f8fafc] rounded-sm">
                  {pregnantinformation &&
                    pregnantinformation[pregnantinformation.length - 1]?.note}
                </p>
              </div>
            </div>

            <div className="w-full h-full overflow-auto">
              <p className="text-[14px] text-[#64748b] mb-2 font-medium">
                Recommendation:
              </p>
              {/* RECOMMENDATION STATUS   */}
              <div className="w-full flex flex-col gap-2 bg-[#f8fafc] h-full">
                {pregnantinformation &&
                  pregnantinformation[
                    pregnantinformation.length - 1
                  ]?.recommendation?.map((data, index) => {
                    return (
                      <div className="w-full p-2 " key={index}>
                        <p className="text-[14px] text-black mb-2  w-full font-bold ">
                          {data?.title}
                        </p>{" "}
                        <p className="text-[14px] text-black mb-2 font-regular w-full ">
                          {data?.description}
                        </p>
                      </div>
                    );
                  })}{" "}
              </div>
            </div>
          </div>
          {/* BTN GROUP */}
          <div className="w-full flex justify-end gap-2 items-center">
            <button
              className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
              onClick={() => setModalInfoOpen(false)}
            >
              Cancel
            </button>

            <button className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50">
              Edit Beneficiary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;