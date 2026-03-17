"use client";
import { useState } from "react";

const notif = [
	{
		id: "bnsUserRequests",
		title: "New BNS User Requests",
		description: "Receive notifications when new BNS users request access",
	},
	{
		id: "reportSubmissions",
		title: "Report Submissions",
		description: "Receive notifications when reports are submitted",
	},
	{
		id: "missingReports",
		title: "Missing Reports",
		description: "Receive reminders for missing or late reports",
	},
	{
		id: "systemUpdates",
		title: "System Updates",
		description: "Receive notifications about system updates",
	},
];

export default function NotificationPreferences() {
	const [preferences, setPreferences] = useState({
		bnsUserRequests: true,
		reportSubmissions: true,
		missingReports: true,
		systemUpdates: false,
	});

	const togglePreference = (key) => {
		setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Saved preferences:", preferences);
		// Add save logic or API call here
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-6 rounded-lg shadow w-full"
		>
			<h2 className="text-2xl font-bold text-gray-800 mb-1">
				Notification Preferences
			</h2>
			<p className="text-sm text-gray-500 mb-6">
				Control which notifications you receive.
			</p>

			<div className="space-y-6">
				{notif.map((item) => (
					<div key={item.id} className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-800">{item.title}</p>
							<p className="text-sm text-gray-500">{item.description}</p>
						</div>
						<label className="inline-flex relative items-center cursor-pointer">
							<input
								type="checkbox"
								checked={preferences[item.id]}
								onChange={() => togglePreference(item.id)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
						</label>
					</div>
				))}
			</div>

			<div className="mt-6">
				<button
					type="submit"
					className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
				>
					Save Preferences
				</button>
			</div>
		</form>
	);
}
