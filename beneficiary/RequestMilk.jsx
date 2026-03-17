import useAuth from "@/hooks/useAuth";
import { useAddRequestMutation } from "@/service/request/requestApiSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RequestMilk = () => {
  const { name } = useAuth();
  const [data, setData] = useState("");
  const [addReq] = useAddRequestMutation();

  const sendData = async (purpose) => {
    if (data) {
      const res = await addReq({
        content: `${purpose} ${data} oz of milk`,
        reqtype: "milk",
        requestedBy: name,
        isdone: false,
      });

      if (res) {
        console.log(res);

        toast.success("Request Sent Successfully!", {
          duration: 3000,
        });

        setData("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <>
      {" "}
      <h2 className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
        Donate\Request Milk
      </h2>
      <div className="w-full flex flex-col  flex-nowrap gap-2 ">
        <p className="flex items-center gap-2 text-gray-800  text-[11px]">
          Your Milk Amount
        </p>

        <input
          type="text"
          id="number"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="number"
          placeholder="Milk oz"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <div className="w-full flex flex-row  flex-nowrap gap-2 ">
        <button
          className="py-2 px-4 w-1/2 text-white text-[11px] bg-[#4CAF50] rounded-md"
          onClick={() => sendData("Requesting")}
        >
          Request Now
        </button>
        <button
          className="py-2 px-4 w-1/2  text-white text-[11px] bg-[#4CAF50] rounded-md"
          onClick={() => sendData("Donating")}
        >
          Donate Now
        </button>
      </div>
    </>
  );
};

export default RequestMilk;
