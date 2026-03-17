"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { myReports } from "@/data/bnsUserSampleData";
import GeneratedReportView from "@/components/bnsUser/voiceReports/GeneratedReportView";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const VoiceReport = () => {
  const { id } = useAuth();
  const router = useRouter();
  const [view, setView] = useState("MR");

  const [isRecording, setIsRecording] = useState(false);
  const [generatedReportOpen, setGegeneratedReportOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  /* AI */
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);
  const finalTranscriptRef = useRef("");

  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-3 rounded-md pointer-cursor
        ${
          view === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  /* COUTING TIME WHILE RECORD */

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0); // reset timer when recording stops
      clearInterval(interval);
    }

    return () => clearInterval(interval); // cleanup on unmount or isRecording change
  }, [isRecording]);

  const formatTime = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  /* START THE RECORDING */
  const startStopRecording = () => {
    if (isRecording) {
      alert(formatTime(seconds));
      setIsRecording((prev) => !prev);
    } else {
      setIsRecording((prev) => !prev);
    }
  };

  console.log(text);

  const toggleRecording = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    if (isRecording && recognitionRef.current) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      return;
    }

    manualStopRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      // Append all new results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Add final transcript chunk to buffer
          finalTranscriptRef.current += result[0].transcript + " ";
        } else {
          // Collect interim transcript
          interimTranscript += result[0].transcript;
        }
      }

      // Show combined: final + interim live update
      setText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!manualStopRef.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  /* SAMPLE DATA RENDERING */
  const submittedReport = myReports?.map((data) => {
    if (data?.status.toLowerCase() === "submitted") {
      return (
        <div className="w-full flex flex-col items-end gap-4" key={data?.id}>
          <div className="w-full border border-gray-200 p-[24px] rounded-md">
            {/*Report Card Title */}
            <div className="w-full flex justify-between items-center">
              <h3 className="text-[18px] font-semibold">{data?.reportTitle}</h3>

              <span className="text-[12px] py-0.5 px-2.5 bg-[#4CAF50] text-white rounded-full">
                {data?.status}
              </span>
            </div>

            <p className="text-[14px]  text-[#64748b] mb-[8px]">
              {data?.reportDate} • {data?.voiceReport}
            </p>
            <p className="text-[14px]  text-black mb-[24px]">
              {data?.reportContent}{" "}
            </p>
            <div className="w-full flex justify-end items-center">
              {" "}
              <button className="flex gap-2 items-center justify-center py-[8px] px-[12px] border border-gray-200 text-[14px] rounded-md">
                <i className="bi bi-file-earmark-text"></i> View Details
              </button>
            </div>
          </div>

          {/* Button Container */}

          <div className="w-full flex justify-end items-center">
            {" "}
            <button
              className="flex gap-2 items-center justify-center py-[8px] px-[12px] border border-gray-200 text-[14px] rounded-md"
              onClick={() => setGegeneratedReportOpen(true)}
            >
              <i className="bi bi-file-earmark-text"></i> Auto Report
            </button>
          </div>
        </div>
      );
    }
  });

  const draftReport = myReports?.map((data) => {
    if (data?.status.toLowerCase() === "draft") {
      return (
        <div className="w-full flex flex-col items-end gap-4" key={data?.id}>
          <div className="w-full border border-gray-200 p-[24px] rounded-md">
            {/*Report Card Title */}
            <div className="w-full flex justify-between items-center">
              <h3 className="text-[18px] font-semibold">{data?.reportTitle}</h3>

              <span className="text-[12px] py-0.5 px-2.5 bg-gray-500 text-white rounded-full">
                {data?.status}
              </span>
            </div>

            <p className="text-[14px]  text-[#64748b] mb-[8px]">
              {data?.reportDate} • {data?.voiceReport}
            </p>
            <p className="text-[14px]  text-black mb-[24px]">
              {data?.reportContent}{" "}
            </p>
            <div className="w-full flex justify-end items-center">
              {" "}
              <button className="flex gap-2 items-center justify-center py-[8px] px-[12px] border border-gray-200 text-[14px] rounded-md">
                <i className="bi bi-file-earmark-text"></i> View Details
              </button>
            </div>
          </div>

          {/* Button Container */}

          <div className="w-full flex justify-end items-center"></div>
        </div>
      );
    }
  });

  const sendReports = () => {
    console.log({
      userId: id,
      title,
      text,
    });
  };
  useEffect(() => {
    router.push("/bnsUser/voiceReport/nutritionistForm");
  });
  return (
    <>
      <GeneratedReportView
        generatedReportOpen={generatedReportOpen}
        setGeneratedReportOpen={setGegeneratedReportOpen}
      />

      {/* EXPORT MODAL */}
      <div
        className={`h-screen w-screen flex justify-center items-center bg-[#00000082] fixed top-0 left-0 z-[999] ${
          exportModalOpen ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-md relative">
          {" "}
          <button
            className="absolute right-[5%] top-6"
            onClick={() => setExportModalOpen(false)}
          >
            <i className="bi bi-x"></i>
          </button>
          <h2 className="text-[18px] font-semibold mb-[6px]">Export Reports</h2>{" "}
          <p className="text-[14px]  text-[#64748b]  mb-4">
            Choose a format to export your voice reports.
          </p>
          <div className="w-full flex justify-end mt-4 gap-4">
            <button className="py-[8px] px-[16px] cursor-pointer font-semibold bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50">
              <i className="bi bi-file-earmark-text "></i>
              Export to Excel
            </button>
            <button className="py-[8px] px-[16px] cursor-pointer text-white font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200 bg-[#2196F3]  hover:opacity-50">
              <i className="bi bi-file-earmark "></i>
              Export to PDF
            </button>{" "}
          </div>
        </div>
      </div>

      {/*  */}
      <div className="w-full">
        {/* Mini Nav */}

        <div className="w-full flex justify-between items-center">
          <div className="bg-[#F1F5F9] rounded-md p-2 inline-block mb-[24px]">
            <button className={linkClasses("MR")} onClick={() => setView("MR")}>
              My Reports
            </button>
            <button className={linkClasses("RN")} onClick={() => setView("RN")}>
              Record New
            </button>
          </div>

          {/* Button Group */}
          <div className="flex items-center justify-center gap-4">
            <button
              className="py-[8px] px-[12px] cursor-pointer font-semibold bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50"
              onClick={() => setView("RN")}
            >
              <i className="bi bi-mic "></i>
              New Recording
            </button>
            <button
              className="py-[8px] px-[12px] cursor-pointer font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:bg-[#FFC105]  hover:text-black"
              onClick={() => setExportModalOpen(true)}
            >
              <i className="bi bi-download "></i>
              Export
            </button>
          </div>
        </div>

        {view === "RN" ? (
          <div className="w-full  p-[24px] bg-white border border-gray-200 rounded-md ">
            <h3 className="text-[24px] font-semibold mb-[24px]">
              Voice-to-Text Report
            </h3>

            {/* TITLE INPUT */}
            <div className="w-full mb-[16px]">
              <label
                htmlFor="reportTitle"
                className="text-sm font-medium mb-2 inline-block"
              >
                Report Title
              </label>
              <input
                type="text"
                id="reportTitle"
                className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="reportTitle"
                placeholder="Enter Report Title"
                value={title}
                onChange={(e) => setTitle(e?.target?.value)}
              />
            </div>

            <div className="w-full flex items-center justify-between mb-[8px]">
              <p classame="text-sm font-semibold mb-2 "> Recording</p>

              <span className={` gap-2 ${isRecording ? "flex" : "hidden"}`}>
                <i className="bi bi-circle-fill text-red-700  animate-[blink_1s_infinite]"></i>
                <p classame="text-sm font-semibold mb-2 ">
                  {formatTime(seconds)}
                </p>
              </span>
            </div>

            <div className="w-full py-4 flex items-center justify-center mb-[16px]">
              <button
                className={`py-[8px] px-[12px] cursor-pointer font-semibold  text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50 ${
                  isRecording ? "bg-[#F05656]" : "bg-[#4CAF50]"
                }`}
                onClick={() => toggleRecording()}
              >
                <i className={`bi bi-${isRecording ? "app" : "mic"} `}></i>
                {!isRecording ? "Start Recording" : "Stop Recording"}
              </button>
            </div>

            {/* RECORDING INPUT */}
            <div className="w-full mb-[24px]">
              <label
                htmlFor="reportContent"
                className="text-sm font-medium mb-2 inline-block"
              >
                Report Content
              </label>
              <textarea
                type="text"
                id="reportContent"
                className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[178px] "
                name="reportContent"
                placeholder="Your Recoding will appear here. You can also type or edit manually"
                value={text}
                onChange={(e) => setText(e.target?.value)}
              ></textarea>
            </div>

            {/* RECORDING INPUT */}
            <div className="w-full mb-[24px]">
              <label
                htmlFor="reportFile"
                className="text-sm font-medium mb-2 inline-block"
              >
                Report Form
              </label>
              <input
                type="file"
                id="reportFile"
                accept=".pdf,.docs,.doc"
                className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2  "
                name="reportFile"
                placeholder="Your Recoding will appear here. You can also type or edit manually"
                /*     value={text} */
                /*     onChange={(e) => setText(e.target?.value)} */
              />
            </div>

            {/* BUTTON GROUP */}
            <div className="w-full flex justify-between items-center">
              <button className=" border border-gray-200 text-[12px]  flex items-center justify-center gap-2  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]">
                <i className="bi bi-file-earmark"></i> Draft
              </button>

              <button
                className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-2 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
                onClick={() => sendReports()}
              >
                <i className="bi bi-check"></i> Submit Report
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex gap-6  ">
            {/* SUBMITTED REPORTS */}
            <div className="w-1/2  p-[24px] bg-white border border-gray-200 rounded-md ">
              <h3 className="text-[24px] font-semibold">Submitted Reports</h3>
              <p className="text-[14px]  text-[#64748b] mb-[24px]">
                Reports that have been submitted to the system
              </p>
              {/* Report Card */}

              {submittedReport}
            </div>

            {/* DRAFT REPORTS */}
            <div className="w-1/2  p-[24px] bg-white  border border-gray-200 rounded-md ">
              <h3 className="text-[24px] font-semibold">Draft Reports</h3>
              <p className="text-[14px]  text-[#64748b] mb-[24px]">
                Reports that are still in draft mode
              </p>

              {draftReport}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VoiceReport;
