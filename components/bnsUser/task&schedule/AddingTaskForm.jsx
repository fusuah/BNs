"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { useUpdateNewBnsWorkerTaskMutation } from "@/service/bnsWorkerTask/bnsWorkerApiSlice";

const AddingTaskForm = ({ modalOpen, setModalOpen, data, userId, refetch }) => {
	const [selectedFile, setSelectedFile] = useState(null);

	const [updateTask] = useUpdateNewBnsWorkerTaskMutation();

	const handleUpload = () => {
		if (!selectedFile) return alert("Please choose a file first");
		const fileExtension = selectedFile.name.split(".").pop();
		const storagePath = `bnsWorker/${userId}/tasks/${data._id}/confirmationImage.${fileExtension}`;
		// uploadFile(selectedFile, storagePath);
	};

	const handleSubmit = async (taskId) => {
		try {
			const updatedTaskInfo = {
				title: data?.title,
				description: data?.description,
				status: "review",
				category: data?.category,
				verificationImgUrl: downloadURL,
				date: data?.date,
			};
			await updateTask({
				userId,
				taskId,
				updatedFields: updatedTaskInfo,
			}).unwrap();
			alert("Task updated successfully.");
			setModalOpen(false);
			refetch();
		} catch (error) {
			console.error("Error updating task:", error);
			alert("Failed to update task.");
		}
	};

	return (
		<div
			className={`h-screen  w-screen flex justify-center items-center bg-[#00000082] fixed top-0 left-0 z-[999]  ${
				modalOpen ? "flex" : "hidden"
			}`}
		>
			<div className="bg-white max-h-[80vh] p-6 rounded-md relative flex flex-col justify-between h-fit gap-3 overflow-scroll">
				<button
					className="absolute right-[5%] top-6"
					onClick={() => setModalOpen(false)}
				>
					<i className="bi bi-x"></i>
				</button>

				<h3 className="text-[18px] font-semibold">Bns Worker Task</h3>
				<p className="text-[14px] text-[#64748b]">
					Upload an image for admin verification of your task
				</p>

				{/* Task Title */}
				<div className="w-full flex flex-col">
					<label htmlFor="tasktitle" className="text-sm font-medium mb-2">
						Task Title
					</label>
					<input
						type="text"
						id="tasktitle"
						className="px-[8px] py-[12px] w-[534px] outline-none rounded-md border border-gray-200 text-black text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
						value={data?.title ?? ""}
						readOnly
					/>
				</div>

				{/* Description */}
				<div className="w-full">
					<label htmlFor="description" className="text-sm font-medium mb-2">
						Description
					</label>
					<textarea
						id="description"
						className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200 text-black text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[108px] resize-none"
						value={data?.description ?? ""}
						readOnly
					/>
				</div>

				{/* Date */}
				<div className="w-[534px] flex gap-6">
					<div className="w-1/2 flex flex-col">
						<label htmlFor="date" className="text-sm font-medium mb-2">
							Date
						</label>
						<div>{data?.date}</div>
					</div>
				</div>

				{/* File Upload */}
				<div className="w-full">
					<label htmlFor="file" className="text-sm font-medium mb-2">
						Upload Picture:
					</label>
					<input
						type="file"
						id="file"
						accept="image/*"
						className="text-sm"
						onChange={(e) => {
							const file = e.target.files?.[0] || null;
							setSelectedFile(file);
							setPreviewURL(file ? URL.createObjectURL(file) : null);
						}}
					/>
					{selectedFile && (
						<p className="text-sm text-gray-500 mt-1">
							Selected file: {selectedFile.name}
						</p>
					)}

					{/* Preview BEFORE upload */}
					{/* {previewURL && (
						<div className="mt-4 border rounded-md p-2 w-fit">
							<p className="text-sm text-gray-500 mb-2">
								Preview before upload:
							</p>
							<Image
								src={previewURL}
								alt="Preview"
								width={250}
								height={250}
								className="rounded-md object-cover"
							/>
						</div>
					)} */}

					{/* Preview AFTER upload */}
					{/* {downloadURL && (
						<div className="mt-4">
							<p className="text-sm text-green-600 font-medium">
								Successfully uploaded:
							</p>
							<Image
								src={downloadURL}
								alt="Uploaded"
								width={250}
								height={250}
								className="rounded-md object-cover mt-1"
							/>
						</div>
					)} */}
				</div>

				{/* Buttons */}
				<div className="w-full flex justify-end gap-6 items-center mt-4">
					<button
						className="border border-gray-400 text-[12px] px-[24px] py-[8px] rounded-md font-medium cursor-pointer hover:bg-[#FFC105]"
						onClick={() => setModalOpen(false)}
					>
						Cancel
					</button>
					<button
						className="bg-[#4CAF50] text-white text-[12px] px-[24px] py-[8px] rounded-md font-medium cursor-pointer hover:opacity-70"
						// onClick={handleUpload}
						// disabled={isUploading}
					>
						{isUploading ? "Uploading..." : "Upload Image"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddingTaskForm;
