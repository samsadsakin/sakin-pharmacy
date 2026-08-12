"use client";

import { useEffect, useState } from "react";

import {
  ActionButtons,
  MedicineModal,
  Th,
  Td,
  money,
  formatDate,
} from "@/components/software/invoice/ViewInvoiceComponents";


export default function ViewInvoicePage() {

  const [invoices, setInvoices] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================
  // GET INVOICES
  // =========================

  useEffect(() => {

    const getInvoices = async () => {

      try {

        setLoading(true);
        setError("");

        const res = await fetch(
          "/api/software/invoices"
        );

        const data =
          await res.json();


        if (!res.ok) {

          setError(
            data.message ||
            "Failed to load invoices"
          );

          return;
        }


        setInvoices(
          data.invoices || []
        );

      } catch (error) {

        console.error(
          "Get Invoice Error:",
          error
        );

        setError(
          "Failed to load invoices"
        );

      } finally {

        setLoading(false);

      }
    };


    getInvoices();

  }, []);


  // =========================
  // VIEW
  // =========================

  const handleView = (invoice) => {
    setSelected(invoice);
  };


  // =========================
  // UPDATE
  // =========================

  const handleUpdate = (invoice) => {
    console.log(
      "Update Invoice:",
      invoice
    );
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = (invoice) => {
    console.log(
      "Delete Invoice:",
      invoice
    );
  };


  // =========================
  // PRINT
  // =========================

  const handlePrint = (invoice) => {
    console.log(
      "Print Invoice:",
      invoice
    );
  };


  return (
    <>

      <div className="rounded-xl bg-white p-3 shadow-sm sm:p-5">


        {/* Title */}
        <h1 className="mb-4 text-center text-lg font-semibold text-sky-700 sm:text-xl">
          View Invoice
        </h1>


        {/* Loading */}
        {loading && (

          <div className="py-10 text-center text-sm text-slate-400">
            Loading invoices...
          </div>

        )}


        {/* Error */}
        {!loading && error && (

          <div className="py-10 text-center text-sm text-red-500">
            {error}
          </div>

        )}


        {/* Table */}
        {!loading && !error && (

          <div className="overflow-hidden rounded-xl ring-1 ring-slate-100">

            <table className="w-full table-fixed text-sm">


              {/* Head */}
              <thead className="bg-sky-50 text-slate-700">

                <tr>

                  {/* Date - Desktop Only */}
                  <Th className="hidden md:table-cell">
                    Invoice Date
                  </Th>


                  <Th>
                    Inv No
                  </Th>


                  <Th>
                    Paid Amt
                  </Th>


                  {/* Medicine - Desktop Only */}
                  <Th className="hidden md:table-cell">
                    Medicine
                  </Th>


                  <Th>
                    Action
                  </Th>

                </tr>

              </thead>


              {/* Body */}
              <tbody>

                {!invoices.length ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No invoice found
                    </td>

                  </tr>

                ) : (

                  invoices.map(
                    (invoice) => (

                      <tr
                        key={invoice._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >


                        {/* Date - Desktop Only */}
                        <Td className="hidden md:table-cell">
                          {formatDate(
                            invoice.date
                          )}
                        </Td>


                        {/* Invoice No */}
                        <Td className="font-semibold text-sky-700">
                          {invoice.invoiceNo}
                        </Td>


                        {/* Paid Amount */}
                        <Td className="font-medium">
                          {money(
                            invoice.payableAmount
                          )}
                        </Td>


                        {/* Medicine - Desktop Only */}
                        <Td className="hidden md:table-cell">
                          {invoice.medicines?.length || 0}
                        </Td>


                        {/* Action */}
                        <Td>

                          <ActionButtons
                            invoice={invoice}
                            onView={handleView}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onPrint={handlePrint}
                          />

                        </Td>


                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* View Popup */}
      {selected && (

        <MedicineModal
          invoice={selected}
          onClose={() =>
            setSelected(null)
          }
        />

      )}

    </>
  );
}