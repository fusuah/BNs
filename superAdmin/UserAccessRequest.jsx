"use client";

import { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import {
	useApproveAndRejectBnsUserMutation,
	useGetPostQuery,
	useUpdateBnsWorkerMutation,
} from "@/service/auth/autApiSlice";
import NewBnsModal from "../ui/modals/NewBnsModal";
import toast from "react-hot-toast";
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

const barangayOptions = [
	"Barangay Maligaya",
	"Barangay 2",
	"Barangay 3",
	"Barangay 4",
];

export default function UserAccessRequests() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data: userData, refetch } = useGetPostQuery();
	const [isViewing, setIsViewing] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [bnsWorkerData, setBnsWorkerData] = useState({});
	const [accountStatus, setAccountStatus] = useState(false);
	const [approveRejectBnsWorker, { isError }] =
		useApproveAndRejectBnsUserMutation();
	const [updateWorkerData] = useUpdateBnsWorkerMutation();

	const bnsUserData = (userData ?? []).filter((u) => {
		const hasApprove = "approve" in u;
		const isBnsWorker = u.type === "bns-worker";
		return hasApprove && isBnsWorker;
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBnsWorkerData((prev) => ({
			...prev,
			[name]: name === "approve" ? value === "true" : value, // cast to boolean
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await updateWorkerData({
				...bnsWorkerData,
				id: bnsWorkerData._id,
			});
			console.log("Update success" + result);
			toast.success("Update success");
			setIsEditing(false);
			refetch();
		} catch (error) {
			console.error(error);
		}
	};

	// approved user
	const handleApprove = async (id) => {
		try {
			console.log(id);
			const result = await approveRejectBnsWorker({
				id,
				type: "approve",
			}).unwrap();

			console.log("Approve success:", result);
			toast.success("Approved success");
			refetch();
			// You can refetch queries or update UI here
		} catch (err) {
			console.error("Failed to approve:", err);
		}
	};

	// reject user
	const handleDecline = async (id) => {
		try {
			const result = await approveRejectBnsWorker({
				id,
				type: "decline",
			});
			console.log("Decline success:", result);
			toast.success("Decline success");
			refetch();
			// You can refetch queries or update UI here
		} catch (err) {
			console.error("Failed to decline:", err);
		}
	};

	const totalPages = Math.ceil(bnsUserData.length / ITEMS_PER_PAGE);
	const paginated = bnsUserData.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);
	console.log(paginated);
	return (
		<>
			<div className="bg-white p-6 rounded-2xl shadow-md w-full mx-auto my-6">
				{!isViewing && !isEditing && (
					<>
						{/* Header */}
						<div className="flex justify-between items-center mb-4">
							<div>
								<h2 className="text-xl font-bold text-gray-800">
									List of admin BNS Users
								</h2>
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
							</div>
						</div>

						{/* Tabs */}
						{/* <div className="flex items-center gap-4 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit mb-4">
							{TABS.map((t) => {
								const isActive = tab === t;
								const getCount = (currentTab) => {
									return bnsUserData?.filter((u) => {
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
						</div> */}

						{/* Cards */}
						{paginated.map((user) => (
							<div
								key={user.id}
								className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-3 hover:shadow-sm transition"
							>
								<div className="flex items-start gap-4">
									<div
										onClick={() => {
											setIsViewing(true);
											setBnsWorkerData({ ...user });
										}}
										className="flex items-center justify-center h-10 w-10 bg-green-200 text-green-800 rounded-full font-bold text-sm"
									>
										{user.fullName
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
									</div>
								</div>
								<div className="flex gap-2">
									<>
										<button
											onClick={() => {
												setIsViewing(true);
												setBnsWorkerData({ ...user });
											}}
											className="btn btn-sm bg-[#28a745] text-white shadow-md hover:opacity-90 border-none"
										>
											View Details
										</button>
										<button
											onClick={() => {
												setIsEditing(true);
												setBnsWorkerData({ ...user });
											}}
											className="btn btn-sm bg-yellow-500 text-white shadow-md hover:opacity-90 border-none"
										>
											Edit Account
										</button>
									</>
								</div>
							</div>
						))}

						{paginated.length === 0 && (
							<div className="text-center text-sm text-gray-500 py-6">
								No user found.
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
					</>
				)}

				{/* view data */}
				{isViewing && (
					<>
						<h2 className="card-title mb-6 text-xl font-semibold">
							Beneficiary Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
							{/* ... same InfoRow usage ... */}
							<InfoRow label="Name" value={bnsWorkerData.fullName || "N/A"} />
							<InfoRow label="Email" value={bnsWorkerData.email || "N/A"} />
							<InfoRow
								label="Address"
								value={bnsWorkerData.barangay || "N/A"}
							/>
							<InfoRow label="Number" value={bnsWorkerData.number || "N/A"} />
							<InfoRow
								label="BNS Number"
								value={bnsWorkerData.bnsId || "N/A"}
							/>
							<InfoRow
								label="Account Status"
								value={
									bnsWorkerData.approve ? (
										<span className="badge badge-success">Active</span>
									) : (
										<span className="badge badge-warning">Inactive</span>
									)
								}
							/>
						</div>
					</>
				)}
				{isEditing && (
					<>
						<h2 className="card-title mb-6 text-xl font-semibold">
							Edit Beneficiary Information
						</h2>
						<form onSubmit={handleSubmit} className="w-full bg-white">
							<div className="form-control mb-4 flex flex-col gap-2 ">
								<label htmlFor="fullName" className="label">
									<span className="label-text">Full Name</span>
								</label>
								<input
									id="fullName"
									name="fullName"
									type="text"
									required
									value={bnsWorkerData.fullName}
									onChange={handleChange}
									className="input input-bordered bg-white w-full border-gray-200"
								/>
							</div>

							<div className="form-control mb-4 flex flex-col gap-2">
								<label htmlFor="email" className="label">
									<span className="label-text">Email</span>
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={bnsWorkerData.email}
									onChange={handleChange}
									className="input input-bordered bg-white w-full border-gray-200"
								/>
							</div>

							<div className="form-control mb-4 flex flex-col gap-2">
								<label htmlFor="number" className="label">
									<span className="label-text">Contact Number</span>
								</label>
								<input
									id="number"
									name="number"
									type="tel"
									value={bnsWorkerData.number}
									onChange={handleChange}
									className="input input-bordered bg-white w-full border-gray-200"
								/>
							</div>
							<div className="form-control mb-6">
								<label htmlFor="barangay" className="label">
									<span className="label-text">Barangay</span>
								</label>
								<input
									id="barangay"
									name="barangay"
									type="text"
									value={bnsWorkerData.barangay}
									onChange={handleChange}
									className="input input-bordered bg-white w-full border-gray-200"
								/>
							</div>
							<div className="form-control mb-6">
								<label htmlFor="accountStatus" className="label">
									<span className="label-text">Account Status</span>
								</label>
								<select
									id="approve"
									name="approve"
									value={String(!!bnsWorkerData.approve)}
									onChange={handleChange}
									className="select select-bordered w-full bg-white border-gray-200"
								>
									<option value="true">Active</option>
									<option value="false">Inactive</option>
								</select>
							</div>
							<div className="flex justify-between">
								<button
									className="btn bg-gray-500 border-none w-24"
									onClick={() => {
										setIsEditing(false);
										setBnsWorkerData({});
									}}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn bg-green-500 border-none w-24"
								>
									Save Changes
								</button>
							</div>
						</form>
					</>
				)}
			</div>
			{isViewing && (
				<button
					className="btn bg-gray-500 border-none w-24"
					onClick={() => {
						setIsViewing(false);
						setBnsWorkerData({});
					}}
				>
					Back
				</button>
			)}
			<NewBnsModal id={"addBns"} refetch={refetch} />
		</>
	);
}
