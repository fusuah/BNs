"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Submitted password change data:", formData);
    // Add API call to update password here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Update your account password.
      </p>

      <div className="mb-6">
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </div>
    </form>
  );
}
