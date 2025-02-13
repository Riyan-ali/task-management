import db from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { data } = await req.json();
  const { firstName, lastName, email, password } = data;

  if (!firstName || !lastName || !email || !password) {
    return new NextResponse(
      JSON.stringify({
        message: "Please enter all required fields",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Email already exists",
          success: false,
        }),
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new NextResponse(
      JSON.stringify({
        message: "Registered successfully",
        success: true,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
