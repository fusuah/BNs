"use client";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { Pill, Send, History, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useGetOneBnsWorkerQuery } from "@/service/auth/autApiSlice";

export default function RequestSupplyWidget() {
  const { id: userId, barangay } = useAuth();
  
  // Fetch full user details to get the name
  const { data: userData } = useGetOneBnsWorkerQuery(userId);
  const requesterName = userData?.fullName || "BNS User";

  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  
  // Form States
  const [requestCategory, setRequestCategory] = useState("Vitamins/Medicine");
  const [selectedItem, setSelectedItem] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("form"); // 'form' or 'history'

  const categories = ["Vitamins/Medicine", "Equipment", "Forms/Documents", "Others"];

  // Fetch Inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        // Handle variations in API response structure
        if (Array.isArray(data)) {
          setInventory(data);
        } else if (data.data && Array.isArray(data.data)) {
          setInventory(data.data);
        } else {
          setInventory([]);
        }
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };
    fetchInventory();
  }, []);

  // Fetch History
  const fetchHistory = async () => {
    if (!requesterName) return; // Wait for name to be available
    try {
      const res = await fetch(`/api/request`);
      if (res.ok) {
        const responseData = await res.json();
        // Fix: The API returns { data: [...] }, so we need to access .data
        const allRequests = responseData.data || [];

        if (Array.isArray(allRequests)) {
          const myRequests = allRequests
            .filter((req) => req.requestedBy === requesterName) // Filter by Name
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(myRequests);
        } else {
          setRequests([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (view === "history") {
      fetchHistory();
    }
  }, [view, requesterName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let content = "";

    if (requestCategory === "Vitamins/Medicine") {
      if (!selectedItem) return toast.error("Please select an item");
      content = `Requesting ${quantity} unit(s) of ${selectedItem}`;
    } else if (requestCategory === "Others") {
      if (!customRequest) return toast.error("Please specify your request");
      content = `Other Request: ${customRequest}`;
    } else {
      if (!customRequest) return toast.error("Please specify details");
      content = `${requestCategory}: ${customRequest}`;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        body: JSON.stringify({
          reqtype: requestCategory,
          content: content,
          requestedBy: requesterName, // Using Name as requested
          barangay: barangay || "Unknown",
          isdone: false,
        }),
      });

      if (res.ok) {
        toast.success("Request sent to Admin");
        setSelectedItem("");
        setCustomRequest("");
        setQuantity(1);
        setView("history"); // Switch to history view on success
      } else {
        toast.error("Failed to send request");
      }
    } catch (error) {
      toast.error("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
          <Pill size={16} className="text-blue-500" /> Request Supplies
        </h3>
        <div className="flex bg-gray-100 rounded-md p-0.5">
          <button
            onClick={() => setView("form")}
            className={`px-2 py-1 text-[10px] font-medium rounded-sm transition-all ${
              view === "form"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setView("history")}
            className={`px-2 py-1 text-[10px] font-medium rounded-sm transition-all flex items-center gap-1 ${
              view === "history"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <History size={10} /> History
          </button>
        </div>
      </div>

      {view === "form" ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 flex-1 flex flex-col justify-center"
        >
          {/* Category Selection */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">
              Request Category
            </label>
            <select
              value={requestCategory}
              onChange={(e) => setRequestCategory(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 text-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Inputs based on Category */}
          {requestCategory === "Vitamins/Medicine" ? (
            <>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  Select Item
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                >
                  <option value="">-- Select Inventory Item --</option>
                  {inventory.map((item) => (
                    <option key={item._id} value={item.itemName}>
                      {item.itemName} ({item.unit}) - Stock: {item.quantity}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">
                {requestCategory === "Others" ? "Specify Request" : "Details"}
              </label>
              <textarea
                rows="3"
                placeholder={
                  requestCategory === "Others"
                    ? "Please describe what you need..."
                    : "Enter additional details..."
                }
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs flex items-center justify-center gap-2 transition-colors disabled:bg-blue-400 py-2 mt-2"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <Send size={14} /> SUBMIT REQUEST
              </>
            )}
          </button>

          <p className="text-[10px] text-gray-400 mt-1 text-center">
            Requests are subject to approval by the MNAO Admin.
          </p>
        </form>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {requests.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <History size={24} className="mb-2 opacity-50" />
              <p className="text-xs">No request history found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-start"
                >
                  <div>
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium mb-1">
                      {req.reqtype || "Request"}
                    </span>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                      {req.content}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="shrink-0 ml-2">
                    {req.isdone ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Done
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}