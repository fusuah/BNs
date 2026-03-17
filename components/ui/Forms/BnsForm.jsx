"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useAddReportTypeMutation } from "@/service/bnsReports/bnsReportsApiSlice";
import toast from "react-hot-toast";

export default function BnsForm({ refetch }) {
	const [formName, setFormName] = useState("");
	const [description, setDescription] = useState("");
	const [frequency, setFrequency] = useState("");
	const [file, setFile] = useState(null);

	const [addReport, { isLoading: isSubmitting }] = useAddReportTypeMutation();

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	// const handleUpload = () => {
	// 	if (!formName || !description || !frequency || !file) {
	// 		toast.error("Please complete all fields.");
	// 		return;
	// 	}
	// 	const fileExtension = file.name.split(".").pop();
	// 	const storagePath = `bns-forms/${Date.now()}-${formName}.${fileExtension}`;
	// 	uploadFile(file, storagePath);
	// };

	// const handleAddReport = async () => {
	// 	try {
	// 		await addReport({
	// 			title: formName,
	// 			description,
	// 			frequency,
	// 			formTemplateUrl: downloadURL,
	// 		}).unwrap();

	// 		toast.success("Report form uploaded successfully!");

	// 		setFormName("");
	// 		setDescription("");
	// 		setFrequency("");
	// 		setFile(null);
	// 		refetch();
	// 	} catch (err) {
	// 		console.error("Error submitting form:", err);
	// 		toast.error("Failed to submit the report form.");
	// 	}
	// };

	// // Reactively submit when downloadURL is ready
	// useEffect(() => {
	// 	if (downloadURL) {
	// 		handleAddReport();
	// 	}
	// }, [downloadURL]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-bold mb-4">
				Upload New Form Report Template
			</h2>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleUpload();
				}}
			>
				{/* Form Name */}
				<div className="mb-4">
					<label
						htmlFor="formName"
						className="block text-sm font-semibold text-gray-700"
					>
						Form Name
					</label>
					<input
						type="text"
						id="formName"
						value={formName}
						onChange={(e) => setFormName(e.target.value)}
						placeholder="Enter form name"
						className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
						required
					/>
				</div>

				{/* Description */}
				<div className="mb-4">
					<label
						htmlFor="description"
						className="block text-sm font-semibold text-gray-700"
					>
						Description
					</label>
					<input
						type="text"
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Brief description of the form"
						className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
						required
					/>
				</div>

				{/* Frequency */}
				<div className="mb-4">
					<label
						htmlFor="frequency"
						className="block text-sm font-semibold text-gray-700"
					>
						Frequency
					</label>
					<select
						id="frequency"
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
						className="select select-bordered w-full mt-1 bg-white border-gray-300"
						required
					>
						<option value="" disabled>
							Select frequency
						</option>
						<option value="monthly">Monthly</option>
						<option value="quarterly">Quarterly</option>
						<option value="annual">Annual</option>
					</select>
				</div>

				{/* File Upload */}
				<div className="mb-4">
					<label
						htmlFor="file"
						className="block text-sm font-semibold text-gray-700"
					>
						Upload File (PDF or Excel)
					</label>
					<div className="flex items-center gap-2 mt-1">
						<input
							type="file"
							id="file"
							accept=".pdf,.xls,.xlsx"
							onChange={handleFileChange}
							className="p-2 w-full border border-gray-300 rounded-lg"
							required
						/>
						<span className="text-sm text-gray-500">
							{file ? file.name : "No file chosen"}
						</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Accepted formats: PDF, XLS, XLSX
					</p>
					{/* {isUploading && (
						<p className="text-xs text-blue-600 mt-1">Uploading: {progress}%</p>
					)} */}
				</div>

				{/* Submit Button */}
				<div className="flex justify-start">
					<button
						type="submit"
						// disabled={isUploading || isSubmitting}
						className="btn border-none shadow-none bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition disabled:opacity-50"
					>
						<Upload size={16} />
						<span>
							{/* {isUploading || isSubmitting ? "Uploading..." : "Upload Form"} */}
							Submit
						</span>
					</button>
				</div>
			</form>
		</div>
	);
}
