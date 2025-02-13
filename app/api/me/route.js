import db from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(
      JSON.stringify({
        message: "User not authenticated",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    const user = await User.findById(id);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    await db.disconnectDb();
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
