"use client";

import { parseISO, format } from "date-fns";
import { useState } from "react";

export default function ManageUserTasks({ userTask, closeViewing }) {
  const today = new Date();
  const diaries = userTask.diaries || [];
  const [viewDiaryId, setViewDiaryId] = useState(null);

  // Render all tasks (read-only)
  const renderAllTasks = (diary) => {
    const combined = [
      ...Object.entries(diary.tasks || {}).map(([key, task]) => ({
        ...task,
        key,
        type: "Regular",
      })),
      ...Object.entries(diary.specialTasks || {}).map(([key, task]) => ({
        ...task,
        key,
        type: "Special",
      })),
    ];

    return combined.map((task) => (
      <tr key={task.key}>
        <td className="border px-4 py-2">{task.title}</td>
        <td className="border px-4 py-2">{task.type}</td>
        <td className="border px-4 py-2">{task.diary?.content || "-"}</td>
        <td className="border px-4 py-2">
          {task.diary?.imageUrl ? (
            <img
              src={task.diary.imageUrl}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            "No Image"
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Daily Tasks of {userTask.fullName}
        </h2>
        <button
          onClick={closeViewing}
          className="btn btn-ghost text-black border-none shadow-none text-xl"
        >
          ✕ Close
        </button>
      </div>

      {!viewDiaryId ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Tasks</th>
                <th className="border p-2 text-left">Special Tasks</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {diaries.map((d) => (
                <tr
                  key={d._id}
                  className={
                    parseISO(d.date).toDateString() === today.toDateString()
                      ? "bg-green-100 font-semibold"
                      : ""
                  }
                >
                  <td className="border p-2">
                    {format(parseISO(d.date), "yyyy-MM-dd")}
                  </td>
                  <td className="border p-2">
                    {Object.keys(d.tasks || {}).length}
                  </td>
                  <td className="border p-2">
                    {Object.keys(d.specialTasks || {}).length}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setViewDiaryId(d._id)}
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <button
            onClick={() => setViewDiaryId(null)}
            className="mb-4 underline"
          >
            ← Back
          </button>

          {diaries
            .filter((d) => d._id === viewDiaryId)
            .map((d) => (
              <div key={d._id} className="overflow-x-auto">
                <h3 className="font-semibold mb-2">
                  All Tasks for {format(parseISO(d.date), "yyyy-MM-dd")}
                </h3>
                <table className="w-full table-auto border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Title</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">Content</th>
                      <th className="border p-2 text-left">Image</th>
                    </tr>
                  </thead>
                  <tbody>{renderAllTasks(d)}</tbody>
                </table>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
