"use client";
import { useLoginBeneciaryMutation } from "@/service/auth/autApiSlice";
import { setToken } from "@/service/auth/authSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const BeneficiaryLogIn = () => {
  /* API FUNCTION LOGIN */
  const [loginBNF, { isLoading }] = useLoginBeneciaryMutation();

  const [barangayDropDown, setBarangayDropDown] = useState(false);

  const [logInData, setlogInData] = useState({
    bns_code: "",
  });

  const [typeOfLogin, setTypeOfLogIn] = useState("");

  /* AUTH HANDLER*/

  const dispatch = useDispatch();

  /* Dynamic On Change  */
  const setChangeData = (e) => {
    const { value, name } = e.target;

    setlogInData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const logInUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (logInData?.bns_code && typeOfLogin) {
      try {
        const res = await loginBNF({
          bns_code: logInData?.bns_code,
          usertype: typeOfLogin,
        });

        if (res?.error) {
          console.log(res);
          toast.error(res.error?.data?.message || "ID not existing or invalid details", {
            duration: 3000,
          });
        } else if (res?.data?.accessToken) {
          console.log(res?.data?.accessToken);

          dispatch(setToken({ accessToken: res?.data?.accessToken }));
          toast.success("Login Successful!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.error("Login failed", err);
        toast.error("An unexpected error occurred.");
      }
    } else {
      if (!logInData?.bns_code) {
        toast.error("Please enter your Beneficiary ID.");
      } else if (!typeOfLogin) {
        toast.error("Please select an Account Type.");
      }
    }
  };

  return (
    <div className="p-[24px]">
      <h3 className="text-2xl font-semibold mb-[6px]">Beneficiary Access </h3>{" "}
      <p className="text-sm text-gray-600 mb-[8px]">
        Access your family's nutrition records and appointments
      </p>
      <form onSubmit={logInUser}>
        {/* Beneficiary or ID Number*/}
        <div className="w-full  items-center mb-4  ">
          <label
            htmlFor="bns_code"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Beneficiary ID
          </label>
          <div className="w-full flex gap-4">
            <input
              type="text"
              id="bns_code"
              className="h-10 px-[8px] py-[12px] w-1/2 outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="bns_code"
              placeholder="BNF-12345 or 09XX..."
              onChange={(e) => setChangeData(e)}
              value={logInData.bns_code}
            />

            {/* DROPDOWN */}
            <div
              id="barangay"
              className="px-[8px] py-[6px] w-1/2 flex justify-between items-center outline-none rounded-md border border-gray-200 text-[14px] relative cursor-pointer hover:bg-gray-50"
              onClick={() => setBarangayDropDown((prev) => !prev)}
            >
              <span className="truncate">
                {typeOfLogin
                  ? typeOfLogin === "children"
                    ? "Children Account"
                    : typeOfLogin === "pregnantwomen"
                    ? "Pregnant Mother"
                    : "Lactating Mother"
                  : "Select Type"}
              </span>
              <i className="bi bi-chevron-down ml-1"></i>
              
              {/* Dropdown Menu */}
              {barangayDropDown && (
                <div
                  className="p-1 w-full flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[110%] left-0 bg-white shadow-lg z-10"
                >
                  <div
                    className={`px-[8px] py-[8px] w-full rounded-md relative duration-200 hover:bg-[#FFC105]/20 cursor-pointer flex items-center ${
                      typeOfLogin === "children" ? "bg-[#ffc105] bg-opacity-30 text-[#b48903]" : ""
                    }`}
                    onClick={() => setTypeOfLogIn("children")}
                  >
                    <i
                      className={`bi bi-check mr-2 ${
                        typeOfLogin === "children" ? "opacity-100" : "opacity-0"
                      } `}
                    ></i>
                    Children Account
                  </div>
                  <div
                    className={`px-[8px] py-[8px] w-full rounded-md relative duration-200 hover:bg-[#FFC105]/20 cursor-pointer flex items-center ${
                      typeOfLogin === "pregnantwomen" ? "bg-[#ffc105] bg-opacity-30 text-[#b48903]" : ""
                    }`}
                    onClick={() => setTypeOfLogIn("pregnantwomen")}
                  >
                    <i
                      className={`bi bi-check mr-2 ${
                        typeOfLogin === "pregnantwomen" ? "opacity-100" : "opacity-0"
                      } `}
                    ></i>
                    Pregnant Mother
                  </div>
                  <div
                    className={`px-[8px] py-[8px] w-full rounded-md relative duration-200 hover:bg-[#FFC105]/20 cursor-pointer flex items-center ${
                      typeOfLogin === "lactatingmother" ? "bg-[#ffc105] bg-opacity-30 text-[#b48903]" : ""
                    }`}
                    onClick={() => setTypeOfLogIn("lactatingmother")}
                  >
                    <i
                      className={`bi bi-check mr-2 ${
                        typeOfLogin === "lactatingmother" ? "opacity-100" : "opacity-0"
                      } `}
                    ></i>
                    Lactating Mother
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-[24px]">
          Use your beneficiary ID to login
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-[14px] bg-[#4CAF50] text-white py-[12px] px-[8px] rounded-md hover:opacity-90 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default BeneficiaryLogIn;
