"use client";

import { useState } from "react";

const invoices = [
  {
    date: "2026-08-11",
    invoiceNo: "9957",
    customer: "Rahim",
    info: "Regular Customer",
    paid: 490,

    medicines: [
      {
        name: "N/s 2L",
        qty: 2,
        rate: 117,
        discount: 0,
        total: 234,
      },
    ],
  },

  {
    date: "2026-08-11",
    invoiceNo: "9958",
    customer: "",
    info: "",
    paid: 600,

    medicines: [
      {
        name: "Nintoin sr",
        qty: 14,
        rate: 23,
        discount: 0,
        total: 322,
      },
      {
        name: "Lyric 50mg",
        qty: 20,
        rate: 15,
        discount: 0,
        total: 300,
      },
    ],
  },

  {
    date: "2026-08-11",
    invoiceNo: "9960",
    customer: "Kamal",
    info: "017XXXXXXXX",
    paid: 980,

    medicines: [
      {
        name: "Bizoran 5/20mg",
        qty: 15,
        rate: 12,
        discount: 0,
        total: 180,
      },
      {
        name: "EMISTAT 8 TABLET",
        qty: 10,
        rate: 12,
        discount: 0,
        total: 120,
      },
      {
        name: "Paloxi 5",
        qty: 5,
        rate: 20,
        discount: 0,
        total: 100,
      },
      {
        name: "Roxim 200mg",
        qty: 6,
        rate: 40,
        discount: 0,
        total: 240,
      },
    ],
  },
];

export default function ViewInvoicePage() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm">

        {/* Title */}
        <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">
          View Invoice
        </h1>

        {/* Main Table */}
        <div className="overflow-x-auto rounded-xl ring-1 ring-slate-100">

          <table className="w-full text-sm">

            <thead className="bg-sky-50 text-slate-700">
              <tr>
                <Th>Invoice Date</Th>
                <Th>Inv No</Th>
                <Th className="text-right">Paid Amt</Th>
                <Th className="text-center">Medicine</Th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.invoiceNo}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <Td>
                    {invoice.date}
                  </Td>

                  <Td className="font-semibold text-sky-700">
                    {invoice.invoiceNo}
                  </Td>

                  <Td className="text-right font-medium">
                    {money(invoice.paid)}
                  </Td>

                  <Td className="text-center">

                    <button
                      type="button"
                      onClick={() =>
                        setSelected(invoice)
                      }
                      className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
                    >
                      View ({invoice.medicines.length})
                    </button>

                  </Td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>


      {/* Popup */}
      {selected && (
        <MedicineModal
          invoice={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}


/* =========================
   MEDICINE POPUP
========================= */

function MedicineModal({
  invoice,
  onClose,
}) {
  const total = invoice.medicines.reduce(
    (sum, medicine) =>
      sum + medicine.total,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        {/* Popup Header */}
        <div className="flex items-center justify-between px-5 py-4">

          <div>
            <h2 className="font-semibold text-sky-700">
              Invoice #{invoice.invoiceNo}
            </h2>

            <p className="text-xs text-slate-400">
              {invoice.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>

        </div>


        {/* Customer Information */}
        <div className="mx-5 mb-4 space-y-3">

          <InfoField
            label="Name"
            value={
              invoice.customer || "N/A"
            }
          />

          <InfoField
            label="More Info"
            value={
              invoice.info || "N/A"
            }
          />

        </div>


        {/* Medicines */}
        <div className="overflow-x-auto px-5">

          <table className="w-full text-sm">

            <thead className="bg-sky-50 text-slate-600">
              <tr>
                <Th>Medicine</Th>
                <Th className="text-center">
                  Qty
                </Th>
                <Th className="text-right">
                  Rate
                </Th>
                <Th className="text-right">
                  Dis %
                </Th>
                <Th className="text-right">
                  Total
                </Th>
              </tr>
            </thead>

            <tbody>
              {invoice.medicines.map(
                (medicine, index) => (

                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <Td className="font-medium text-slate-700">
                      {medicine.name}
                    </Td>

                    <Td className="text-center">
                      {medicine.qty}
                    </Td>

                    <Td className="text-right">
                      {money(medicine.rate)}
                    </Td>

                    <Td className="text-right">
                      {medicine.discount || 0}%
                    </Td>

                    <Td className="text-right font-semibold text-sky-700">
                      {money(medicine.total)}
                    </Td>

                  </tr>

                )
              )}
            </tbody>

          </table>

        </div>


        {/* Popup Footer */}
        <div className="flex items-center justify-between px-5 py-4">

          <span className="text-sm text-slate-500">
            {invoice.medicines.length} Medicine(s)
          </span>

          <span className="text-sm font-semibold text-slate-700">
            Total: {money(total)}
          </span>

        </div>

      </div>
    </div>
  );
}


/* =========================
   INFO FIELD
========================= */

function InfoField({
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="w-24 shrink-0 text-sm font-medium text-slate-600">
        {label}
      </span>

      <div className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200">
        {value}
      </div>

    </div>
  );
}


/* =========================
   TABLE
========================= */

function Th({
  children,
  className = "",
}) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold ${className}`}
    >
      {children}
    </th>
  );
}


function Td({
  children,
  className = "",
}) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-slate-600 ${className}`}
    >
      {children}
    </td>
  );
}


/* =========================
   MONEY
========================= */

function money(value) {
  return Number(value || 0).toFixed(2);
}