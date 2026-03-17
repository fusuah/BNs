"use client";
import { useEffect, useState } from "react";
import { useGetAllRequestQuery } from "@/service/request/requestApiSlice";
import { Clock, CheckCircle } from "lucide-react";

export default function ReqList() {
  const { data, isLoading } = useGetAllRequestQuery();
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    // Safely handle data structure
    if (data?.data && Array.isArray(data.data)) {
        setFilterData(data.data);
    } else if (Array.isArray(data)) {
        setFilterData(data);
    } else {
        setFilterData([]);
    }
  }, [data]);

  if (isLoading) return <div className="text-xs text-gray-500 text-center py-4">Loading requests...</div>;

  if (!filterData || filterData.length === 0) {
      return <div className="text-xs text-gray-400 text-center py-4">No recent requests found.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
      {filterData.map((item) => (
        <div
          key={item._id}
          className={`p-3 rounded-lg border flex flex-col gap-2 bg-white shadow-sm ${
            item.isdone ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"
          }`}
        >
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                {item.isdone ? (
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                ) : (
                    <Clock size={14} className="text-amber-500 shrink-0" />
                )}
                <span className="text-xs font-semibold text-gray-800 line-clamp-1">{item.reqtype || "Request"}</span>
             </div>
             <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
             </span>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 pl-6">
             {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}