"use client";
import { useState } from "react";
import PaginatedUserTable from "@/components/superAdmin/PaginatedUserTable";
import { X, User, Mail, MapPin, BadgeCheck, FileText, Calendar } from "lucide-react"; // Importing icons for better UI

export default function BnsUsers() {
  const [viewing, setViewing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false); // State for delete modal
  const [userData, setUserData] = useState(null); // Holds the user data selected for view/edit/delete
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to reload table data

  // Handler to close modals and reset user data
  const handleClose = () => {
    setViewing(false);
    setEditing(false);
    setDeleting(false);
    setUserData(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userData?._id) return;

    // Get form data
    const formData = new FormData(e.target);
    const updates = {
        fullName: formData.get("fullName"),
        barangay: formData.get("barangay"),
        bio: formData.get("bio"),
        // Checkbox value handling: if checked, it's true, else false
        approve: formData.get("approve") === "on"
    };

    try {
        const res = await fetch(`/api/auth/${userData._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        if (res.ok) {
            setRefreshTrigger(prev => prev + 1); // Trigger table refresh
            handleClose();
            // Using a simple alert for now, could be replaced with toast
            alert("User updated successfully!");
        } else {
            const errorData = await res.json();
            alert(`Failed to update: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("An error occurred while updating.");
    }
  };

  const handleDelete = async () => {
    if (!userData?._id) return;

    try {
      const res = await fetch(`/api/auth/${userData._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1);
        handleClose();
        alert("User deleted successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="w-full">
      {/* The Table Component */}
      <PaginatedUserTable
        setViewing={setViewing}
        setEditing={setEditing}
        setDeleting={setDeleting} // Pass delete handler setter
        setUserDatas={setUserData}
        refreshTrigger={refreshTrigger} 
      />

      {/* --- View User Modal --- */}
      {viewing && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg bg-white text-gray-800 p-0 overflow-hidden rounded-xl">
            {/* Header */}
            <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                    <User size={20} className="text-[#28a745]" />
                    User Details
                </h3>
                <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle">
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Identity</span>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                        <BadgeCheck size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">BNS ID</span>
                    </div>
                    <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{userData?.bnsId || "N/A"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Personal Info</span>
                
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Full Name</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{userData?.fullName || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Email</span>
                        </div>
                        <span className="text-sm text-gray-800">{userData?.emailAddress || userData?.email || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Barangay</span>
                        </div>
                        <span className="text-sm text-gray-800">{userData?.barangay || "N/A"}</span>
                    </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status & Bio</span>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Account Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userData?.approve ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {userData?.approve ? "Active" : "Pending Approval"}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="block text-xs font-semibold text-gray-400 mb-1">Bio</span>
                        <p className="italic text-gray-500">{userData?.bio || "No bio provided."}</p>
                    </div>
                </div>
              </div>
              
               <div className="flex justify-end pt-2">
                 <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    Registered: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                 </span>
              </div>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={handleClose}></div>
        </dialog>
      )}

      {/* --- Edit User Modal --- */}
      {editing && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl bg-white text-gray-800 p-0 overflow-hidden rounded-xl shadow-2xl">
            {/* Header */}
            <div className="bg-[#28a745] p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <FileText size={20} />
                    Edit User Profile
                </h3>
                <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-600">BNS ID</span>
                            </label>
                            <input 
                                type="text" 
                                defaultValue={userData?.bnsId} 
                                className="input input-bordered w-full bg-gray-50 text-gray-500 cursor-not-allowed" 
                                disabled 
                            />
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-600">Full Name</span>
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    name="fullName" 
                                    type="text" 
                                    defaultValue={userData?.fullName} 
                                    className="input input-bordered w-full pl-10 bg-white focus:border-[#28a745] focus:ring-1 focus:ring-[#28a745]" 
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-600">Barangay</span>
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <select 
                                    name="barangay" 
                                    defaultValue={userData?.barangay || "Barangay San Isidro"} 
                                    className="select select-bordered w-full pl-10 bg-white focus:border-[#28a745] focus:ring-1 focus:ring-[#28a745]"
                                >
                                    <option>Acevida</option>
                                    <option>Bagong Pag-Asa</option>
                                    <option>Bagumbarangay</option>
                                    <option>Buhay</option>
                                    <option>Gen. Luna</option>
                                    <option>Halayhayin</option>
                                    <option>Mendiola</option>
                                    <option>Kapatalan</option>
                                    <option>Laguio</option>
                                    <option>Liyang</option>
                                    <option>Llavac</option>
                                    <option>Pandeno</option>
                                    <option>Magsaysay</option>
                                    <option>Macatad</option>
                                    <option>Mayatba</option>
                                    <option>P. Burgos</option>
                                    <option>G. Redor</option>
                                    <option>Salubungan</option>
                                    <option>Wawa</option>
                                    <option>J. Rizal</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-600">Bio / Notes</span>
                            </label>
                            <textarea 
                                name="bio" 
                                defaultValue={userData?.bio} 
                                className="textarea textarea-bordered h-32 bg-white focus:border-[#28a745] focus:ring-1 focus:ring-[#28a745]"
                                placeholder="Add notes or biography here..."
                            ></textarea>
                        </div>

                        <div className="form-control mt-2">
                            <label className="cursor-pointer label p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="label-text font-bold text-gray-700">Approve User</span>
                                    <span className="label-text-alt text-gray-500">Enable account access</span>
                                </div>
                                <input 
                                    name="approve" 
                                    type="checkbox" 
                                    defaultChecked={userData?.approve} 
                                    className="toggle toggle-success" 
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-action mt-8 border-t pt-4">
                    <button type="button" className="btn btn-ghost" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn bg-[#28a745] hover:bg-[#218838] border-none text-white px-8">
                        Save Changes
                    </button>
                </div>
            </form>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={handleClose}></div>
        </dialog>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm bg-white text-gray-800">
            <h3 className="font-bold text-lg text-red-600">Confirm Delete</h3>
            <p className="py-4 text-sm">
              Are you sure you want to delete user <span className="font-bold">{userData?.fullName}</span>? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-sm btn-ghost" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="btn btn-sm bg-red-600 hover:bg-red-700 border-none text-white"
                onClick={handleDelete}
              >
                Delete User
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={handleClose}></div>
        </dialog>
      )}
    </div>
  );
}