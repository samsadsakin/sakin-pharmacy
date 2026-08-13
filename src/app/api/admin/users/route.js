import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import {
  requireAdmin,
} from "@/lib/requireAdmin";


export const runtime = "nodejs";


// =========================
// GET ALL USERS
// =========================

export async function GET() {
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
    // CONNECT DATABASE
    // =========================

    await connectDB();


    // =========================
    // GET USERS
    // =========================

    const users =
      await User.find()
        .select(
          "name mobile role staffVerified isActive createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    // =========================
    // CLEAN RESPONSE
    // =========================

    const formattedUsers =
      users.map(
        (user) => ({
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

          createdAt:
            user.createdAt,

          updatedAt:
            user.updatedAt,
        })
      );


    // =========================
    // SUCCESS
    // =========================

    return Response.json({
      success: true,
      users:
        formattedUsers,
    });


  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to load users",
      },
      {
        status: 500,
      }
    );
  }
}