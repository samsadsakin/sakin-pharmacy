import connectDB from "@/lib/mongodb";
import User from "@/models/user";


export const runtime = "nodejs";


// =========================
// GET USER BY MOBILE
// =========================

export async function GET(request) {
  try {
    await connectDB();


    // =========================
    // GET MOBILE FROM URL
    // =========================

    const { searchParams } =
      new URL(request.url);

    const mobile =
      normalizeMobile(
        searchParams.get("mobile")
      );


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


    // =========================
    // FIND USER
    // =========================

    const user =
      await User.findOne({
        mobile,
      })
        .select(
          "name mobile role staffVerified isActive"
        )
        .lean();


    // =========================
    // USER NOT FOUND
    // NEW CUSTOMER
    // =========================

    if (!user) {
      return Response.json({
        success: true,
        found: false,
      });
    }


    // =========================
    // DISABLED USER
    // =========================

    if (!user.isActive) {
      return Response.json(
        {
          success: false,
          found: true,
          message:
            "This account is disabled",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // USER FOUND
    // =========================

    return Response.json({
      success: true,
      found: true,

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
    });


  } catch (error) {
    console.error(
      "User By Mobile Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to find user",
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

function normalizeMobile(value) {
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