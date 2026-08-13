import {
  randomInt,
} from "node:crypto";

import bcrypt from "bcryptjs";

import User from "@/models/user";

import {
  requireAdmin,
} from "@/lib/requireAdmin";

import {
  sendSMS,
} from "@/lib/sms";


export const runtime = "nodejs";


// =========================
// UPDATE ROLE
// =========================

export async function PATCH(
  request,
  { params }
) {
  try {

    // =========================
    // ADMIN CHECK
    // =========================

    const auth =
      await requireAdmin();


    if (!auth.success) {

      return Response.json(
        {
          success: false,
          message:
            auth.message,
        },
        {
          status:
            auth.status,
        }
      );

    }


    // =========================
    // USER ID
    // =========================

    const { id } =
      await params;


    // =========================
    // REQUEST BODY
    // =========================

    const data =
      await request.json();


    const newRole =
      data.role;


    // =========================
    // VALID ROLE
    // =========================

    const allowedRoles = [
      "customer",
      "salesman",
      "manager",
    ];


    if (
      !allowedRoles.includes(
        newRole
      )
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid role",
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
      await User.findById(
        id
      );


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
    // PROTECT ADMIN
    // =========================

    if (
      user.role === "admin"
    ) {

      return Response.json(
        {
          success: false,
          message:
            "Admin role cannot be changed",
        },
        {
          status: 403,
        }
      );

    }


    // =========================
    // SAME ROLE
    // =========================

    if (
      user.role === newRole
    ) {

      return Response.json(
        {
          success: false,
          message:
            "User already has this role",
        },
        {
          status: 400,
        }
      );

    }


    const oldRole =
      user.role;


    let passwordGenerated =
      false;

    let passwordSent =
      false;

    let generatedPassword =
      null;

    let smsError =
      null;


    // =================================
    // CUSTOMER → SALESMAN / MANAGER
    // GENERATE PASSWORD
    // =================================

    if (
      oldRole === "customer" &&
      (
        newRole === "salesman" ||
        newRole === "manager"
      )
    ) {

      // 1000 - 9999
      generatedPassword =
        randomInt(
          1000,
          10000
        ).toString();


      // Hash password
      const passwordHash =
        await bcrypt.hash(
          generatedPassword,
          10
        );


      user.role =
        newRole;

      user.passwordHash =
        passwordHash;

      // OTP আর নেই
      user.staffVerified =
        true;


      await user.save();


      passwordGenerated =
        true;


      // =========================
      // SEND PASSWORD SMS
      // =========================

      try {

        await sendSMS({

          mobile:
            user.mobile,

          message:
            `Your password for Sakin Pharmacy is: ${generatedPassword}`,

        });


        passwordSent =
          true;


      } catch (error) {

        console.error(
          "Password SMS Error:",
          error
        );


        smsError =
          error?.message ||
          "SMS failed";

      }


      return Response.json({

        success: true,

        message:
          passwordSent
            ? "Role updated and password sent successfully"
            : "Role updated but password SMS failed",

        passwordGenerated,

        passwordSent,

        // SMS fail হলে Admin-কে password দেখানো হবে
        ...(passwordSent
          ? {}
          : {
              temporaryPassword:
                generatedPassword,
            }),

        smsError,

        user: {

          id:
            user._id.toString(),

          name:
            user.name,

          mobile:
            user.mobile,

          role:
            user.role,

          staffVerified:
            user.staffVerified,

          isActive:
            user.isActive,

        },

      });

    }


    // =================================
    // STAFF → CUSTOMER
    // REMOVE PASSWORD
    // =================================

    if (
      newRole === "customer"
    ) {

      user.role =
        "customer";

      user.passwordHash =
        null;

      user.staffVerified =
        false;


      await user.save();


      return Response.json({

        success: true,

        message:
          "User changed to customer",

        passwordGenerated:
          false,

        passwordSent:
          false,

        user: {

          id:
            user._id.toString(),

          name:
            user.name,

          mobile:
            user.mobile,

          role:
            user.role,

          staffVerified:
            user.staffVerified,

          isActive:
            user.isActive,

        },

      });

    }


    // =================================
    // SALESMAN ↔ MANAGER
    // KEEP EXISTING PASSWORD
    // =================================

    user.role =
      newRole;


    await user.save();


    return Response.json({

      success: true,

      message:
        "User role updated successfully",

      passwordGenerated:
        false,

      passwordSent:
        false,

      user: {

        id:
          user._id.toString(),

        name:
          user.name,

        mobile:
          user.mobile,

        role:
          user.role,

        staffVerified:
          user.staffVerified,

        isActive:
          user.isActive,

      },

    });


  } catch (error) {

    console.error(
      "Update Role Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to update user role",
      },
      {
        status: 500,
      }
    );

  }
}