import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";

import {
  verifySessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";


// =========================
// GET CURRENT USER
// =========================

export async function GET() {
  try {

    // =========================
    // GET COOKIE
    // =========================

    const cookieStore =
      await cookies();


    const token =
      cookieStore.get(
        "customer_session"
      )?.value;


    // =========================
    // NOT LOGGED IN
    // =========================

    if (!token) {

      return Response.json(
        {
          success: false,
          loggedIn: false,
          user: null,
        },
        {
          status: 401,
        }
      );

    }


    // =========================
    // VERIFY TOKEN
    // =========================

    const session =
      await verifySessionToken(
        token
      );


    if (!session?.userId) {

      return Response.json(
        {
          success: false,
          loggedIn: false,
          user: null,
        },
        {
          status: 401,
        }
      );

    }


    // =========================
    // CONNECT MONGODB
    // =========================

    await connectDB();


    // =========================
    // GET FRESH USER DATA
    // =========================

    const user =
      await User.findById(
        session.userId
      )
        .select(
          "name mobile role staffVerified isActive"
        )
        .lean();


    // =========================
    // USER NOT FOUND
    // =========================

    if (!user) {

      return Response.json(
        {
          success: false,
          loggedIn: false,
          user: null,
        },
        {
          status: 401,
        }
      );

    }


    // =========================
    // ACCOUNT DISABLED
    // =========================

    if (!user.isActive) {

      return Response.json(
        {
          success: false,
          loggedIn: false,

          message:
            "This account is disabled",

          user: null,
        },
        {
          status: 403,
        }
      );

    }


    // =========================
    // SUCCESS
    // =========================

    return Response.json({
      success: true,

      loggedIn: true,

      user: {
        id:
          user._id,

        name:
          user.name,

        mobile:
          user.mobile,

        role:
          user.role,

        staffVerified:
          user.staffVerified,
      },
    });


  } catch (error) {

    console.error(
      "Current User Error:",
      error
    );


    return Response.json(
      {
        success: false,

        loggedIn: false,

        message:
          error?.message ||
          "Failed to get user",

        user: null,
      },
      {
        status: 500,
      }
    );

  }
}