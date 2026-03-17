import { NextResponse } from "next/server";
import BnsAdmin from "@/model/BnsAdmin";
import connectToDatabase from "@/lib/mongoose";
import bcrypt from "bcrypt";

/* REGUSTER USER */
export async function POST(request) {
	connectToDatabase();

	const body = await request.json();

	const {
		fullName,
		email,
		number,
		municipality,
		position,
		type,
		password,
		province,
	} = body;

	if (!fullName || !email || !number) {
		return NextResponse.json(
			{ message: "All Fields are Mandatory!" },
			{ status: 400 }
		);
	}

	const duplicate = await BnsAdmin.findOne({ email }).maxTimeMS(30000);

	if (duplicate) {
		return NextResponse.json(
			{ message: "Email already Taken" },
			{ status: 401 }
		);
	}

	const hashedPass = await bcrypt.hash(password, 10);

	const user = await BnsAdmin.create({
		fullName,
		email,
		number,
		municipality,
		position,
		type,
		password: hashedPass,
		province,
		approve: true,
	});

	if (user) {
		return NextResponse.json(user, { status: 201 });
	} else {
		return NextResponse.json({ message: "Invalid Register" });
	}
}

/* UDDATE USER */
export async function PUT(request) {
	await connectToDatabase();

	const body = await request.json();

	const { fullName, email, number, barangay, imgUrl, bio, id } = body;

	if (!fullName || !email || !number) {
		return NextResponse.json(
			{ message: "All Fields are Mandatory!" },
			{ status: 400 }
		);
	}

	const user = await BnsAdmin.findById({ _id: id }).exec();

	if (user) {
		user.fullName = fullName;
		user.email = email;
		user.number = number;
		user.barangay = barangay;
		user.imgUrl = imgUrl;
		user.bio = bio;
	}

	const updatedUser = await user.save();

	if (updatedUser) {
		return NextResponse.json(
			{ message: `User ${user.fullName} Updated !` },
			{ status: 201 }
		);
	} else {
		return NextResponse.json({ message: "Invalid Update" });
	}
}
