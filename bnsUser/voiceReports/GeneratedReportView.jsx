import React from "react";

const GeneratedReportView = ({
  generatedReportOpen,
  setGeneratedReportOpen,
}) => {
  return (
    <div
      className={`h-screen w-screen flex justify-center items-center bg-[#00000082] fixed top-0 left-0 z-[999] ${
        generatedReportOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-md relative">
        <button
          className="absolute right-[5%] top-6"
          onClick={() => setGeneratedReportOpen(false)}
        >
          <i className="bi bi-x"></i>
        </button>
        <h2 className="text-[18px] font-semibold mb-[6px]">
          Auto-Generated Report
        </h2>{" "}
        <p className="text-[14px]  text-[#64748b]  mb-4">
          We've analyzed your recording and extracted the key information.
        </p>
        {/*  */}
        <h2 className="text-[24px] font-semibold mt-4">Generated Summary</h2>
        <p className="text-[14px]  text-[#64748b]  mb-4">
          Today I visited 5 households with children under 5 years old. I
          identified 2 children with signs of ...
        </p>
        <h2 className="text-[24px] font-semibold mt-4">Detected Information</h2>
        <ul className="mg-4">
          <li className="text-[14px]  text-black"> Children: 2</li>
          <li className="text-[14px]  text-black"> Visits: 5</li>
          <li className="text-[14px]  text-black">Visits: 3</li>
        </ul>{" "}
        <p className="text-[12px]  text-[#64748b]  mb-4">
          We've analyzed your recording and extracted the key information.
        </p>
        <div className="w-full flex justify-end mt-4 gap-4">
          {" "}
          <button
            className="py-[8px] px-[12px] cursor-pointer font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:bg-[#FFC105]  hover:text-black"
            onClick={() => setGeneratedReportOpen(false)}
          >
            Close
          </button>{" "}
          <button className="py-[8px] px-[12px] cursor-pointer font-semibold bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50">
            <i className="bi bi-file-earmark-text "></i>
            Export to Excel
          </button>
          <button className="py-[8px] px-[12px] cursor-pointer text-white font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200 bg-[#2196F3]  hover:opacity-50">
            <i className="bi bi-file-earmark "></i>
            Export to PDF
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default GeneratedReportView;
