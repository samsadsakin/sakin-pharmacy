"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function PrintInvoicePage() {
  const params = useParams();
  const id = params?.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // GET INVOICE
  // =========================

  useEffect(() => {
    if (!id) return;

    const getInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/software/invoices/${id}`
        );

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message || "Invoice not found"
          );
          return;
        }

        setInvoice(data.invoice);

      } catch (error) {
        console.error(
          "Get Invoice Error:",
          error
        );

        setError(
          "Failed to load invoice"
        );

      } finally {
        setLoading(false);
      }
    };

    getInvoice();

  }, [id]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading invoice...
      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="py-20 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }


  if (!invoice) {
    return null;
  }


  return (
    <>

      {/* =========================
          PRINT CSS
      ========================= */}

      <style jsx global>{`
        @media print {

          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          #print-memo,
          #print-memo * {
            visibility: visible !important;
          }

          #print-memo {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;

            width: 100% !important;
            max-width: none !important;

            margin: 0 !important;
            padding: 0 !important;

            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          html,
          body {
            background: white !important;
          }
        }
      `}</style>


      {/* =========================
          PAGE
      ========================= */}

      <main className="min-h-screen bg-slate-100 p-4 sm:p-5">


        {/* Print Button */}
        <div className="no-print mx-auto mb-3 flex max-w-4xl justify-end">

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-sky-700 px-5 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Print Invoice
          </button>

        </div>


        {/* =========================
            ONLY THIS WILL PRINT
        ========================= */}

        <div
          id="print-memo"
          className="mx-auto max-w-4xl rounded-xl bg-white p-5 text-slate-900 shadow-sm sm:p-6"
        >


          {/* =========================
              HEADER
          ========================= */}

          <div className="text-center">

            <h1 className="text-2xl font-bold text-sky-700">
              SAKIN PHARMACY
            </h1>

          </div>


          {/* =========================
              INVOICE INFO
          ========================= */}

          <div className="mt-5 flex items-center justify-between text-sm">

            <p>
              <span className="text-slate-500">
                Invoice No:
              </span>{" "}

              <span className="font-bold text-slate-800">
                {invoice.invoiceNo}
              </span>
            </p>


            <p>
              <span className="text-slate-500">
                Date:
              </span>{" "}

              <span className="font-semibold">
                {formatDate(invoice.date)}
              </span>
            </p>

          </div>


          {/* =========================
              CUSTOMER
          ========================= */}

          <div className="mt-5 space-y-2 text-sm">

            <p>
              <span className="font-semibold">
                Customer:
              </span>{" "}

              {invoice.customer?.name ||
                "Retail Customer"}
            </p>


            <p>
              <span className="font-semibold">
                Phone:
              </span>{" "}

              {invoice.customer?.phone ||
                "N/A"}
            </p>

          </div>


          {/* =========================
              MEDICINES
          ========================= */}

          <div className="mt-6 overflow-x-auto">

            <table className="w-full border-collapse text-sm">

              <thead className="bg-sky-50">

                <tr>

                  <Th>
                    SL
                  </Th>

                  <Th>
                    Medicine
                  </Th>

                  <Th>
                    Qty
                  </Th>

                  <Th>
                    Rate
                  </Th>

                  <Th>
                    Dis %
                  </Th>

                  <Th>
                    Amount
                  </Th>

                </tr>

              </thead>


              <tbody>

                {invoice.medicines?.map(
                  (medicine, index) => (

                    <tr key={index}>

                      <Td>
                        {index + 1}
                      </Td>


                      <Td>
                        {medicine.medicine}
                      </Td>


                      <Td>
                        {medicine.qty}
                      </Td>


                      <Td>
                        {money(
                          medicine.rate
                        )}
                      </Td>


                      <Td>
                        {medicine.percentageDiscount || 0}%
                      </Td>


                      <Td>
                        {money(
                          medicine.amount
                        )}
                      </Td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* =========================
              CALCULATION
          ========================= */}

          <div className="ml-auto mt-6 w-full max-w-sm">

            <AmountRow
              label="Total"
              value={invoice.total}
            />


            <AmountRow
              label="Discount"
              value={invoice.discount}
            />


            <AmountRow
              label="Payable Amount"
              value={invoice.payableAmount}
              bold
            />

          </div>


          {/* =========================
              FOOTER
          ========================= */}

          <div className="mt-12 flex items-end justify-between text-xs">

            <div className="w-40 border-t border-slate-500 pt-1 text-center">
              Customer Signature
            </div>


            <div className="w-40 border-t border-slate-500 pt-1 text-center">
              Seller Signature
            </div>

          </div>


          <p className="mt-7 text-center text-xs text-slate-500">
            Thank you for purchasing from Sakin Pharmacy.
          </p>


        </div>

      </main>

    </>
  );
}


/* =========================
   TABLE HEAD
========================= */

function Th({ children }) {
  return (
    <th className="border border-slate-300 px-3 py-2 text-center text-xs font-semibold">
      {children}
    </th>
  );
}


/* =========================
   TABLE DATA
========================= */

function Td({ children }) {
  return (
    <td className="border border-slate-300 px-3 py-2 text-center text-sm">
      {children}
    </td>
  );
}


/* =========================
   AMOUNT ROW
========================= */

function AmountRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div
      className={`flex items-center justify-between border-b border-slate-200 py-2 text-sm ${
        bold
          ? "font-bold text-sky-700"
          : ""
      }`}
    >

      <span>
        {label}
      </span>

      <span>
        {money(value)}
      </span>

    </div>
  );
}


/* =========================
   MONEY
========================= */

function money(value) {
  return Number(
    value || 0
  ).toFixed(2);
}


/* =========================
   DATE
========================= */

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString("en-GB");
}