"use client";
import useAuth from "@/hooks/useAuth";
import {
  useGetuserAccountDataQuery,
  useUpdateBeneficiaryDataMutation,
} from "@/service/beneficiaryPortal/beneficiaryApiSlice";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileEdit,
  SquarePen,
  Calendar,
  UserRound,
  FileText,
  Clipboard,
  Building2 // Added icon for municipality
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function GuardianProfilePage() {
  const { user_type, id } = useAuth();

  /* API CALL - skip if no ID */
  const { data: beneficiaryData, isLoading, isFetching } = useGetuserAccountDataQuery(
    { id, user_type },
    { skip: !id || !user_type }
  );

  const [updateUser, { isError, error }] = useUpdateBeneficiaryDataMutation();

  const [userData, setuserData] = useState({
      name: "",
      email: "",
      number: "",
      address: "",
      municipality: "", 
      birthDate: "",
      ageMonths: "",
      imgUrl: "",
      createdAt: ""
  });

  useEffect(() => {
    if (beneficiaryData?.data) {
      console.log("Guardian Profile Data:", beneficiaryData.data);
      setuserData(beneficiaryData.data);
    }
  }, [beneficiaryData]);

  const formateDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onChangeValue = (e) => {
    const { value, name } = e.target;
    setuserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    userData?.name !== beneficiaryData?.data?.name ||
    userData?.address !== beneficiaryData?.data?.address ||
    userData?.number !== beneficiaryData?.data?.number ||
    userData?.email !== beneficiaryData?.data?.email ||
    userData?.municipality !== beneficiaryData?.data?.municipality;

  const updateNow = async () => {
    if (hasChanges) {
      const res = await updateUser({
        ...userData, 
        number: parseInt(userData.number) || 0,
        id,
        user_type,
      });

      if (res?.data && !isError) {
        toast.success("Updated Data!", {
          style: { background: "#333", color: "#fff" },
        });
      } else {
        toast.error(error?.data?.message || "Update Failed", {
          style: { background: "#333", color: "#fff" },
        });
      }
    }
  };

  if (isLoading || isFetching) {
      return (
        <div className="p-8 w-full h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading profile information...
        </div>
      );
  }

  // Fallback if no data found
  if (!isLoading && !userData?._id && !beneficiaryData?.data) {
       return <div className="p-8 text-center text-gray-500">User profile not found.</div>;
  }

  return (
    <div className="text-black">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user_type === "children"
              ? "Guardian Profile"
              : "Beneficiary Profile"}
          </h1>
          <p className="text-muted-foreground">
            Your personal information and account details
          </p>
        </div>
      </div>

      {/*Guardian Profile */}
      <div className="p-6 bg-white my-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative">
            <div className="h-24 w-24 border-bns-primary rounded-full overflow-hidden bg-gray-100">
              <img
                src={userData?.imgUrl || "/asset/default-dp.jpg"}
                className="w-full h-full object-cover"
                alt="Profile"
                onError={(e) => { e.target.src = "/asset/default-dp.jpg"; }}
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold">{userData?.name || "No Name"}</h2>
              <p className="text-muted-foreground">ID: {userData?._id || "..."}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {user_type === "children" ? (
                <>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Primary Guardian
                  </div>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Mother
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </div>
                </>
              ) : (
                <>
                  {user_type === "pregnant" && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Pregnant
                    </div>
                  )}
                  <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="bg-blue-50 px-4 py-2 rounded-md">
              <p className="text-sm text-blue-700">Account Created</p>
              <p className="font-medium text-blue-900">
                {formateDate(userData?.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 max-[640px]:flex-col">
        {/*Personal Information */}
        <div className="bg-white p-6 rounded-2xl shadow w-5/10  max-[640px]:w-full">
          <div>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <User className="h-5 w-5 text-green-500" />
              Personal Information
            </div>
            <div className="text-gray-500">
              Your personal details and contact information
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex w-full gap-4">
              <div className="space-y-2 w-full">
                <label htmlFor="name" className="font-semibold ">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                  name="name"
                  placeholder="Full Name"
                  value={userData?.name || ""}
                  onChange={onChangeValue}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-1 font-semibold">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  type="text"
                  id="number"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                  name="number"
                  placeholder="0912..."
                  value={userData?.number || ""}
                  onChange={onChangeValue}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1 font-semibold">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                  name="email"
                  placeholder="example@gmail.com"
                  value={userData?.email || ""}
                  onChange={onChangeValue}
                />
              </div>
            </div>

            {/* FIXED INPUTS BELOW */}

            <div className="w-full flex  gap-4">
              <div className="space-y-2 w-full">
                <label htmlFor="municipality" className="font-semibold flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Municipality
                </label>
                <input
                  type="text"
                  id="municipality"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                  name="municipality"
                  placeholder="Enter Municipality"
                  value={userData?.municipality || ""} 
                  onChange={onChangeValue} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1 font-semibold">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Home Address
              </label>
              <input
                type="text"
                id="address"
                className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="address"
                placeholder="Barangay..."
                value={userData?.address || ""}
                onChange={onChangeValue}
              />
            </div>

            <button
              className={`flex gap-2 bg-green-500 text-white py-2 px-6 rounded justify-center items-center cursor-pointer hover:bg-green-600 transition-colors ${
                hasChanges ? "" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={updateNow}
              disabled={!hasChanges}
            >
              {!hasChanges ? (
                <>
                  <FileEdit className="h-4 w-4" />
                  Edit Profile
                </>
              ) : (
                <>
                  <SquarePen className="h-4 w-4" />
                  Update Changes
                </>
              )}
            </button>
          </div>
        </div>
        {/*family information */}
        <div className="bg-white w-5/10 p-6 rounded-2xl shadow max-[640px]:w-full">
          <div>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <UserRound className="h-5 w-5 text-green-500" />
              Family Information
            </div>
            <div className="text-gray-500">
              Details about your accounts and important information
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">
                  {user_type === "children"
                    ? "Registered Children"
                    : "Registered Beneficiary"}
                </h3>
                <div className="bg-blue-50 text-blue-700 px-2 rounded-2xl">
                  {user_type === "children" ? "1 Child" : ""}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-bold overflow-hidden">
                    {userData?.imgUrl ? (
                        <img src={userData.imgUrl} className="w-full h-full object-cover" alt="dp" />
                    ) : (
                        <span>{userData?.name?.slice(0, 2) || "??"}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{userData?.name || "Loading..."}</h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />

                        {user_type === "children" ? (
                          <span>
                            {userData?.ageMonths} months old (DOB:{" "}
                            {formateDate(userData?.birthDate)})
                          </span>
                        ) : (
                          <span>{formateDate(userData?.createdAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {user_type === "children" && (
              <div className="space-y-2">
                <label className="font-semibold">Relationship to Child</label>
                <p className="text-sm py-2">Mother</p>
              </div>
            )}

            <div>
              <h3 className="text-md font-medium mb-2">Recent Activity</h3>
              <div className="space-y-2">
                <div className="bg-muted/30 p-2 rounded-md flex justify-between items-center border border-gray-100">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">Viewed nutrition records</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Today, 10:30 AM
                  </span>
                </div>

                <div className="bg-muted/30 p-2 rounded-md flex justify-between items-center border border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm">Scheduled an appointment</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Yesterday, 02:15 PM
                  </span>
                </div>

                <div className="bg-muted/30 p-2 rounded-md flex justify-between items-center border border-gray-100">
                  <div className="flex items-center">
                    <Clipboard className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Updated contact information</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    May 02, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuardianProfilePage;