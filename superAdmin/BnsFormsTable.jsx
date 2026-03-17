"use client";
import { useState } from "react";
import { Download, Trash2 } from "lucide-react"; // Assuming you want to use these icons from lucide-react
import Link from "next/link";
import { format } from "date-fns";
export default function AvailableForms({ data }) {
	console.log(data.reportTypes);
	const [forms, setForms] = useState(data?.reportTypes || []);

	const [currentPage, setCurrentPage] = useState(1);
	const reportsPerPage = 3; // Number of reports to show per page

	const totalReports = forms.length;
	const totalPages = Math.ceil(totalReports / reportsPerPage);

	// Function to determine the badge color based on the status
	const getStatusColor = (status) => {
		switch (status) {
			case "EXCEL":
				return "text-green-500"; // Green for EXCEL files
			case "PDF":
				return "text-red-500"; // Red for PDF files
			default:
				return "text-gray-500"; // Default gray
		}
	};

	// Calculate which reports to display based on the current page
	const indexOfLastReport = currentPage * reportsPerPage;
	const indexOfFirstReport = indexOfLastReport - reportsPerPage;
	const currentReports = forms.slice(indexOfFirstReport, indexOfLastReport);

	// Handle the deletion of a form
	const handleDelete = (index) => {
		setForms(forms.filter((_, i) => i !== index));
	};

	// Handle download action
	const handleDownload = (fileType) => {
		alert(`Downloading ${fileType} file...`);
	};

	// Pagination Button Handlers
	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};
	function getFileExtensionFromUrl(url) {
		try {
			const cleanUrl = decodeURIComponent(url.split("?")[0]);
			const parts = cleanUrl.split(".");
			return parts.length > 1 ? parts.pop().toLowerCase() : "unknown";
		} catch {
			return "unknown";
		}
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md my-6">
			<h2 className="text-2xl font-bold mb-4">Available Forms</h2>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr className="text-gray-500">
							<th className="font-semibold">Form Name</th>
							<th className="font-semibold">Description</th>
							<th className="font-semibold">Type</th>
							<th className="font-semibold">Upload Date</th>
							<th className="font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentReports.map((form, index) => (
							<tr key={index} className="hover">
								<td>{form?.title}</td>
								<td>{form?.description}</td>
								<td>
									<span
										className={`font-semibold ${getStatusColor(form?.type)}`}
									>
										{getFileExtensionFromUrl(form.formTemplateUrl)}
									</span>
								</td>
								<td>{format(new Date(form?.createdAt), "MMMM d, yyyy")}</td>
								<td className="flex gap-2">
									{/* Download Button */}
									<Link
										className="text-blue-600 font-medium hover:underline flex items-center gap-1"
										href={form?.formTemplateUrl}
                    target="_blank"
									>
										<Download size={16} />
										Download
									</Link>

									{/* Delete Button */}
									<button
										className="text-yellow-400 font-medium hover:underline flex items-center gap-1"
										onClick={() => handleDelete(index)}
									>
									
										Update
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className="flex justify-between items-center mt-4">
				<p className="text-sm text-gray-500">
					Page {currentPage} of {totalPages}
				</p>
				<div>
					<button
						onClick={handlePreviousPage}
						disabled={currentPage === 1}
						className="btn btn-sm bg-[#28a745] border-none text-white shadow-none mr-2"
					>
						Previous
					</button>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
						className="btn btn-sm bg-[#28a745] border-none text-white shadow-none"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
