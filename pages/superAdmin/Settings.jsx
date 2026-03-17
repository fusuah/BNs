"use client";
import NotificationPreferences from "@/components/superAdmin/NotificationPreference";
import ChangePasswordForm from "@/components/ui/Forms/ChangePassword";
import MunicipalityInformationForm from "@/components/ui/Forms/MunicipalityInformation";
import ProfileForm from "@/components/ui/Forms/ProfileInformation";
import { useState } from "react";
const TABS = ["Account", "Municipality"];
function SuperAdminSettingsPage() {
	const [tab, setTab] = useState("Account");
	return (
		<div className="text-black">
			<div className="">
				<p className="text-2xl font-bold">Settings</p>
				<p className="text-gray-500">
					Manage system settings and configurations
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

			{tab === "Account" && (
				<div className="flex flex-col gap-6">
					<ProfileForm />
					<ChangePasswordForm />
				</div>
			)}

			{tab === "Municipality" && <MunicipalityInformationForm />}

			
            
		</div>
	);
}

export default SuperAdminSettingsPage;
