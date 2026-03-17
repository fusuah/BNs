"use client";
import { useState, useMemo } from "react";
import { Search, Plus, Download, CheckCircle2, Circle, CalendarDays } from "lucide-react";
import { isSameDay, parseISO, format } from "date-fns";
import { useGetPostQuery } from "@/service/auth/autApiSlice";
import { useAddDailySpecialTaskDiaryMutation } from "@/service/dailyDiary/dailyDiaryApiSlice";
import toast from "react-hot-toast";
import ManageUserTasks from "./ManageUsersTask";

const PER_PAGE = 5;

export default function DailyAccomplishments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addTask, setAddTask] = useState(false);
  const [viewTask, setViewTask] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({ title: "" });

  // GET BNS worker accounts
  const { data: bnsWorkerData = [], refetch } = useGetPostQuery();
  const [addSpecialTask, { isLoading: isAdding }] = useAddDailySpecialTaskDiaryMutation();

  const filteredWorkers = bnsWorkerData.filter(
    (user) =>
      user.type === "bns-worker" &&
      user.approve &&
      (user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.barangay?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredWorkers.length / PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredWorkers.slice(start, start + PER_PAGE);
  }, [filteredWorkers, page]);

  // ======================
  // ADD SPECIAL TASK
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      // Create a date object for today in local time to avoid timezone offset issues on the backend
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      await addSpecialTask({
        userId: userInfo._id,
        taskName: formData.title,
        date: todayString,
      }).unwrap();

      toast.success("Special task added successfully");
      refetch();
      setAddTask(false);
      setFormData({ title: "" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to add task");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      {!viewTask ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-green-600" />
                Daily BNS Activity
              </h2>
              <p className="text-sm text-gray-500">
                {format(new Date(), "MMMM d, yyyy")} • Monitoring & Assignments
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search BNS..."
                  className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    BNS Worker
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length > 0 ? (
                  paginated.map((item) => {
                    const today = new Date();
                    const todaysDiary = item.diaries?.find((d) =>
                      isSameDay(parseISO(d.date), today)
                    );

                    const tasks = todaysDiary?.tasks || {};
                    const special = todaysDiary?.specialTasks || {};

                    const totalRegular = Object.keys(tasks).length;
                    // Check if value is strictly true (boolean) to count as done
                    const doneRegular = Object.values(tasks).filter(val => val === true).length;
                    
                    const totalSpecial = Object.keys(special).length;
                    // Check if value is strictly true (boolean) or if it's an object with a completed status
                    const doneSpecial = Object.values(special).filter(val => {
                        if (typeof val === 'boolean') return val === true;
                        if (typeof val === 'object' && val !== null) return val.completed === true || val.status === 'completed';
                        return false;
                    }).length;

                    const totalTasks = totalRegular + totalSpecial;
                    const totalDone = doneRegular + doneSpecial;
                    
                    const progress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                              {item.fullName?.charAt(0) || "B"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.fullName}</p>
                              <p className="text-xs text-gray-500">{item.barangay || "No Barangay"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-full max-w-[140px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">
                                {totalDone}/{totalTasks} Done
                              </span>
                              <span className="text-gray-500">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex gap-2 mt-1.5 text-[10px] text-gray-400">
                                <span className={doneRegular === totalRegular && totalRegular > 0 ? "text-green-600" : ""}>
                                    Reg: {doneRegular}/{totalRegular}
                                </span>
                                <span>•</span>
                                <span className={doneSpecial === totalSpecial && totalSpecial > 0 ? "text-green-600" : ""}>
                                    Spl: {doneSpecial}/{totalSpecial}
                                </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setAddTask(true);
                                setUserInfo({ ...item });
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip tooltip-left"
                              title="Add Special Task"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setViewTask(true);
                                setUserInfo({ ...item });
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-sm">
                      No BNS workers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <ManageUserTasks
          userTask={userInfo}
          closeViewing={() => {
            setViewTask(false);
            setUserInfo({});
          }}
          refetch={refetch}
        />
      )}

      {/* ADD SPECIAL TASK MODAL */}
      {addTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Assign Task to {userInfo.fullName}
              </h3>
              <button
                onClick={() => setAddTask(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="e.g., Conduct house visit in Zone 1"
                  autoFocus
                />
              </div>
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg text-blue-700">
                <p>This task will be added to the worker's diary for today ({format(new Date(), "MMM d")}). They will be required to mark it as done.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddTask(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-70 flex items-center gap-2"
                >
                  {isAdding ? <span className="loading loading-spinner loading-xs"></span> : <Plus className="w-4 h-4" />}
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}