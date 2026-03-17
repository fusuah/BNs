"use client";
import UserAccessRequests from "@/components/superAdmin/UserAccessRequest";
import NewBnsModal from "@/components/ui/modals/NewBnsModal";
import {
  useGetAllRequestQuery,
  useUpdateRequestMutation,
} from "@/service/request/requestApiSlice";
import { Check, CircleAlert, Clock, FileText, User, UserPlus, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function SuperAdminUserApprovalPage() {
  const { data, refetch } = useGetAllRequestQuery();
  const [approveData, { isLoading: isApproving }] = useUpdateRequestMutation();
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    if (data?.data) {
      const filtered = data?.data.filter((req) => req?.isdone === false);
      setFilterData(filtered);
    }
  }, [data]);

  const approve = async (id) => {
    if (id) {
      try {
        const res = await approveData({ id, isdone: true }).unwrap();
        if (res) {
          toast.success("Request approved successfully");
          refetch();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to approve request");
      }
    }
  };

  return (
    <div className="text-gray-800 p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage BNS users and approve pending access requests</p>
        </div>
        <button
          className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none gap-2 px-4 h-10 rounded-lg shadow-sm transition-all flex items-center"
          onClick={() => document.getElementById("addBns").showModal()}
        >
          <UserPlus size={18} />
          <span>Add New BNS</span>
        </button>
      </div>

      {/* User Access Requests Component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <UserAccessRequests />
      </div>

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
                <p className="text-sm text-gray-500">Review and approve supply or document requests</p>
            </div>
        </div>

        {filterData?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">No pending requests to review at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterData.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {typeof item?.requestedBy === 'object' 
                                ? item?.requestedBy?.fullName?.charAt(0) || "U"
                                : typeof item?.requestedBy === 'string' ? item.requestedBy.charAt(0) : "U"}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 line-clamp-1">
                                {typeof item?.requestedBy === 'object' 
                                ? item?.requestedBy?.fullName 
                                : item?.requestedBy || "Unknown User"}
                            </h4>
                            <p className="text-xs text-gray-500">
                                {typeof item?.requestedBy === 'object' && item?.requestedBy?.barangay 
                                ? item.requestedBy.barangay 
                                : "BNS User"}
                            </p>
                        </div>
                    </div>
                    <span className="bg-yellow-50 text-yellow-700 text-[10px] font-medium px-2 py-1 rounded-full border border-yellow-100 uppercase tracking-wide">
                        Pending
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <CircleAlert className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Type</p>
                            <p className="font-medium">{item?.reqtype}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600 p-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-sm line-clamp-3">{item?.content}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none w-full flex items-center justify-center gap-2"
                    onClick={() => approve(item?._id)}
                    disabled={isApproving}
                  >
                    {isApproving ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <>
                            <Check className="w-4 h-4" /> Approve Request
                        </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewBnsModal id={"addBns"} refetch={refetch} />
    </div>
  );
}

export default SuperAdminUserApprovalPage;