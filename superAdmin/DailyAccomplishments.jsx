"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DailyAccomplishments() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(`/api/superAdmin/daily-reports?date=${today}`);
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-4 bg-white rounded-xl shadow animate-pulse h-40">Loading Activities...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          Today's BNS Activity & Attendance
        </h2>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          {new Date().toDateString()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
            <tr>
              <th className="px-4 py-3">BNS Worker</th>
              <th className="px-4 py-3">Barangay</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Accomplishments (Task/Diary)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                  No activity recorded yet today.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-200">
                      {report.userId?.imgUrl ? (
                        <Image src={report.userId.imgUrl} alt="dp" fill className="object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xs">NA</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {report.userId?.fullName || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{report.userId?.barangay || "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col text-xs">
                      <span className="text-green-600">
                        IN: {report.timeIn ? new Date(report.timeIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      </span>
                      <span className="text-red-600">
                        OUT: {report.timeOut ? new Date(report.timeOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {report.diary?.content ? (
                      <p className="mb-1 text-gray-800 italic">"{report.diary.content.substring(0, 50)}..."</p>
                    ) : null}
                    {report.tasks && Object.keys(report.tasks).length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(report.tasks)
                          .filter(([_, status]) => status === true || status?.completed === true)
                          .map(([taskName], idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded border border-blue-100">
                              {taskName}
                            </span>
                          ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}