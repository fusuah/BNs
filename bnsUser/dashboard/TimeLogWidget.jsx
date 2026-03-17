"use client";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { Clock, LogIn, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function TimeLogWidget() {
  const { id: userId } = useAuth();
  const [status, setStatus] = useState({ timeIn: null, timeOut: null });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStatus = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/bnsUsers/attendance?userId=${userId}`);
      if(res.ok) {
          const data = await res.json();
          setStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch attendance status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const handleLog = async (action) => {
    setLoading(true);
    try {
      const res = await fetch("/api/bnsUsers/attendance", {
        method: "POST",
        body: JSON.stringify({ userId, action }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message);
        setStatus(prev => ({ 
            ...prev, 
            timeIn: action === 'timeIn' ? new Date() : prev.timeIn,
            timeOut: action === 'timeOut' ? new Date() : prev.timeOut 
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col justify-center">
      <h3 className="text-gray-800 font-medium mb-4 flex items-center gap-2 text-sm">
        <Clock size={16} /> DAILY ATTENDANCE
      </h3>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => handleLog("timeIn")}
          disabled={loading || !!status.timeIn}
          className={`flex-1 py-3 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
            status.timeIn
              ? "bg-green-50 text-green-700 cursor-not-allowed border-green-100 border"
              : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
          }`}
        >
          <LogIn size={20} />
          <span className="font-bold text-xs">
            {mounted && status.timeIn 
              ? `IN: ${new Date(status.timeIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` 
              : "TIME IN"}
          </span>
        </button>

        <button
          onClick={() => handleLog("timeOut")}
          disabled={loading || !status.timeIn || !!status.timeOut}
          className={`flex-1 py-3 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
            status.timeOut
              ? "bg-red-50 text-red-700 cursor-not-allowed border-red-100 border"
              : !status.timeIn 
                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                 : "bg-red-500 text-white hover:bg-red-600 shadow-sm"
          }`}
        >
          <LogOut size={20} />
          <span className="font-bold text-xs">
             {mounted && status.timeOut 
              ? `OUT: ${new Date(status.timeOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` 
              : "TIME OUT"}
          </span>
        </button>
      </div>
      
      <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-wider">
        {mounted && new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </p>
    </div>
  );
}