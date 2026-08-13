import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/auth";
import User from "@/models/user";


export async function requireAdminOrManager() {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "customer_session"
      )?.value;


    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Please login first",
      };
    }


    const session =
      await verifySessionToken(
        token
      );


    if (!session?.userId) {
      return {
        success: false,
        status: 401,
        message: "Invalid session",
      };
    }


    await connectDB();


    const user =
      await User.findById(
        session.userId
      )
        .select(
          "name mobile role isActive"
        )
        .lean();


    if (!user) {
      return {
        success: false,
        status: 401,
        message: "User not found",
      };
    }


    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Account is disabled",
      };
    }


    const allowed =
      [
        "admin",
        "manager",
      ].includes(
        user.role
      );


    if (!allowed) {
      return {
        success: false,
        status: 403,
        message:
          "Admin or Manager access required",
      };
    }


    return {
      success: true,
      user,
    };


  } catch (error) {
    console.error(
      "Admin/Manager Check Error:",
      error
    );


    return {
      success: false,
      status: 500,
      message:
        error?.message ||
        "Permission check failed",
    };
  }
}