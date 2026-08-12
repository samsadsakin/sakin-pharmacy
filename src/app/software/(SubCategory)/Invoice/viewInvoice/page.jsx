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

      <div className="rounded-xl bg-white p-5 shadow-sm">


        {/* Title */}
        <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">
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


        {/* Main Table */}
        {!loading && !error && (

          <div className="overflow-x-auto rounded-xl ring-1 ring-slate-100">

            <table className="w-full table-fixed text-sm">


              {/* Table Head */}
              <thead className="bg-sky-50 text-slate-700">

                <tr>

                  <Th className="text-center">
                    Invoice Date
                  </Th>

                  <Th className="text-center">
                    Inv No
                  </Th>

                  <Th className="text-center">
                    Paid Amt
                  </Th>

                  <Th className="text-center">
                    Medicine
                  </Th>

                  <Th className="text-center">
                    Action
                  </Th>

                </tr>

              </thead>


              {/* Table Body */}
              <tbody>

                {!invoices.length ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-400"
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


                        {/* Date */}
                        <Td className="text-center">
                          {formatDate(
                            invoice.date
                          )}
                        </Td>


                        {/* Invoice No */}
                        <Td className="text-center font-semibold text-sky-700">
                          {invoice.invoiceNo}
                        </Td>


                        {/* Paid Amount */}
                        <Td className="text-center font-medium">
                          {money(
                            invoice.payableAmount
                          )}
                        </Td>


                        {/* Medicine Count */}
                        <Td className="text-center">
                          {invoice.medicines?.length || 0}
                        </Td>


                        {/* Action */}
                        <Td className="text-center">

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


      {/* Medicine Popup */}
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