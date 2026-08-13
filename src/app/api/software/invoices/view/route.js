import connectDB from "@/lib/mongodb";


export const runtime = "nodejs";


// =========================
// GET INVOICES
// SERVER SIDE FILTER +
// SERVER SIDE PAGINATION
// =========================

export async function GET(request) {

  try {

    const mongoose =
      await connectDB();


    const { searchParams } =
      new URL(request.url);


    // =========================
    // QUERY PARAMS
    // =========================

    const invoiceNo =
      String(
        searchParams.get(
          "invoiceNo"
        ) || ""
      ).trim();


    const fromDate =
      String(
        searchParams.get(
          "from"
        ) || ""
      ).trim();


    const toDate =
      String(
        searchParams.get(
          "to"
        ) || ""
      ).trim();


    const requestedPage =
      Number(
        searchParams.get(
          "page"
        )
      );


    const requestedLimit =
      Number(
        searchParams.get(
          "limit"
        )
      );


    const page =
      Number.isFinite(
        requestedPage
      ) &&
      requestedPage > 0
        ? Math.floor(
            requestedPage
          )
        : 1;


    // Maximum 100
    // Frontend uses 50

    const limit =
      Number.isFinite(
        requestedLimit
      ) &&
      requestedLimit > 0
        ? Math.min(
            Math.floor(
              requestedLimit
            ),
            100
          )
        : 50;


    // =========================
    // MONGODB FILTER
    // =========================

    const query = {};


    // =========================
    // INVOICE NUMBER SEARCH
    //
    // Invoice number দিলে
    // date filter ignore করবে.
    // =========================

    if (invoiceNo) {

      query.invoiceNo =
        invoiceNo;

    } else {


      // =========================
      // DATE RANGE
      // =========================

      if (
        fromDate ||
        toDate
      ) {

        query.date = {};


        // FROM DATE

        if (fromDate) {

          const startDate =
            makeStartDate(
              fromDate
            );


          if (!startDate) {

            return Response.json(
              {
                success: false,
                message:
                  "Invalid From Date",
              },
              {
                status: 400,
              }
            );

          }


          query.date.$gte =
            startDate;

        }


        // TO DATE

        if (toDate) {

          const endDate =
            makeNextDate(
              toDate
            );


          if (!endDate) {

            return Response.json(
              {
                success: false,
                message:
                  "Invalid To Date",
              },
              {
                status: 400,
              }
            );

          }


          // Less than next day
          // means entire selected day

          query.date.$lt =
            endDate;

        }


        // =========================
        // FROM > TO CHECK
        // =========================

        if (
          fromDate &&
          toDate
        ) {

          const startDate =
            makeStartDate(
              fromDate
            );


          const endDate =
            makeStartDate(
              toDate
            );


          if (
            startDate >
            endDate
          ) {

            return Response.json(
              {
                success: false,

                message:
                  "From Date cannot be after To Date",
              },
              {
                status: 400,
              }
            );

          }

        }

      }

    }


    // =========================
    // COLLECTION
    // =========================

    const invoicesCollection =
      mongoose.connection.collection(
        "invoices"
      );


    // =========================
    // TOTAL MATCHING
    // =========================

    const total =
      await invoicesCollection
        .countDocuments(
          query
        );


    const totalPages =
      Math.max(
        1,
        Math.ceil(
          total / limit
        )
      );


    // =========================
    // SKIP
    // =========================

    const skip =
      (page - 1) *
      limit;


    // =========================
    // GET ONLY CURRENT 50
    // =========================

    const invoices =
      await invoicesCollection
        .find(
          query,
          {
            projection: {

              invoiceNo: 1,

              date: 1,

              customer: 1,

              medicines: 1,

              total: 1,

              discount: 1,

              payableAmount: 1,

              options: 1,

              createdAt: 1,

              updatedAt: 1,

            },
          }
        )
        .sort({
          date: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limit)
        .toArray();


    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      success: true,


      invoices:
        invoices.map(
          (invoice) => ({

            ...invoice,

            _id:
              invoice._id
                .toString(),

          })
        ),


      pagination: {

        page,

        limit,

        total,

        totalPages,

      },

    });


  } catch (error) {

    console.error(
      "Get Invoice Error:",
      error
    );


    return Response.json(
      {
        success: false,

        message:
          "Failed to load invoices",
      },
      {
        status: 500,
      }
    );

  }

}


// =========================
// START OF SELECTED DATE
// =========================

function makeStartDate(
  value
) {

  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(value)
  ) {

    return null;

  }


  const date =
    new Date(
      `${value}T00:00:00.000Z`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date;

}


// =========================
// NEXT DAY
// Used for inclusive To Date
// =========================

function makeNextDate(
  value
) {

  const date =
    makeStartDate(
      value
    );


  if (!date) {
    return null;
  }


  date.setUTCDate(
    date.getUTCDate() + 1
  );


  return date;

}