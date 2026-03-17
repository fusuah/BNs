"use client";

const barangays = [
	{
		name: "San Antonio",
		assigned: 5,
		activity: 100,
		submission: "Today",
		compliance: 98,
		status: "Active",
	},
	{
		name: "Santa Maria",
		assigned: 3,
		activity: 67,
		submission: "Yesterday",
		compliance: 85,
		status: "Active",
	},
	{
		name: "San Jose",
		assigned: 4,
		activity: 75,
		submission: "3 days ago",
		compliance: 70,
		status: "Incomplete",
	},
	{
		name: "San Isidro",
		assigned: 4,
		activity: 50,
		submission: "1 week ago",
		compliance: 45,
		status: "Pending",
	},
	{
		name: "Poblacion",
		assigned: 6,
		activity: 83,
		submission: "Today",
		compliance: 92,
		status: "Active",
	},
];

function getComplianceColor(value) {
	if (value >= 90) return "bg-green-500";
	if (value >= 75) return "bg-yellow-400";
	return "bg-red-500";
}

function getStatusBadge(status) {
	const base = "px-3 py-0.5 rounded-full text-sm font-medium";
	switch (status) {
		case "Active":
			return (
				<span className={`${base} bg-green-100 text-green-700`}>Active</span>
			);
		case "Incomplete":
			return (
				<span className={`${base} bg-yellow-100 text-yellow-700`}>
					Incomplete
				</span>
			);
		case "Pending":
			return (
				<span className={`${base} bg-gray-100 text-gray-700`}>Pending</span>
			);
		default:
			return null;
	}
}

export default function BarangayPerformanceTable() {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div className="flex justify-between items-center p-4 border-b">
				<h2 className="font-semibold text-lg text-gray-900">
					Barangay Performance
				</h2>
				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="font-medium bg-white text-gray-800 border border-gray-300 w-48 px-4 py-2 rounded-lg flex justify-between items-center"
					>
						All Barangays
						<svg
							className="ml-2 w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content z-[1] menu p-2 bg-white rounded-box w-48 border border-gray-200 mt-1"
					>
						<li>
							<a className="bg-green-100 text-green-800 font-medium">
								All Barangays
							</a>
						</li>
						<li>
							<a className="font-medium">Active Barangays</a>
						</li>
						<li>
							<a className="font-medium">Needs Attention</a>
						</li>
					</ul>
				</div>
			</div>

			<table className="w-full text-sm text-left">
				<thead className="text-gray-500 bg-gray-50">
					<tr>
						<th className="p-4 font-medium">Barangay Name</th>
						<th className="p-4 font-medium">BNS Assigned</th>
						<th className="p-4 font-medium">Activity Rate</th>
						<th className="p-4 font-medium">Last Submission</th>
						<th className="p-4 font-medium">Compliance Rate</th>
						<th className="p-4 font-medium">Status</th>
						<th className="p-4" />
					</tr>
				</thead>
				<tbody className="text-gray-700">
					{barangays.map((b, i) => (
						<tr key={i} className="border-b hover:bg-gray-50">
							<td className="p-4 font-medium text-gray-900">{b.name}</td>
							<td className="p-4">{b.assigned}</td>
							<td className="p-4">
								<div className="flex items-center gap-2">
									<div className="w-20 h-2 bg-gray-200 rounded">
										<div
											className="h-2 bg-green-500 rounded"
											style={{ width: `${b.activity}%` }}
										/>
									</div>
									<span>{b.activity}%</span>
								</div>
							</td>
							<td className="p-4">{b.submission}</td>
							<td className="p-4">
								<div className="flex items-center gap-2">
									<div className="w-20 h-2 bg-gray-200 rounded">
										<div
											className={`h-2 ${getComplianceColor(
												b.compliance
											)} rounded`}
											style={{ width: `${b.compliance}%` }}
										/>
									</div>
									<span>{b.compliance}%</span>
								</div>
							</td>
							<td className="p-4">{getStatusBadge(b.status)}</td>
							<td className="p-4 ">
								<div className="dropdown dropdown-end">
									<div
										tabIndex={0}
										className="font-bold bg-white pb-2 "
									>
										<p>...</p>
									</div>
									<ul
										tabIndex={0}
										className="dropdown-content z-[1] menu p-2 bg-white rounded-box w-48 border border-gray-200 mt-1"
									>
										<li>
											<a className="font-medium">View Details</a>
										</li>
										<li>
											<a className="font-medium">Message BNS</a>
										</li>
										<li>
											<a className="font-medium">Review Reports</a>
										</li>
									</ul>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="flex items-center justify-between p-4 text-sm text-gray-500">
				<span>Showing 5 of 24 barangays</span>
				<div className="space-x-2">
					<button className="border rounded px-3 py-1 hover:bg-gray-50">
						Previous
					</button>
					<button className="border rounded px-3 py-1 hover:bg-gray-50">
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
