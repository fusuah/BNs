import useAuth from "@/hooks/useAuth";
import {
  useGetOneBnsWorkerQuery,
  useUpdateBnsWorkerMutation,
} from "@/service/auth/autApiSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfileBnsuser = () => {
  const { id } = useAuth();

  const user = useGetOneBnsWorkerQuery(id);
  const [updateUser, { isError }] = useUpdateBnsWorkerMutation();

  const [mainData, setMainData] = useState({
    fullName: "",
    email: "",
    number: "",
    barangay: "",
    bio: "",
    imgUrl: "",
  });

  useEffect(() => {
    if (user?.data) {
      setMainData(user?.data);
    }
  }, [user?.data, user?.isSuccess]);

  console.log(mainData);

  /* Dynamic On Change */

  const setChangeData = (e) => {
    const { name, value } = e.target;

    setMainData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const hasChanges = [
    mainData?.fullName === user?.data?.fullName,
    mainData?.email === user?.data?.email,
    mainData?.number === user?.data?.number,
    mainData?.barangay === user?.data?.barangay,
    mainData?.imgUrl === user?.data?.imgUrl,
    mainData?.bio === user?.data?.bio,
  ].every(Boolean);

  const updateBnsWorker = async () => {
    const istrue = [
      mainData?.fullName,
      mainData?.email,
      mainData?.number,
      mainData?.barangay,
    ].every(Boolean);

    const dataToSend = {
      fullName: mainData?.fullName,
      email: mainData?.email,
      number: mainData?.number,
      barangay: mainData?.barangay,
      imgUrl: mainData?.imgUrl,
      bio: mainData?.bio,
      id: id,
    };

    if (istrue && !hasChanges) {
      const res = await updateUser({ ...dataToSend });

      console.log("asd");

      if (res && isError) {
        toast.error("Invalid Update", {
          duration: 3000,
        });
      } else {
        toast.success("Updated User", {
          duration: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };

  return (
    <div className="w-full p-6">
      <h3 className="text-2xl font-semibold">Profile Information</h3>{" "}
      <p className="text-[14px] text-[#64748b] mb-6 ">
        Manage your profile and system settings
      </p>
      <div className="w-full flex gap-8">
        {/* PROFILE EDIT */}

        <div className="flex flex-col items-center justify-start gap-4 min-w-min">
          {/*  */}
          <div className="h-[96px] w-[96px] rounded-full bg-green-200 overflow-hidden">
            {mainData?.imgUrl ? (
              <></>
            ) : (
              <div className="h-full w-full text-5xl flex items-center justify-center">
                {getInitials(mainData?.fullName)}
              </div>
            )}
          </div>
          <button className="text-[14px] text-black flex gap-2 bg-[#f1f5f9] ">
            <i className="bi bi-upload "></i>
            <p className=" text-nowrap">Change Picture</p>
          </button>
        </div>

        {/* FORM */}

        <div className="w-full ">
          {/* FULL NAME */}
          <div className="w-full flex flex-col mb-4  ">
            <label
              htmlFor="fullName"
              className="text-sm font-medium mb-2 inline-block text-nowrap"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName "
              className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="fullName"
              placeholder="Enter Full Name"
              onChange={(e) => setChangeData(e)}
              value={mainData?.fullName}
            />
          </div>

          {/* EMAIL & PHONE */}
          <div className="w-full flex gap-4 mb-4">
            {/* EMAIL */}
            <div className="w-1/2 flex flex-col   ">
              <label
                htmlFor="email"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="email"
                placeholder="Enter Email Address"
                value={mainData?.email}
                onChange={(e) => setChangeData(e)}
              />
            </div>

            {/* PHONE */}
            <div className="w-1/2 flex flex-col   ">
              <label
                htmlFor="number"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="number"
                className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="number"
                placeholder="Enter Number"
                onChange={(e) => setChangeData(e)}
                value={mainData?.number}
              />
            </div>
          </div>

          {/* BRRANGAY */}
          <div className="w-full flex flex-col mb-4  ">
            <label
              htmlFor="barangay"
              className="text-sm font-medium mb-2 inline-block text-nowrap"
            >
              Barangay
            </label>
            <input
              type="text"
              id="barangay"
              className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="barangay"
              onChange={(e) => setChangeData(e)}
              value={mainData?.barangay}
            />
          </div>

          {/* BIO */}
          <div className="w-full flex flex-col mb-4  ">
            <label
              htmlFor="bio"
              className="text-sm font-medium mb-2 inline-block text-nowrap"
            >
              Bio
            </label>
            <textarea
              type="text"
              id="bio"
              className=" h-[80px] resize-none px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="bio"
              value={mainData?.bio}
              onChange={(e) => setChangeData(e)}
            ></textarea>

            <p className="text-[14px] text-[#64748b] mb-6 ">
              Brief description of your role and experience
            </p>
          </div>

          <div className="w-full flex justify-end gap-6 items-center">
            <button
              className={` bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-2 px-[24px] py-[8px] rounded-md font-medium duration-200 hover:opacity-50 ${
                hasChanges ? "opacity-50 " : "opacity-100 cursor-pointer"
              }`}
              disabled={hasChanges}
              onClick={() => updateBnsWorker()}
            >
              <i className="bi bi-floppy"> </i>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBnsuser;
