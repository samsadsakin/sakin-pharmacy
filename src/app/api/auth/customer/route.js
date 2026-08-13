import {
  cookies,
} from "next/headers";

import connectDB from "@/lib/mongodb";

import User from "@/models/user";

import {
  createSessionToken,
} from "@/lib/auth";


export const runtime = "nodejs";


// =========================
// CREATE / UPDATE / LOGIN
// CUSTOMER
// =========================

export async function POST(request) {
  try {

    await connectDB();


    // =========================
    // REQUEST DATA
    // =========================

    const data =
      await request.json();


    const name =
      data.name?.trim();


    const mobile =
      normalizeMobile(
        data.mobile
      );


    // =========================
    // VALIDATION
    // =========================

    if (!name) {

      return Response.json(
        {
          success: false,

          message:
            "Customer name is required",
        },
        {
          status: 400,
        }
      );

    }


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


    // =========================
    // FIND USER
    // =========================

    let user =
      await User.findOne({
        mobile,
      });


    let created = false;
    let updated = false;


    // =========================
    // NEW CUSTOMER
    // =========================

    if (!user) {

      user =
        await User.create({

          name,

          mobile,

          role:
            "customer",

          passwordHash:
            null,

          staffVerified:
            false,

          isActive:
            true,

        });


      created = true;

    }


    // =========================
    // ACCOUNT DISABLED
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
    // NOT CUSTOMER
    // =========================

    if (
      user.role !==
      "customer"
    ) {

      return Response.json(
        {
          success: false,

          action:
            user.staffVerified
              ? "PASSWORD_REQUIRED"
              : "OTP_REQUIRED",

          message:
            user.staffVerified
              ? "Password login is required"
              : "OTP verification is required",

          user: {

            name:
              user.name,

            mobile:
              user.mobile,

            role:
              user.role,

            staffVerified:
              user.staffVerified,

          },
        },
        {
          status: 403,
        }
      );

    }


    // =========================
    // EXISTING CUSTOMER
    // UPDATE NAME
    // =========================

    if (
      !created &&
      user.name !== name
    ) {

      user.name = name;

      await user.save();

      updated = true;

    }


    // =========================
    // CREATE SESSION TOKEN
    // =========================

    const token =
      await createSessionToken(
        user
      );


    // =========================
    // SET HTTPONLY COOKIE
    // =========================

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

        sameSite:
          "lax",

        path:
          "/",

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

    return Response.json(
      {
        success: true,

        created,

        updated,

        message:
          created
            ? "Customer created successfully"
            : updated
            ? "Customer updated successfully"
            : "Welcome back",

        user: {

          id:
            user._id,

          name:
            user.name,

          mobile:
            user.mobile,

          role:
            user.role,

        },
      },
      {
        status:
          created
            ? 201
            : 200,
      }
    );


  } catch (error) {

    console.error(
      "Customer API Error:",
      error
    );


    // =========================
    // DUPLICATE MOBILE
    // =========================

    if (
      error?.code === 11000
    ) {

      return Response.json(
        {
          success: false,

          message:
            "This mobile number already exists",
        },
        {
          status: 409,
        }
      );

    }


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to continue",
      },
      {
        status: 500,
      }
    );

  }
}


// =========================
// NORMALIZE BD MOBILE
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


  // 01712345678
  if (
    mobile.length === 11 &&
    mobile.startsWith("01")
  ) {

    return mobile;

  }


  // 8801712345678
  if (
    mobile.length === 13 &&
    mobile.startsWith("8801")
  ) {

    return mobile.slice(2);

  }


  return null;
}