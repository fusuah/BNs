"use client";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useUpdateBnsWorkerMutation } from "@/service/auth/autApiSlice"; // Assuming this handles updates or a generic update
import toast from "react-hot-toast";

export default function ProfileForm() {
  const { name, email, number, id, roles } = useAuth(); // Get data from auth hook
  
  const [updateUser, { isLoading }] = useUpdateBnsWorkerMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    position: "", // We might map 'roles' or 'type' to this
    number: "",
  });

  // Populate form when user data is available
  useEffect(() => {
    setFormData({
      fullName: name || "",
      email: email || "",
      position: Array.isArray(roles) ? roles.join(", ") : roles || "Admin", // Handle roles format
      number: number || "",
    });
  }, [name, email, number, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to update profile
      // We pass 'id' and the fields to update
      await updateUser({ 
          id, 
          fullName: formData.fullName, 
          email: formData.email, 
          number: formData.number 
          // Position usually isn't editable by self if it's role-based, but depends on backend
      }).unwrap();
      
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Profile Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Update your account profile information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
          />
        </div>

        {/* Position (Read Only usually) */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position / Role
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            readOnly
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:bg-green-400"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}