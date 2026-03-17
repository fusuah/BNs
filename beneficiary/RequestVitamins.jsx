import useAuth from "@/hooks/useAuth";
import { useAddRequestMutation } from "@/service/request/requestApiSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RequestVitamins = () => {
  const { name } = useAuth();
  const [data, setData] = useState("");
  const [addReq] = useAddRequestMutation();

  const sendData = async () => {
    if (data) {
      const res = await addReq({
        content: ` ${data}  of vitamins`,
        reqtype: "vitamins",
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
        Request Vitamins
      </h2>
      <textarea
        type="text"
        id="reportContent"
        className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[11px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[74
            px] "
        name="reportContent"
        placeholder="List the Vitamins you want to request"
        value={data}
        onChange={(e) => setData(e.target.value)}
      ></textarea>{" "}
      <button
        className="py-2 px-4 text-white text-[11px] bg-[#4CAF50] rounded-md"
        onClick={sendData}
      >
        Request Now
      </button>
      <button
        className="ml-2 py-2 px-4 text-gray-600 text-[11px] bg-transparent border border-gray-200 rounded-md"
        onClick={() => setData("")}
      >
        Clear Form
      </button>
    </>
  );
};

export default RequestVitamins;
