"use client";
import { useState } from "react";
import { Download, Calendar, Filter } from "lucide-react"; // Assuming you have the download and calendar icons from lucide-react
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useGetAllReportGeneratedQuery } from "@/service/bnsReports/bnsReportsApiSlice";
export default function RecentReports() {
	const generatedReport = useGetAllReportGeneratedQuery();
	const [selectedDate, setSelectedDate] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const reportsPerPage = 5; // Number of reports per page

	const totalReports = generatedReport?.data?.length ?? 0;
	const totalPages = Math.ceil(totalReports / reportsPerPage);

	// Function to determine the badge color based on the status
	const getStatusColor = (status) => {
		switch (status) {
			case "Complete":
				return "bg-green-200 text-green-800"; // Green for complete
			case "Pending":
				return "bg-yellow-200 text-yellow-800"; // Yellow for pending
			default:
				return "bg-gray-200 text-gray-800"; // Default gray
		}
	};

	// Calculate the range of reports to display based on current page
	const indexOfLastReport = currentPage * reportsPerPage;
	const indexOfFirstReport = indexOfLastReport - reportsPerPage;
	const currentReports = generatedReport?.data?.slice(
		indexOfFirstReport,
		indexOfLastReport
	);

	// Pagination Button Handlers
	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md my-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Recent Reports</h2>

				{/* Right Aligned Section */}
				<div className="flex gap-4 items-center">
					{/* Date Picker Button */}
					<div className="dropdown dropdown-end">
						<button
							className="px-4 py-2 h-9 w-44 rounded-lg border bg-white text-sm font-semibold text-gray-700 border-gray-200 flex justify-start gap-2 items-center"
							tabIndex={0}
						>
							<Calendar size={16} />{" "}
							{selectedDate
								? selectedDate.toLocaleDateString()
								: "Select a Period"}
						</button>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] menu p-2 bg-white rounded-box w-fit border border-gray-200 mt-1"
						>
							<li className="w-full">
								<DayPicker
									mode="single"
									selected={selectedDate}
									onSelect={setSelectedDate}
									footer={
										selectedDate
											? `Selected: ${selectedDate.toLocaleDateString()}`
											: "Pick a day."
									}
								/>
							</li>
						</ul>
					</div>

					{/* Filter Button */}
					<button className="btn btn-sm shadow-none h-9 bg-white text-sm border-gray-300 rounded-lg px-4 py-2">
						<span className="text-gray-600">
							<Filter size={16} />
						</span>
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr className="text-gray-500">
							<th className="font-semibold">Report Name</th>
							<th className="font-semibold">Period</th>
							<th className="font-semibold">Status</th>
							<th className="font-semibold">Barangays</th>
							<th className="font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentReports?.map((report, index) => (
							<tr key={index} className="hover">
								<td>{report?.reportTypeId?.title}</td>
								<td>{report?.period}</td>
								<td>
									<span
										className={`badge border-none py-1 px-4 rounded-full ${getStatusColor(
											report?.status
										)}`}
									>
										Completed
									</span>
								</td>
								<td>24/24</td>
								<td className="flex gap-2">
									<button className="text-blue-600 font-medium hover:underline mr-2">
										View
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
