"use client";
import { useState } from "react";

// Replace with dynamic backend/API data
const surveyData = [
  {
    id: 1,
    name: "John Doe",
    date: "April 25, 2025",
    response: "The program was helpful and the staff were kind.",
  },
  {
    id: 2,
    name: "Jane Cruz",
    date: "April 24, 2025",
    response: "More sessions should be held in the afternoon.",
  },
  {
    id: 3,
    name: "Carlos Ramos",
    date: "April 23, 2025",
    response: "Include more nutritious meal options during events.",
  },
  {
    id: 4,
    name: "Ella Santos",
    date: "April 22, 2025",
    response: "Please extend the program to more barangays.",
  },
];

const ITEMS_PER_PAGE = 2;

export default function SurveyResponses({ surveyData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(surveyData.length / ITEMS_PER_PAGE);

  const paginatedResponses = surveyData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log(surveyData);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Survey Responses
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        View and analyze detailed survey responses
      </p>

      {surveyData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Survey module will be available soon
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This feature is currently in development.
          </p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
            Get Notified
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedResponses.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition p-5 rounded-lg flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm shrink-0">
                  US
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="mt-2 text-gray-800">{item.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
        </>
      )}
    </div>
  );
}
