import { cookies } from "next/headers";


export async function POST() {
  try {
    const cookieStore =
      await cookies();


    cookieStore.delete(
      "customer_session"
    );


    return Response.json({
      success: true,
      message:
        "Logged out successfully",
    });


  } catch (error) {

    console.error(
      "Logout Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to logout",
      },
      {
        status: 500,
      }
    );

  }
}