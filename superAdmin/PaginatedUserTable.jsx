"use client";
import { useState, useEffect } from "react";
import FilterDropdown from "@/components/ui/FilterDropdown"; // Ensure this path is correct

const BARANGAY_OPTIONS = [
  "All",
  "Acevida",
  "Bagong Pag-Asa",
  "Bagumbarangay",
  "Buhay",
  "Gen. Luna",
  "Halayhayin",
  "Mendiola",
  "Kapatalan",
  "Laguio",
  "Liyang",
  "Llavac",
  "Pandeno",
  "Magsaysay",
  "Macatad",
  "Mayatba",
  "P. Burgos",
  "G. Redor",
  "Salubungan",
  "Wawa",
  "J. Rizal",
];

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Pending"]; // Added "Pending" to catch unapproved users

export default function PaginatedUserTable({
  setEditing,
  setViewing,
  setDeleting, // Accept setDeleting prop
  setUserDatas,
  setUserData,
  refreshTrigger = 0, // New prop to trigger re-fetch
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Default to "All" to show everyone (including unapproved) immediately
  const [statusFilter, setStatusFilter] = useState("All");
  const [barangayFilter, setBarangayFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Add refreshTrigger to dependency array
  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, barangayFilter, searchTerm, refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        barangay: barangayFilter,
        search: searchTerm,
      });

      const res = await fetch(`/api/bnsUsers?${params}`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Helper to safely set user data, handling potential prop name mismatches
  const handleSetUserData = (user) => {
    // Check both plural (from current code) and singular (standard convention)
    const setter = setUserDatas || setUserData;

    if (typeof setter === "function") {
      setter(user);
    } else {
      // Just log a warning, don't crash
      console.warn(
        "PaginatedUserTable: setUserDatas/setUserData prop is missing.",
      );
    }
  };

  // Helper to safely trigger viewing mode
  const handleViewUser = (user) => {
    handleSetUserData(user);

    if (typeof setViewing === "function") {
      setViewing(true);
    } else {
      console.warn(
        "PaginatedUserTable: setViewing prop is missing. Please check parent component.",
      );
    }
  };

  // Helper to safely trigger editing mode
  const handleEditUser = (user) => {
    handleSetUserData(user);

    if (typeof setEditing === "function") {
      setEditing(true);
    } else {
      console.warn(
        "PaginatedUserTable: setEditing prop is missing. Please check parent component.",
      );
    }
  };

  // Helper to safely trigger deleting mode
  const handleDeleteUser = (user) => {
    handleSetUserData(user);
    if (typeof setDeleting === "function") {
      setDeleting(true);
    } else {
      console.warn(
        "PaginatedUserTable: setDeleting prop is missing. Please check parent component.",
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, email, or BNS number..."
            className="input input-bordered w-full bg-white border-gray-300 text-gray-700"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <FilterDropdown
            label="Barangay"
            options={BARANGAY_OPTIONS}
            value={barangayFilter}
            onChange={(val) => {
              setBarangayFilter(val);
              setCurrentPage(1);
            }}
          />
          <FilterDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Barangay</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">
                    {/* Updated to use fullName only */}
                    {user.fullName}
                    <div className="text-xs text-gray-500">
                      {user.bnsnumber ||
                        user.bnsNumber ||
                        user.bnsId ||
                        user._id}
                    </div>
                  </td>
                  <td className="p-3">{user.emailAddress || user.email}</td>
                  <td className="p-3">{user.barangay}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.approve
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.approve ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-green-600 hover:bg-green-50"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline border-gray-300 text-gray-600 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-sm btn-outline border-gray-300 text-gray-600 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
