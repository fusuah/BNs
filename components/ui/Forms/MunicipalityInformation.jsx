"use client";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useUpdateBnsWorkerMutation } from "@/service/auth/autApiSlice";
import toast from "react-hot-toast";

export default function MunicipalityInformationForm() {
    const { barangay, id } = useAuth(); // Assuming 'barangay' is the main location field available
    const [updateUser, { isLoading }] = useUpdateBnsWorkerMutation();

    const [formData, setFormData] = useState({
        municipalityName: "San Juan", // Defaults/Placeholders as these might not be in user model
        province: "Laguna",
        region: "CALABARZON",
        barangay: "", 
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            barangay: barangay || ""
        }));
    }, [barangay]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only updating 'barangay' as that's what seems to exist in the User model
            // If you have a separate Municipality model, we would need a different API slice
            await updateUser({
                id,
                barangay: formData.barangay
            }).unwrap();
            toast.success("Location information updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update location");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow w-full"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Location Information
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Update your assigned location details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Municipality Name (Static/Placeholder for now unless model changes) */}
                <div>
                    <label
                        htmlFor="municipalityName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Municipality Name
                    </label>
                    <input
                        type="text"
                        id="municipalityName"
                        name="municipalityName"
                        value={formData.municipalityName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border border-gray-300 text-sm p-2 bg-gray-50"
                        readOnly // Assuming fixed for the app instance
                    />
                </div>

                {/* Province */}
                <div>
                    <label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Province
                    </label>
                    <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border border-gray-300 text-sm p-2 bg-gray-50"
                        readOnly
                    />
                </div>

                {/* Region */}
                <div>
                    <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Region
                    </label>
                    <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border border-gray-300 text-sm p-2 bg-gray-50"
                        readOnly
                    />
                </div>

                {/* Barangay (Editable) */}
                <div>
                    <label
                        htmlFor="barangay"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Barangay (Assigned)
                    </label>
                    <input
                        type="text"
                        id="barangay"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border border-gray-300 text-sm p-2"
                        placeholder="e.g. Barangay Maligaya"
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