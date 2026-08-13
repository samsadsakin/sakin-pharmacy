import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";

import {
  createSessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";


// =========================
// STAFF / ADMIN LOGIN
// =========================

export async function POST(request) {
  try {
    await connectDB();


    // =========================
    // REQUEST DATA
    // =========================

    const data =
      await request.json();


    const mobile =
      normalizeMobile(
        data.mobile
      );


    const name =
      data.name?.trim();


    const password =
      String(
        data.password || ""
      ).trim();


    // =========================
    // VALIDATION
    // =========================

    if (!mobile) {
      return Response.json(
        {
          success: false,
          message:
            "Valid mobile number is required",
        },
        {
          status: 400,
        }
      );
    }


    if (!password) {
      return Response.json(
        {
          success: false,
          message:
            "Password is required",
        },
        {
          status: 400,
        }
      );
    }


    // =========================
    // FIND USER
    // =========================

    const user =
      await User.findOne({
        mobile,
      });


    if (!user) {
      return Response.json(
        {
          success: false,
          message:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }


    // =========================
    // ACTIVE CHECK
    // =========================

    if (!user.isActive) {
      return Response.json(
        {
          success: false,
          message:
            "This account is disabled",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // CUSTOMER CANNOT USE
    // STAFF PASSWORD LOGIN
    // =========================

    if (
      user.role ===
      "customer"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Please continue as a customer",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // PASSWORD NOT SET
    // =========================

    if (
      !user.passwordHash
    ) {
      return Response.json(
        {
          success: false,

          action:
            "PASSWORD_NOT_SET",

          message:
            "Password is not set for this account",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // CHECK PASSWORD
    // =========================

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.passwordHash
      );


    if (!passwordCorrect) {
      return Response.json(
        {
          success: false,
          message:
            "Incorrect password",
        },
        {
          status: 401,
        }
      );
    }


    // =========================
    // UPDATE NAME
    // AFTER PASSWORD VERIFIED
    // =========================

    if (
      name &&
      name !== user.name
    ) {
      user.name = name;

      await user.save();
    }


    // =========================
    // CREATE SESSION
    // =========================

    const token =
      await createSessionToken(
        user
      );


    const cookieStore =
      await cookies();


    cookieStore.set(
      "customer_session",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 *
          60 *
          24 *
          7,
      }
    );


    // =========================
    // SUCCESS
    // =========================

    return Response.json({
      success: true,

      message:
        "Login successful",

      user: {
        id:
          user._id.toString(),

        name:
          user.name,

        mobile:
          user.mobile,

        role:
          user.role,
      },
    });


  } catch (error) {
    console.error(
      "Staff Login Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to login",
      },
      {
        status: 500,
      }
    );
  }
}


// =========================
// NORMALIZE MOBILE
// =========================

function normalizeMobile(
  value
) {
  if (!value) {
    return null;
  }


  const mobile =
    String(value).replace(
      /\D/g,
      ""
    );


  if (
    mobile.length === 11 &&
    mobile.startsWith("01")
  ) {
    return mobile;
  }


  if (
    mobile.length === 13 &&
    mobile.startsWith("8801")
  ) {
    return mobile.slice(2);
  }


  return null;
}