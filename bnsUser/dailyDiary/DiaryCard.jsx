"use client";
import { useUpdateDailyDiaryMutation } from "@/service/dailyDiary/dailyDiaryApiSlice";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function DiaryCard({ diary, filterDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(diary.tasks || {});
  const [specialTasks, setSpecialTasks] = useState(diary.specialTasks || {});
  const [title, setTitle] = useState(diary.diary.title || "");
  const [content, setContent] = useState(diary.diary.content || "");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // ✅ Initialize speech-to-text ONCE
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // ❗ final results only (prevents double text)
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        setContent((prev) => prev + " " + transcript); // append once only
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // TODAY logic
  const today = new Date().toISOString().split("T")[0];
  const isToday = diary.date === today;

  // FILTER logic
  if (filterDate && filterDate !== diary.date) return null;

  const [updateDiary] = useUpdateDailyDiaryMutation();

  const handleSave = async () => {
    if (!isToday) return;

    setLoading(true);
    try {
      await updateDiary({
        diaryId: diary._id,
        diary: { title, content },
        tasks,
        specialTasks,
      });
      toast.success("Diary updated!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SMALL CARD */}
      <div
        onClick={() => setIsOpen(true)}
        className={`
          p-4 mb-3 rounded-xl shadow transition cursor-pointer
          ${isToday ? "bg-green-500 text-white" : "bg-white hover:shadow-lg"}
        `}
      >
        <h3 className="font-bold text-lg">{isToday ? "Today" : diary.date}</h3>

        <p className={`${isToday ? "text-green-50" : "text-gray-600"} text-sm`}>
          {title || "No Title"} •{" "}
          {Object.keys(tasks).filter((t) => tasks[t]).length}/
          {Object.keys(tasks).length} tasks done
        </p>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full md:w-2/3 max-w-2xl p-6 relative shadow-xl">
            <button
              onClick={() => {
                setIsOpen(false);
                if (listening) toggleListening();
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-3">{diary.date}</h2>

            <input
              type="text"
              value={title}
              disabled={!isToday}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border-b border-gray-300 w-full p-1 mb-3 text-lg font-semibold focus:outline-none"
            />

            <div className="relative">
              <textarea
                value={content}
                disabled={!isToday} // ⬅️ prevent editing past diaries
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your diary..."
                className={`w-full border rounded-lg p-3 mb-2 focus:outline-none pr-12 ${
                  !isToday ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                rows={4}
              />

              {/* 🎤 Show mic ONLY if today */}
              {isToday && (
                <button
                  onClick={toggleListening}
                  className={`absolute right-3 top-3 text-xl ${
                    listening ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  🎤
                </button>
              )}
            </div>

            {listening && isToday && (
              <div
                className="flex items-center gap-2 p-2 bg-red-50 border border-red-300 rounded-lg mb-4 animate-fadeIn cursor-pointer"
                onClick={toggleListening}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">
                  Listening... Tap to stop
                </span>
              </div>
            )}

            {/* Tasks */}
            <div className="mb-5">
              <h3 className="font-semibold mb-2">Tasks</h3>
              <ul className="space-y-1">
                {Object.keys(tasks).map((task) => (
                  <li key={task} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tasks[task]}
                      disabled={!isToday}
                      onChange={() =>
                        setTasks((prev) => ({
                          ...prev,
                          [task]: !prev[task],
                        }))
                      }
                    />
                    <span
                      className={
                        tasks[task] ? "line-through text-gray-400" : ""
                      }
                    >
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Tasks */}
            {Object.keys(specialTasks).length > 0 && (
              <div className="mb-5">
                <h3 className="font-semibold mb-2">Special Tasks</h3>
                <ul className="space-y-1">
                  {Object.keys(specialTasks).map((task) => (
                    <li key={task} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={specialTasks[task]}
                        disabled={!isToday}
                        onChange={() =>
                          setSpecialTasks((prev) => ({
                            ...prev,
                            [task]: !prev[task],
                          }))
                        }
                      />
                      <span
                        className={
                          specialTasks[task] ? "line-through text-gray-400" : ""
                        }
                      >
                        {task}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* UPDATE BUTTON */}
            {isToday && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl mt-3"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
