"use client";
import AllActivitiesLogTable from "@/components/superAdmin/ActivityLogsTable";


function SuperAdminActivityLogPage() {
	return (
		<div className="text-black">
			<div className="">
				<p className="text-2xl font-bold">BNS Daily Diary</p>
				<p className="text-gray-500">
					Bns workers daily routine and specific task assignment
				</p>
			</div>
			<AllActivitiesLogTable />
		</div>
	);
}

export default SuperAdminActivityLogPage;
