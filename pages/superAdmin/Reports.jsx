"use client";
import { useState } from "react";
import ReportsOverview from "@/components/superAdmin/ReportsOverview";
import BnsForm from "@/components/ui/Forms/BnsForm";
import BnsFormsTable from "@/components/superAdmin/BnsFormsTable";
import { useGetAllReportTypeQuery } from "@/service/bnsReports/bnsReportsApiSlice";
const TABS = ["Reports Overview", "BNS Forms"];
function SuperAdminReportsPage() {
	const allReports = useGetAllReportTypeQuery();
	const [tab, setTab] = useState("Reports Overview");
	return (
		<div className="text-black">
			<div className="">
				<p className="text-2xl font-bold">Reports</p>
				<p className="text-gray-500">
					View and manage all nutrition program reports and forms.
				</p>
			</div>
			{/* Tabs */}
			<div className="flex items-center gap-2 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit  my-6">
				{TABS.map((t) => {
					const isActive = tab === t;

					return (
						<button
							key={t}
							onClick={() => {
								setTab(t);
							}}
							className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
								isActive ? "bg-white shadow text-black" : "text-gray-500"
							}`}
						>
							<span>{t}</span>
						</button>
					);
				})}
			</div>

			{tab === "Reports Overview" ? (
				<ReportsOverview />
			) : (
				<>
					<BnsForm refetch={allReports?.refetch} />
					<BnsFormsTable data={allReports?.data} />
				</>
			)}
		</div>
	);
}

export default SuperAdminReportsPage;
