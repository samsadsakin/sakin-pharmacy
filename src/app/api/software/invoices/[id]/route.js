import connectDB from "@/lib/mongodb";
import Invoice from "@/models/invoice";


// ================= GET ONE =================

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return Response.json(
        {
          success: false,
          message: "Invoice not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      invoice,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


// ================= DELETE =================

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const invoice =
      await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return Response.json(
        {
          success: false,
          message: "Invoice not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Invoice deleted successfully",
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}