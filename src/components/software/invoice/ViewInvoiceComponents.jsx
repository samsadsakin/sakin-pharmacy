"use client";


// =========================
// ACTION BUTTONS
// =========================

export function ActionButtons({
  invoice,
  onView,
  onUpdate,
  onDelete,
  onPrint,
}) {
  return (
    <div className="flex items-center justify-center gap-2">

      <button
        type="button"
        onClick={() => onView(invoice)}
        className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
      >
        View
      </button>

      <button
        type="button"
        onClick={() => onUpdate(invoice)}
        className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
      >
        Update
      </button>

      <button
        type="button"
        onClick={() => onDelete(invoice)}
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
      >
        Delete
      </button>

      <button
        type="button"
        onClick={() => onPrint(invoice)}
        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
      >
        Print
      </button>

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

      <div className="max-h-screen w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">


        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">

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
            className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>

        </div>


        {/* Customer Information */}
        <div className="mx-5 mb-4 space-y-3">

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


        {/* Medicine Table */}
        <div className="overflow-x-auto px-5">

          <table className="w-full text-sm">

            <thead className="bg-sky-50 text-slate-600">

              <tr>
                <Th>
                  Medicine
                </Th>

                <Th className="text-center">
                  Qty
                </Th>

                <Th className="text-center">
                  Rate
                </Th>

                <Th className="text-center">
                  Dis %
                </Th>

                <Th className="text-center">
                  Amount
                </Th>
              </tr>

            </thead>


            <tbody>

              {invoice.medicines?.map(
                (medicine, index) => (

                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <Td className="font-medium text-slate-700">
                      {medicine.medicine}
                    </Td>

                    <Td className="text-center">
                      {medicine.qty}
                    </Td>

                    <Td className="text-center">
                      {money(medicine.rate)}
                    </Td>

                    <Td className="text-center">
                      {medicine.percentageDiscount || 0}%
                    </Td>

                    <Td className="text-center font-semibold text-sky-700">
                      {money(medicine.amount)}
                    </Td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>


        {/* Calculation */}
        <div className="mx-5 mt-4 rounded-xl bg-slate-50 p-4">

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
        <div className="flex items-center justify-between px-5 py-4">

          <span className="text-sm text-slate-500">
            {invoice.medicines?.length || 0} Medicine(s)
          </span>

          <span className="text-sm font-semibold text-slate-700">
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
      className={`whitespace-nowrap px-4 py-3 text-center text-xs font-semibold ${className}`}
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
      className={`whitespace-nowrap px-4 py-3 text-slate-600 ${className}`}
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