"use client";
import RecentReports from "./RecentReports";
import { useGetAllReportGeneratedQuery } from "@/service/bnsReports/bnsReportsApiSlice";
function ReportsOverview() {
	const generatedReport = useGetAllReportGeneratedQuery();
	console.log(generatedReport.data);
	return (
		<>
			<div className="flex gap-6">
				{/* Available Reports Card */}
				<div className="bg-white p-6 rounded-lg shadow-md w-full">
					<h3 className="text-lg font-semibold">Available Reports</h3>
					<div className="mt-4 text-2xl font-bold">12</div>
					<p className="text-gray-500 text-sm">Report types in system</p>
				</div>

				{/* Pending Reports Card */}
				<div className="bg-white p-6 rounded-lg shadow-md w-full">
					<h3 className="text-lg font-semibold">Pending Reports</h3>
					<div className="mt-4 text-2xl font-bold">2</div>
					<p className="text-gray-500 text-sm">Awaiting submissions</p>
				</div>

				{/* Submission Rate Card */}
				<div className="bg-white p-6 rounded-lg shadow-md w-full">
					<h3 className="text-lg font-semibold">Submission Rate</h3>
					<div className="mt-4 text-2xl font-bold">92%</div>
					<p className="text-gray-500 text-sm">Average across all barangays</p>
				</div>
			</div>

			<RecentReports />
		</>
	);
}

export default ReportsOverview;
