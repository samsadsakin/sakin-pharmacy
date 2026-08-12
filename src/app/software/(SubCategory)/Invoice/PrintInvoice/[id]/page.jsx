"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Roboto_Condensed } from "next/font/google";


const receiptFont = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


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
            data.message ||
              "Invoice not found"
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
          POS PRINT CSS
      ========================= */}

      <style jsx global>{`

        @media print {

          @page {
            margin: 0;
          }


          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }


          body * {
            visibility: hidden !important;
          }


          #print-memo,
          #print-memo * {
            visibility: visible !important;
          }


          #print-memo {
            position: fixed !important;

            top: 0 !important;
            left: 0 !important;

            width: 80mm !important;
            max-width: 80mm !important;

            min-height: 0 !important;

            margin: 0 !important;

            padding: 3mm !important;

            box-sizing: border-box !important;

            background: white !important;

            color: #000 !important;

            box-shadow: none !important;

            border: none !important;
            border-radius: 0 !important;
          }


          #print-memo,
          #print-memo * {
            color: #000 !important;

            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }


          .no-print {
            display: none !important;
          }


          .receipt-table {
            width: 100% !important;

            table-layout: fixed !important;

            border-collapse: collapse !important;
          }


          .receipt-table th,
          .receipt-table td {
            border-color: #000 !important;
          }


          .receipt-table thead {
            background: white !important;
          }


          .receipt-table tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

        }

      `}</style>


      {/* =========================
          SCREEN
      ========================= */}

      <main
        className={`${receiptFont.className} min-h-screen bg-slate-100 py-5`}
      >


        {/* =========================
            PRINT BUTTON
        ========================= */}

        <div
          className="no-print mx-auto mb-3 flex justify-end"
          style={{
            width: "80mm",
          }}
        >

          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="rounded-lg bg-sky-700 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Print Invoice
          </button>

        </div>


        {/* =========================
            RECEIPT
        ========================= */}

        <div
          id="print-memo"
          className="mx-auto bg-white text-slate-950 shadow-sm"
          style={{
            width: "80mm",
            padding: "3mm",
            boxSizing: "border-box",
          }}
        >


          {/* =========================
              HEADER
          ========================= */}

          <header className="text-center">

            <h1 className="text-xl font-bold tracking-wide">
              SAKIN PHARMACY
            </h1>


            <p className="mt-0.5 text-xs font-semibold">
              SALES INVOICE
            </p>

          </header>


          {/* Divider */}

          <div className="my-2 border-t border-dashed border-slate-700" />


          {/* =========================
              INVOICE INFO
          ========================= */}

          <div className="space-y-1 text-xs">

            <InfoRow
              label="Invoice"
              value={`#${invoice.invoiceNo}`}
            />

            <InfoRow
              label="Date"
              value={formatDate(
                invoice.date
              )}
            />

          </div>


          {/* Divider */}

          <div className="my-2 border-t border-dashed border-slate-500" />


          {/* =========================
              CUSTOMER
          ========================= */}

          <div className="space-y-1 text-xs">

            <InfoRow
              label="Customer"
              value={
                invoice.customer?.name ||
                "Retail Customer"
              }
            />


            <InfoRow
              label="Phone"
              value={
                invoice.customer?.phone ||
                "-"
              }
            />

          </div>


          {/* =========================
              MEDICINE TABLE
          ========================= */}

          <div className="mt-3">

            <table className="receipt-table w-full border-collapse">

              <thead>

                <tr>

                  <Th className="w-6">
                    SL
                  </Th>

                  <Th align="left">
                    Medicine
                  </Th>

                  <Th className="w-8">
                    Qty
                  </Th>

                  <Th className="w-12">
                    Rate
                  </Th>

                  <Th className="w-9">
                    Dis
                  </Th>

                  <Th className="w-14">
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


                      <Td align="left">
                        {medicine.medicine}
                      </Td>


                      <Td>
                        {medicine.qty}
                      </Td>


                      <Td>
                        {compactMoney(
                          medicine.rate
                        )}
                      </Td>


                      <Td>
                        {Number(
                          medicine.percentageDiscount ||
                            0
                        )}
                        %
                      </Td>


                      <Td>
                        {compactMoney(
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

          <div className="mt-3 border-t border-dashed border-slate-700 pt-2">

            <AmountRow
              label="Total"
              value={invoice.total}
            />


            <AmountRow
              label="Discount"
              value={invoice.discount}
            />


            <div className="my-1 border-t border-slate-900" />


            <AmountRow
              label="PAYABLE"
              value={
                invoice.payableAmount
              }
              bold
            />

          </div>


          {/* =========================
              FOOTER
          ========================= */}

          <div className="mt-5">

            <div className="flex items-end justify-between gap-5 text-xs">

              <div className="flex-1 border-t border-slate-700 pt-1 text-center">
                Customer
              </div>


              <div className="flex-1 border-t border-slate-700 pt-1 text-center">
                Seller
              </div>

            </div>


            <div className="my-3 border-t border-dashed border-slate-500" />


            <p className="text-center text-xs font-semibold">
              Thank you for your purchase
            </p>


            <p className="mt-1 text-center text-xs">
              Sakin Pharmacy
            </p>

          </div>


        </div>

      </main>

    </>
  );
}


/* =========================
   INFO ROW
========================= */

function InfoRow({
  label,
  value,
}) {
  return (

    <div className="flex items-start justify-between gap-3">

      <span className="font-semibold">
        {label}:
      </span>


      <span className="text-right font-medium">
        {value}
      </span>

    </div>

  );
}


/* =========================
   TABLE HEAD
========================= */

function Th({
  children,
  align = "center",
  className = "",
}) {
  return (

    <th
      className={`border border-slate-700 px-1 py-1.5 text-xs font-bold leading-tight ${className}`}
      style={{
        textAlign: align,
      }}
    >
      {children}
    </th>

  );
}


/* =========================
   TABLE DATA
========================= */

function Td({
  children,
  align = "center",
}) {
  return (

    <td
      className="border border-slate-600 px-1 py-1.5 text-xs font-medium leading-tight"
      style={{
        textAlign: align,
        wordBreak: "break-word",
      }}
    >
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
      className={`flex items-center justify-between py-1 ${
        bold
          ? "text-sm font-bold"
          : "text-xs font-semibold"
      }`}
    >

      <span>
        {label}
      </span>


      <span
        style={{
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
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
   TABLE MONEY
========================= */

function compactMoney(value) {

  const number =
    Number(value || 0);


  if (
    Number.isInteger(number)
  ) {
    return number;
  }


  return number.toFixed(2);
}


/* =========================
   DATE
========================= */

function formatDate(date) {

  if (!date) {
    return "-";
  }


  return new Date(
    date
  ).toLocaleDateString(
    "en-GB"
  );
}