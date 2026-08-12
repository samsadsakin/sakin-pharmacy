"use client";
import Link from "next/link";


// =========================
// ACTION BUTTONS
// =========================

export function ActionButtons({
  invoice,
  onView,
  onUpdate,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-center gap-2">

      {/* View */}
      <button
        type="button"
        onClick={() => onView(invoice)}
        className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
      >
        View
      </button>


      {/* Update */}
      <button
        type="button"
        onClick={() => onUpdate(invoice)}
        className="hidden rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 md:block"
      >
        Update
      </button>


      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(invoice)}
        className="hidden rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 md:block"
      >
        Delete
      </button>


      {/* Print */}
      <Link
        href={`/software/Invoice/PrintInvoice/${invoice._id}`}
        className="hidden rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 md:block"
      >
        Print
      </Link>

    </div>
  );
}

// =========================
// MEDICINE MODAL
// =========================

export function MedicineModal({
  invoice,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">

      <div className="max-h-screen w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">


        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-5">

          <div>
            <h2 className="font-semibold text-sky-700">
              Invoice #{invoice.invoiceNo}
            </h2>

            <p className="text-xs text-slate-400">
              {formatDate(invoice.date)}
            </p>
          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>

        </div>


        {/* Customer */}
        <div className="mx-4 mb-4 space-y-2 sm:mx-5 sm:space-y-3">

          <InfoField
            label="Name"
            value={invoice.customer?.name || "N/A"}
          />

          <InfoField
            label="More Info"
            value={invoice.customer?.moreInfo || "N/A"}
          />

          <InfoField
            label="Phone"
            value={invoice.customer?.phone || "N/A"}
          />

        </div>


        {/* Medicines */}
        <div className="overflow-x-auto px-4 sm:px-5">

          <table className="w-full min-w-max text-sm">

            <thead className="bg-sky-50 text-slate-600">

              <tr>
                <Th>Medicine</Th>
                <Th>Qty</Th>
                <Th>Rate</Th>
                <Th>Dis %</Th>
                <Th>Amount</Th>
              </tr>

            </thead>


            <tbody>

              {invoice.medicines?.map(
                (medicine, index) => (

                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <Td className="font-medium">
                      {medicine.medicine}
                    </Td>

                    <Td>
                      {medicine.qty}
                    </Td>

                    <Td>
                      {money(medicine.rate)}
                    </Td>

                    <Td>
                      {medicine.percentageDiscount || 0}%
                    </Td>

                    <Td className="font-semibold text-sky-700">
                      {money(medicine.amount)}
                    </Td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>


        {/* Calculation */}
        <div className="mx-4 mt-4 rounded-xl bg-slate-50 p-4 sm:mx-5">

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


        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-5">

          <span className="text-xs text-slate-500 sm:text-sm">
            {invoice.medicines?.length || 0} Medicine(s)
          </span>

          <span className="text-xs font-semibold text-slate-700 sm:text-sm">
            Paid: {money(invoice.payableAmount)}
          </span>

        </div>

      </div>
    </div>
  );
}


// =========================
// INFO FIELD
// =========================

function InfoField({
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">

      <span className="w-20 shrink-0 text-xs font-medium text-slate-600 sm:w-24 sm:text-sm">
        {label}
      </span>

      <div className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-200 sm:text-sm">
        {value}
      </div>

    </div>
  );
}


// =========================
// AMOUNT ROW
// =========================

function AmountRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div className="flex items-center justify-between py-1.5">

      <span
        className={
          bold
            ? "text-sm font-semibold text-slate-700"
            : "text-sm text-slate-500"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "text-sm font-semibold text-sky-700"
            : "text-sm text-slate-700"
        }
      >
        {money(value)}
      </span>

    </div>
  );
}


// =========================
// TABLE
// =========================

export function Th({
  children,
  className = "",
}) {
  return (
    <th
      className={`whitespace-nowrap px-2 py-3 text-center text-xs font-semibold sm:px-4 ${className}`}
    >
      {children}
    </th>
  );
}


export function Td({
  children,
  className = "",
}) {
  return (
    <td
      className={`whitespace-nowrap px-2 py-3 text-center text-xs text-slate-600 sm:px-4 sm:text-sm ${className}`}
    >
      {children}
    </td>
  );
}


// =========================
// MONEY
// =========================

export function money(value) {
  return Number(value || 0).toFixed(2);
}


// =========================
// DATE
// =========================

export function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-CA");
}