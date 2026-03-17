"use client";
import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import { format } from "date-fns";
import {
	useApproveDeclineNutritioDataMutation,
	useGetChildrenNutritionDataQuery,
} from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import { setDate } from "date-fns";
import FilterDropdown from "@/components/ui/FilterDropdown";

const TABS = ["Pending", "Approved"];
const ITEMS_PER_PAGE = 3;
function InfoRow({ label, value }) {
	return (
		<div className="flex justify-between border-b border-gray-200 pb-2">
			<span className="font-semibold">{label}:</span>
			<span>{value}</span>
		</div>
	);
}
const formatDate = (dateStr) => {
	try {
		return format(new Date(dateStr), "MMMM d, yyyy");
	} catch {
		return "Invalid Date";
	}
};
const filterOptions = ["All", "Children", "Pwd"];
function Page() {
	const {
		data: beneficiaryData,
		isSuccess,
		error,
	} = useGetChildrenNutritionDataQuery();

	const [approvedDeclineBeneficiaryData, { isError }] =
		useApproveDeclineNutritioDataMutation();

	const [tab, setTab] = useState("Pending");
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [userData, setUserData] = useState({});
	const [isViewing, setIsViewing] = useState(false);
	const [filter, setFilter] = useState("All");
	const filteredData = (beneficiaryData ?? []).filter((u) => {
		const matchesTab =
			(tab === "Pending" && !u.approve) || (tab === "Approved" && u.approve);
		const matchesSearch = u.name
			? u.name.toLowerCase().includes(search.toLowerCase())
			: false;
		const matchesType =
			filter === "All" || u.type === filter.toLocaleLowerCase();
		return matchesTab && matchesSearch && matchesType;
	});

	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
	const paginated = filteredData.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	// approved user
	const handleApprove = async (id) => {
		try {
			console.log(id);
			const result = await approvedDeclineBeneficiaryData({
				id,
				type: "approve",
			}).unwrap();

			console.log("Approve success:", result);
			// You can refetch queries or update UI here
		} catch (err) {
			console.error("Failed to approve:", err);
		}
	};

	// reject user
	const handleDecline = async (id) => {
		try {
			const result = await approvedDeclineBeneficiaryData({
				id,
				type: "decline",
			});
			console.log("Decline success:", result);
			// You can refetch queries or update UI here
		} catch (err) {
			console.error("Failed to decline:", err);
		}
	};



	return (
		<div className="text-black">
			<div className="">
				<p className="text-2xl font-bold">Benefiary Users</p>
				<p className="text-gray-500">Manage Benefiary users</p>
			</div>
			{!isViewing && (
				<>
					<div className="bg-white p-6 rounded-2xl shadow-md w-full mx-auto my-6">
						{/* Header */}
						<div className="flex justify-between items-center mb-4">
							<div>
								<h2 className="text-xl font-bold text-gray-800">Beneficiary</h2>
								<p className="text-sm text-gray-500">
									Review and approve Benefiary users
								</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="relative w-full h-9">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
										<Search size={16} />
									</span>
									<input
										type="text"
										placeholder="Search users..."
										className="w-full h-full pl-10 pr-4 py-2 rounded-lg bg-white text-sm outline-none border border-gray-200"
										value={search}
										onChange={(e) => {
											setPage(1); // reset to page 1 when searching
											setSearch(e.target.value);
										}}
									/>
								</div>
								<FilterDropdown
									options={filterOptions}
									selected={filter}
									onSelect={setFilter}
								/>
							</div>
						</div>

						{/* Tabs */}
						<div className="flex items-center gap-4 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit mb-4">
							{TABS.map((t) => {
								const isActive = tab === t;
								const getCount = (currentTab) => {
									return beneficiaryData?.filter((u) => {
										return (
											(currentTab === "Pending" && !u.approve) ||
											(currentTab === "Approved" && u.approve)
										);
									}).length;
								};
								const count = getCount(t);

								const badgeColors = {
									Pending: "bg-yellow-100 text-yellow-800",
									Approved: "bg-green-100 text-green-800",
								};

								return (
									<button
										key={t}
										onClick={() => {
											setTab(t);
											setPage(1);
										}}
										className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
											isActive ? "bg-white shadow text-black" : "text-gray-500"
										}`}
									>
										<span>{t}</span>
										<span
											className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[t]}`}
										>
											{count}
										</span>
									</button>
								);
							})}
						</div>

						{/* Cards */}
						{paginated.map((user) => (
							<div
								key={user.id}
								className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-3 hover:shadow-sm transition"
							>
								<div className="flex items-start gap-4">
									<div className="flex items-center justify-center h-10 w-10 bg-green-200 text-green-800 rounded-full font-bold text-sm">
										{user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.substring(0, 2)
											.toUpperCase()}
									</div>
									<div className="text-sm text-gray-800 space-y-0.5">
										<p className="font-semibold">{user.name}</p>

										<p className="text-gray-600">{user.role}</p>
										<p className="text-gray-600">{user.barangay}</p>
										<p className="text-gray-500">
											{user.email} • {user.contact}
										</p>
										<p className="text-xs text-gray-400">
											Requested on {formatDate(user.createdAt)}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									{tab === "Approved" && (
										<>
											<button
												onClick={() => {
													setIsViewing(true);
													setUserData({ ...user });
												}}
												className="btn btn-sm bg-[#28a745] text-white shadow-md hover:opacity-90 border-none"
											>
												View
											</button>
										</>
									)}
									{tab === "Pending" && (
										<>
											<button
												onClick={() => handleDecline(user._id)}
												className="btn btn-sm bg-red-700 text-white shadow-md hover:opacity-90 border-none"
											>
												Reject
											</button>
											<button
												onClick={() => handleApprove(user._id)}
												className="btn btn-sm bg-[#28a745] text-white shadow-md hover:opacity-90 border-none"
											>
												Approve
											</button>
										</>
									)}
								</div>
							</div>
						))}

						{paginated.length === 0 && (
							<div className="text-center text-sm text-gray-500 py-6">
								No {tab} user found.
							</div>
						)}

						{/* Pagination */}
						<div className="flex justify-end items-center gap-3 mt-4">
							<button
								className="btn btn-sm bg-[#28a745] border-none text-white shadow-none"
								onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
								disabled={page === 1}
							>
								Previous
							</button>
							<span className="text-sm">
								Page {page} of {totalPages}
							</span>
							<button
								className="btn btn-sm bg-[#28a745] border-none text-white shadow-none"
								onClick={() =>
									setPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={page === totalPages}
							>
								Next
							</button>
						</div>
					</div>
				</>
			)}

			{/* viewing mode */}
			{isViewing && (
				<>
					<div className="card w-full shadow-md rounded-lg p-6 mt-6 bg-white">
						<h2 className="card-title mb-6 text-xl font-semibold">
							Beneficiary Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
							{/* ... same InfoRow usage ... */}
							<InfoRow label="Name" value={userData.name || "N/A"} />
							<InfoRow label="Mother" value={userData.mother || "N/A"} />
							<InfoRow
								label="Contact Number"
								value={userData.number || "N/A"}
							/>
							<InfoRow label="Email" value={userData.email || "N/A"} />
							<InfoRow label="Address" value={userData.address || "N/A"} />
							<InfoRow label="Gender" value={userData.gender || "N/A"} />
							<InfoRow
								label="Birth Date"
								value={
									userData.birthDate ? formatDate(userData.birthDate) : "N/A"
								}
							/>
							<InfoRow
								label="Age (Months)"
								value={userData.ageMonths ?? "N/A"}
							/>
							<InfoRow label="BMI" value={userData.bmi ?? "N/A"} />
							<InfoRow label="BNS Code" value={userData.bns_code || "N/A"} />
							<InfoRow
								label="Approval Status"
								value={
									userData.approve ? (
										<span className="badge badge-success">Approved</span>
									) : (
										<span className="badge badge-warning">Pending</span>
									)
								}
							/>
							<InfoRow
								label="Created At"
								value={
									userData.createdAt ? formatDate(userData.createdAt) : "N/A"
								}
							/>
							<InfoRow
								label="Updated At"
								value={
									userData.updatedAt ? formatDate(userData.updatedAt) : "N/A"
								}
							/>
						</div>
					</div>
					<button
						className="btn mt-6 bg-gray-500 border-none w-24"
						onClick={() => {
							setIsViewing(false);
							setIsEditing(false);
							setUserData({});
						}}
					>
						Back
					</button>
				</>
			)}
		</div>
	);
}

export default Page;
