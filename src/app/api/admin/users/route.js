import User from "@/models/user";

import {
  requireAdminOrManager,
} from "@/lib/requireAdminOrManager";


export const runtime = "nodejs";


export async function GET() {
  try {

    // Admin + Manager
    const auth =
      await requireAdminOrManager();


    if (!auth.success) {
      return Response.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }


    const users =
      await User.find()
        .select(
          "name mobile role staffVerified isActive createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


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
        })
      );


    return Response.json({
      success: true,

      currentUserRole:
        auth.user.role,

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