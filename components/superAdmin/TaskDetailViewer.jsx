// TaskDetailViewer.jsx
"use client";
import { parseISO, format } from "date-fns";
import Link from "next/link";

export default function TaskDetailViewer({
	task,
	onApprove,
	onReject,
	onClose,
}) {
	// Convert ISO string to a Date and format as “M/d/yyyy”
	const formattedDate = format(parseISO(task.date), "M/d/yyyy");

	// Pick a text‐color class based on status
	let statusColorClass = "text-gray-600";
	if (task.status === "PENDING") statusColorClass = "text-yellow-600";
	if (task.status === "APPROVED") statusColorClass = "text-green-600";
	if (task.status === "REJECTED") statusColorClass = "text-red-600";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			{/* White card */}
			<div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl">
				{/* Header */}
				<div className="px-6 py-4 border-b">
					<h2 className="text-xl font-semibold">
						View Task Details for "{task.title}"
					</h2>
				</div>

				{/* Content */}
				<div className="px-6 py-4 h-[70vh] overflow-y-scroll">
					<table className="w-full">
						<tbody>
							<tr className="border-b">
								<td className="py-2 font-medium text-gray-700">Title:</td>
								<td className="py-2">{task.title}</td>
							</tr>
							<tr className="border-b">
								<td className="py-2 font-medium text-gray-700">Category:</td>
								<td className="py-2">{task.category}</td>
							</tr>
							<tr className="border-b">
								<td className="py-2 font-medium text-gray-700">Description:</td>
								<td className="py-2">{task.description}</td>
							</tr>
							<tr className="border-b">
								<td className="py-2 font-medium text-gray-700">Date:</td>
								<td className="py-2">{formattedDate}</td>
							</tr>

							<tr className="border-b">
								<td className="py-2 font-medium text-gray-700">Status:</td>
								<td className={`py-2 font-semibold ${statusColorClass}`}>
									{task.status}
								</td>
							</tr>
							<tr>
								<td className="py-2 font-medium text-gray-700">
									Verification Image URL:
								</td>
								<td className={`py-2 font-semibold`}>
									<Link
										href={
											task?.verificationImgUrl ? task.verificationImgUrl : ""
										}
									>
										Verification Image View
									</Link>

									<img
										className="max-h-[300px] max-w-[300px]"
										src={task?.verificationImgUrl}
										alt=""
										srcset=""
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Footer Buttons */}
				<div className="px-6 py-4 border-t flex justify-end space-x-2">
					<button
						onClick={() => onReject(task.index)}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
					>
						Reject
					</button>
					<button
						onClick={(e) => onApprove(e, task.index)}
						className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
					>
						Approve
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
