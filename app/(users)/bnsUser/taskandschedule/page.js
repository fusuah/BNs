"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import {
  useAddDailyDiaryMutation,
  useLazyGetAllDailyDiaryQuery,
  useUpdateDailyDiaryMutation,
} from "@/service/dailyDiary/dailyDiaryApiSlice";

const DEFAULT_TASKS = {
  mothersProcession: { title: "Mothers Procession / BNS Evaluation", diary: { content: "", imageUrl: "" } },
  reporting: { title: "Reporting", diary: { content: "", imageUrl: "" } },
  foodSupplementDistribution: { title: "Food Supplement Distribution", diary: { content: "", imageUrl: "" } },
  documentation: { title: "Documentation", diary: { content: "", imageUrl: "" } },
  pagtimbang: { title: "Pagtimbang (Weighing)", diary: { content: "", imageUrl: "" } },
  homeVisits: { title: "Home Visits", diary: { content: "", imageUrl: "" } },
  survey: { title: "Survey", diary: { content: "", imageUrl: "" } },
  operationTimbang: { title: "Operation Timbang", diary: { content: "", imageUrl: "" } },
  monitoringBuntis: { title: "Monitoring Buntis (Pregnant)", diary: { content: "", imageUrl: "" } },
};

const TaskSchedule = () => {
  const { id } = useAuth();

  const [addDiary, { isLoading }] = useAddDailyDiaryMutation();
  const [getAllDailyDiary, { data }] = useLazyGetAllDailyDiaryQuery();
  const [updateTask] = useUpdateDailyDiaryMutation();

  const [viewTasksId, setViewTasksId] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Add Custom Task State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Voice to text
  const [listening, setListening] = useState(false);

  const recognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "fil-PH";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setModalContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
  }

  useEffect(() => {
    if (id) {
      getAllDailyDiary({ userId: id });
    }
  }, [id]);

  const handleCreateNewDiary = async () => {
    if (!id) return toast.error("User ID not found");
    
    try {
      const today = new Date().toISOString().split("T")[0];
      // Send the DEFAULT_TASKS to the API
      await addDiary({ userId: id, date: today, tasks: DEFAULT_TASKS }).unwrap();
      toast.success("Diary Created");
      getAllDailyDiary({ userId: id });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error creating diary");
    }
  };

  const handleDeleteDiary = async (diaryId) => {
    if (!confirm("Are you sure you want to delete this ENTIRE diary entry? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/bnsUsers/diary?diaryId=${diaryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Diary deleted successfully");
        if (viewTasksId === diaryId) {
            setViewTasksId(null);
        }
        getAllDailyDiary({ userId: id });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error deleting diary");
    }
  };

  const handleAddCustomTask = async () => {
    if (!newTaskTitle.trim()) return toast.error("Please enter a task title");
    
    const currentDiary = data?.diaries?.find((d) => d._id === viewTasksId);
    if (!currentDiary) return;

    // Generate a unique key for the new task
    const taskKey = `custom_${Date.now()}`;
    const newTask = {
        title: newTaskTitle,
        diary: { content: "", imageUrl: "" }
    };

    try {
        await updateTask({
            diaryId: viewTasksId,
            specialTasks: {
                ...currentDiary.specialTasks,
                [taskKey]: newTask
            }
        }).unwrap();

        toast.success("Custom task added");
        setShowAddTaskModal(false);
        setNewTaskTitle("");
        getAllDailyDiary({ userId: id });
    } catch (err) {
        console.error(err);
        toast.error("Failed to add custom task");
    }
  };

  const handleOpenModal = (task, diaryId, type, key) => {
    setEditingTask({ diaryId, taskKey: key, type });
    setModalContent(task.diary.content || "");
    setShowModal(true);
  };

  const toggleListening = () => {
    if (!recognition) return;
    listening ? recognition.stop() : recognition.start();
    setListening(!listening);
  };

  // ✅ SUPABASE IMAGE UPLOAD
  const handleImageChange = async (file, taskKey, type) => {
    if (!file) return;

    try {
      const supabase = getSupabase();
      const ext = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${ext}`;
      const filePath = `diaries/${fileName}`;

      const { error } = await supabase.storage
        .from("diary-images")
        .upload(filePath, file);
      
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("diary-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      const currentDiary = data?.diaries?.find((d) => d._id === viewTasksId);
      if (!currentDiary) return;

      const targetCollection = type === "Regular" ? "tasks" : "specialTasks";
      
      await updateTask({
        diaryId: viewTasksId,
        [targetCollection]: {
          ...currentDiary[targetCollection],
          [taskKey]: {
            ...currentDiary[targetCollection][taskKey],
            diary: {
              ...currentDiary[targetCollection][taskKey].diary,
              imageUrl,
            },
          },
        },
      }).unwrap();

      toast.success("Image uploaded");
      getAllDailyDiary({ userId: id });
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const handleSaveModal = async () => {
    const { diaryId, taskKey, type } = editingTask;
    const currentDiary = data?.diaries?.find((d) => d._id === diaryId);
    if (!currentDiary) return;

    const targetCollection = type === "Regular" ? "tasks" : "specialTasks";

    await updateTask({
      diaryId,
      [targetCollection]: {
        ...currentDiary[targetCollection],
        [taskKey]: {
          ...currentDiary[targetCollection][taskKey],
          diary: {
            ...currentDiary[targetCollection][taskKey].diary,
            content: modalContent,
          },
        },
      },
    }).unwrap();

    toast.success("Diary updated");
    setShowModal(false);
    getAllDailyDiary({ userId: id });
  };

  const handleDeleteTask = async (diaryId, taskKey, type) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const currentDiary = data?.diaries?.find((d) => d._id === diaryId);
    if (!currentDiary) return;

    try {
      const targetCollection = type === "Regular" ? "tasks" : "specialTasks";
      const updatedTasks = { ...currentDiary[targetCollection] };
      delete updatedTasks[taskKey];

      await updateTask({
        diaryId,
        [targetCollection]: updatedTasks,
      }).unwrap();

      toast.success("Task deleted");
      getAllDailyDiary({ userId: id });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const renderTaskRows = (tasksObj, type) =>
    Object.entries(tasksObj || {}).map(([key, task]) => (
      <tr key={key} className="hover:bg-gray-50 border-b">
        <td className="border px-4 py-2 font-medium">{task.title}</td>

        <td
          className="border px-4 py-2 text-blue-600 cursor-pointer max-w-[300px]"
          onClick={() => handleOpenModal(task, viewTasksId, type, key)}
        >
          <div className="flex items-center gap-2">
             <span className="line-clamp-2 break-words flex-1">
                {task.diary.content || "Click to add content..."}
             </span>
             <span className="text-xs bg-blue-50 px-2 py-1 rounded">Edit</span>
          </div>
        </td>

        <td className="border px-4 py-2">
          {task.diary.imageUrl ? (
            <a href={task.diary.imageUrl} target="_blank" rel="noreferrer">
                <img
                src={task.diary.imageUrl}
                className="w-16 h-16 object-cover rounded border border-gray-200 hover:scale-105 transition-transform"
                alt="Evidence"
                />
            </a>
          ) : (
            <span className="text-gray-400 text-sm italic">No Image</span>
          )}
        </td>

        <td className="border px-4 py-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0], key, type)}
            className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </td>

        <td className="border px-4 py-2 text-center">
          <button
            onClick={() => handleDeleteTask(viewTasksId, key, type)}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen">
      {/* LIST VIEW */}
      {!viewTasksId && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Daily Diaries</h2>
                <p className="text-sm text-gray-500">Track and manage your daily accomplishments</p>
            </div>
            <button
              onClick={handleCreateNewDiary}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {isLoading ? "Creating..." : "+ Create Today's Diary"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tasks</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Special</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.diaries?.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500">No diaries found. Create one to get started.</td>
                    </tr>
                )}
                {data?.diaries?.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{d.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {Object.keys(d.tasks || {}).length} Regular
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {Object.keys(d.specialTasks || {}).length} Special
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setViewTasksId(d._id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                        >
                            View
                        </button>
                        {/* <button
                            onClick={() => handleDeleteDiary(d._id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline"
                        >
                            Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TASK VIEW */}
      {viewTasksId && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
                onClick={() => setViewTasksId(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                ← Back to Diaries
            </button>
            <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-1"
            >
                <span className="text-lg leading-none">+</span> Add Custom Task
            </button>
          </div>

          <div className="space-y-8">
            <section>
                <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Regular Tasks</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {data?.diaries
                            ?.filter((d) => d._id === viewTasksId)
                            .map((d) => renderTaskRows(d.tasks, "Regular"))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Special Tasks</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {data?.diaries
                            ?.filter((d) => d._id === viewTasksId)
                            .map((d) => renderTaskRows(d.specialTasks, "Special"))}
                        </tbody>
                    </table>
                </div>
            </section>
          </div>
        </>
      )}

      {/* EDIT CONTENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Update Task Details</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content / Remarks</label>
                <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                rows={6}
                placeholder="Enter details about this task..."
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  listening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {listening ? (
                    <>
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Listening...
                    </>
                ) : (
                    <>
                        🎤 Use Voice
                    </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM TASK MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Add Custom Task</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Community Cleanup"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomTask}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Task
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSchedule;