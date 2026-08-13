import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { sendSMS } from "@/lib/sms";

export const runtime = "nodejs";


// =========================
// FORGOT PASSWORD
// =========================

export async function POST(request) {
  try {
    await connectDB();

    const data =
      await request.json();

    const mobile =
      normalizeMobile(
        data.mobile
      );


    // =========================
    // VALIDATE MOBILE
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
    // CUSTOMER HAS NO PASSWORD
    // =========================

    if (
      user.role === "customer"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Customer account does not require a password",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // GENERATE 4 DIGIT PASSWORD
    // =========================

    const newPassword =
      randomInt(
        1000,
        10000
      ).toString();


    // =========================
    // SEND SMS FIRST
    // =========================

    await sendSMS({
      mobile:
        user.mobile,

      message:
        `Your password for Sakin Pharmacy is: ${newPassword}`,
    });


    // =========================
    // HASH PASSWORD
    // =========================

    const passwordHash =
      await bcrypt.hash(
        newPassword,
        10
      );


    // =========================
    // SAVE NEW PASSWORD
    // =========================

    user.passwordHash =
      passwordHash;

    user.staffVerified =
      true;


    await user.save();


    // =========================
    // SUCCESS
    // =========================

    return Response.json({
      success: true,

      message:
        "A new password has been sent to your registered mobile number.",
    });


  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to reset password",
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

function normalizeMobile(value) {
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