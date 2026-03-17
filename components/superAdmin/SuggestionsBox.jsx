"use client";
import { useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function SuggestionsBox({ suggestions }) {
  console.log("This is the suggestion " + suggestions);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(suggestions?.length / ITEMS_PER_PAGE);
  const paginatedSuggestions = suggestions?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full ">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Suggestions Box</h2>
      <p className="text-sm text-gray-500 mb-4">
        Open-ended feedback from program participants
      </p>

      <div className="space-y-4 mb-6">
        {paginatedSuggestions?.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between"
          >
            <div className="flex gap-4 items-start">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                US
              </div>
              <div>
                <p className="mt-2 text-gray-800">{item.comment}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {item.programId?.title}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 mt-2 md:mt-0">
              <p className="text-sm text-gray-400">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-1.5 text-sm rounded font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-1.5 text-sm rounded font-medium ${
              currentPage === totalPages
                ? "bg-green-100 text-green-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
