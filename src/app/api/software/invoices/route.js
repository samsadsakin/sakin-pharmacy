import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";


// ================= POST =================

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const invoice = await Invoice.create(data);

    return Response.json(
      {
        success: true,
        message: "Invoice saved successfully",
        invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice POST Error:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


// ================= GET =================

export async function GET() {
  try {
    await connectDB();

    const invoices =
      await Invoice.find()
        .sort({
          createdAt: -1,
        });

    return Response.json({
      success: true,
      invoices,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}