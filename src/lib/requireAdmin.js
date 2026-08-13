import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/auth";
import User from "@/models/User";


// =========================
// REQUIRE ADMIN
// =========================

export async function requireAdmin() {
  try {
    // =========================
    // GET SESSION COOKIE
    // =========================

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


    // =========================
    // VERIFY TOKEN
    // =========================

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


    // =========================
    // CONNECT DATABASE
    // =========================

    await connectDB();


    // =========================
    // GET FRESH USER
    // =========================

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


    // =========================
    // ACTIVE CHECK
    // =========================

    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Account is disabled",
      };
    }


    // =========================
    // ADMIN CHECK
    // =========================

    if (
      user.role !== "admin"
    ) {
      return {
        success: false,
        status: 403,
        message:
          "Admin access required",
      };
    }


    // =========================
    // SUCCESS
    // =========================

    return {
      success: true,
      user,
    };


  } catch (error) {
    console.error(
      "Require Admin Error:",
      error
    );


    return {
      success: false,
      status: 500,
      message:
        error?.message ||
        "Admin verification failed",
    };
  }
}