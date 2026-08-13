"use client";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";


import {
  ActionButtons,
  MedicineModal,
  Th,
  Td,
  money,
  formatDate,
} from "@/components/software/invoice/ViewInvoiceComponents";


// =========================
// SETTINGS
// =========================

const INVOICES_PER_PAGE = 50;


// =========================
// GET TODAY LOCAL DATE
// YYYY-MM-DD
// =========================

function getTodayDate() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;
}



// =========================
// PAGE
// =========================

export default function ViewInvoicePage() {


  // =========================
  // INVOICE DATA
  // =========================

  const [
    invoices,
    setInvoices,
  ] = useState([]);


  const [
    selected,
    setSelected,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // =========================
  // FILTERS
  // =========================

  const [
    fromDate,
    setFromDate,
  ] = useState("");


  const [
    toDate,
    setToDate,
  ] = useState("");


  const [
    invoiceSearch,
    setInvoiceSearch,
  ] = useState("");


  // =========================
  // PAGINATION
  // =========================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    totalPages,
    setTotalPages,
  ] = useState(1);


  const [
    totalInvoices,
    setTotalInvoices,
  ] = useState(0);


  // =========================
  // CHECK TODAY ACTIVE
  // =========================

  const today =
    getTodayDate();


  const isTodayActive =
    fromDate === today &&
    toDate === today &&
    !invoiceSearch;


  // =========================
  // GET INVOICES
  // =========================

  const getInvoices =
    async ({
      page =
        currentPage,

      signal,
    } = {}) => {

      try {

        setLoading(true);

        setError("");


        // =========================
        // QUERY PARAMS
        // =========================

        const params =
          new URLSearchParams();


        params.set(
          "page",
          String(page)
        );


        params.set(
          "limit",
          String(
            INVOICES_PER_PAGE
          )
        );


        // =========================
        // SEARCH BY INVOICE NO
        //
        // Invoice search থাকলে
        // date filter পাঠানো হবে না
        // =========================

        if (
          invoiceSearch.trim()
        ) {

          params.set(
            "invoiceNo",
            invoiceSearch.trim()
          );

        } else {


          // =========================
          // FROM DATE
          // =========================

          if (fromDate) {

            params.set(
              "from",
              fromDate
            );

          }


          // =========================
          // TO DATE
          // =========================

          if (toDate) {

            params.set(
              "to",
              toDate
            );

          }

        }


        // =========================
        // FETCH
        // =========================

        const res =
          await fetch(
            `/api/software/invoices/view?${params.toString()}`,
            {
              cache:
                "no-store",

              signal,
            }
          );


        const data =
          await res.json();


        // =========================
        // API ERROR
        // =========================

        if (!res.ok) {

          setInvoices([]);

          setTotalInvoices(0);

          setTotalPages(1);


          setError(
            data.message ||
            "Failed to load invoices"
          );


          return;
        }


        // =========================
        // SUCCESS
        // =========================

        setInvoices(
          data.invoices ||
          []
        );


        setTotalInvoices(
          data.pagination
            ?.total ||
          0
        );


        setTotalPages(
          data.pagination
            ?.totalPages ||
          1
        );


      } catch (error) {


        // Request cancelled
        // while typing/searching

        if (
          error.name ===
          "AbortError"
        ) {

          return;

        }


        console.error(
          "Get Invoice Error:",
          error
        );


        setInvoices([]);

        setTotalInvoices(0);

        setTotalPages(1);


        setError(
          "Failed to load invoices"
        );


      } finally {

        if (
          !signal?.aborted
        ) {

          setLoading(false);

        }

      }

    };


  // =========================
  // AUTO LOAD
  //
  // Date change
  // Search change
  // Page change
  // =========================

  useEffect(() => {

    const controller =
      new AbortController();


    // Invoice search:
    // wait 350ms after typing

    const delay =
      invoiceSearch.trim()
        ? 350
        : 0;


    const timer =
      setTimeout(
        () => {

          getInvoices({
            page:
              currentPage,

            signal:
              controller.signal,
          });

        },
        delay
      );


    return () => {

      clearTimeout(
        timer
      );


      controller.abort();

    };

  }, [
    currentPage,
    fromDate,
    toDate,
    invoiceSearch,
  ]);


  // =========================
  // FROM DATE CHANGE
  // =========================

  const handleFromDate = (
    e
  ) => {

    setFromDate(
      e.target.value
    );


    setCurrentPage(1);

  };


  // =========================
  // TO DATE CHANGE
  // =========================

  const handleToDate = (
    e
  ) => {

    setToDate(
      e.target.value
    );


    setCurrentPage(1);

  };


  // =========================
  // INVOICE NUMBER
  // LIVE SEARCH
  // =========================

  const handleInvoiceSearch = (
    e
  ) => {

    // Only number allowed

    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );


    setInvoiceSearch(
      value
    );


    setCurrentPage(1);

  };


  // =========================
  // TODAY
  // =========================

  const handleToday = () => {

    const currentToday =
      getTodayDate();


    // Remove invoice search

    setInvoiceSearch("");


    // Today → Today

    setFromDate(
      currentToday
    );


    setToDate(
      currentToday
    );


    // Start at page 1

    setCurrentPage(1);

  };


  // =========================
  // CLEAR FILTER
  // =========================

  const clearFilters = () => {

    setFromDate("");

    setToDate("");

    setInvoiceSearch("");

    setCurrentPage(1);

  };


  // =========================
  // VIEW
  // =========================

  const handleView = (
    invoice
  ) => {

    setSelected(
      invoice
    );

  };


  // =========================
  // UPDATE
  // =========================

  const handleUpdate = (
    invoice
  ) => {

    console.log(
      "Update Invoice:",
      invoice
    );

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (
      invoice
    ) => {

      const result =
        await Swal.fire({

          title:
            "Delete Invoice?",

          text:
            `Invoice #${invoice.invoiceNo} will be deleted permanently.`,

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, Delete",

          cancelButtonText:
            "Cancel",

          reverseButtons:
            true,

        });


      if (
        !result.isConfirmed
      ) {

        return;

      }


      try {

        const res =
          await fetch(
            `/api/software/invoices/${invoice._id}`,
            {
              method:
                "DELETE",
            }
          );


        const data =
          await res.json();


        // =========================
        // DELETE FAILED
        // =========================

        if (!res.ok) {

          await Swal.fire({

            title:
              "Failed",

            text:
              data.message ||
              "Failed to delete invoice",

            icon:
              "error",

          });


          return;
        }


        // =========================
        // CLOSE MODAL
        // =========================

        if (
          selected?._id ===
          invoice._id
        ) {

          setSelected(
            null
          );

        }


        // =========================
        // CALCULATE PAGE
        // AFTER DELETE
        // =========================

        const remainingTotal =
          Math.max(
            0,
            totalInvoices - 1
          );


        const remainingPages =
          Math.max(
            1,
            Math.ceil(
              remainingTotal /
              INVOICES_PER_PAGE
            )
          );


        // If last item of last page deleted

        if (
          currentPage >
          remainingPages
        ) {

          setCurrentPage(
            remainingPages
          );

        } else {

          // Reload same page

          await getInvoices({
            page:
              currentPage,
          });

        }


        // =========================
        // SUCCESS
        // =========================

        await Swal.fire({

          title:
            "Deleted!",

          text:
            "Invoice deleted successfully.",

          icon:
            "success",

          timer:
            1500,

          showConfirmButton:
            false,

        });


      } catch (error) {

        console.error(
          "Delete Invoice Error:",
          error
        );


        await Swal.fire({

          title:
            "Error",

          text:
            "Something went wrong.",

          icon:
            "error",

        });

      }

    };


  // =========================
  // PRINT
  // =========================

  const handlePrint = (
    invoice
  ) => {

    window.open(
      `/software/Invoice/PrintInvoice/${invoice._id}`,
      "_blank"
    );

  };


  // =========================
  // PAGINATION INFO
  // =========================

  const showingFrom =
    totalInvoices > 0
      ? (
          currentPage - 1
        ) *
          INVOICES_PER_PAGE +
        1
      : 0;


  const showingTo =
    Math.min(
      currentPage *
        INVOICES_PER_PAGE,

      totalInvoices
    );


  // =========================
  // UI
  // =========================

  return (

    <>

      <div className="rounded-xl bg-white p-3 shadow-sm sm:p-5">


        {/* =========================
            TITLE
        ========================= */}

        <h1 className="mb-4 text-center text-lg font-semibold text-sky-700 sm:text-xl">

          View Invoice

        </h1>


        {/* =========================
            FILTER AREA
        ========================= */}

        <div className="mb-5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">


          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">


            {/* =====================
                TODAY BUTTON
            ===================== */}

            <div className="flex items-end">

              <button
                type="button"

                onClick={
                  handleToday
                }

                className={`btn w-full ${
                  isTodayActive
                    ? "btn-info text-white"
                    : "btn-outline btn-info"
                }`}
              >

                {/* Calendar Icon */}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="size-4"
                >

                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />

                  <path d="M16 3v4" />

                  <path d="M8 3v4" />

                  <path d="M3 11h18" />

                </svg>


                Today

              </button>

            </div>


            {/* =====================
                FROM DATE
            ===================== */}

            <div>

              <label className="mb-1 block text-xs font-semibold text-slate-500">

                From Date

              </label>


              <input
                type="date"

                value={
                  fromDate
                }

                onChange={
                  handleFromDate
                }

                max={
                  toDate ||
                  undefined
                }

                disabled={
                  Boolean(
                    invoiceSearch
                  )
                }

                className="input input-bordered w-full"
              />

            </div>


            {/* =====================
                TO DATE
            ===================== */}

            <div>

              <label className="mb-1 block text-xs font-semibold text-slate-500">

                To Date

              </label>


              <input
                type="date"

                value={
                  toDate
                }

                onChange={
                  handleToDate
                }

                min={
                  fromDate ||
                  undefined
                }

                disabled={
                  Boolean(
                    invoiceSearch
                  )
                }

                className="input input-bordered w-full"
              />

            </div>


            {/* =====================
                INVOICE NUMBER
            ===================== */}

            <div>

              <label className="mb-1 block text-xs font-semibold text-slate-500">

                Search Invoice No

              </label>


              <div className="relative">


                {/* Search Icon */}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                >

                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />

                  <path d="m21 21-4.3-4.3" />

                </svg>


                <input
                  type="text"

                  inputMode="numeric"

                  value={
                    invoiceSearch
                  }

                  onChange={
                    handleInvoiceSearch
                  }

                  placeholder="Invoice No"

                  className="input input-bordered w-full pl-9 pr-10"
                />


                {/* Clear Search */}

                {invoiceSearch && (

                  <button
                    type="button"

                    onClick={() => {

                      setInvoiceSearch(
                        ""
                      );

                      setCurrentPage(
                        1
                      );

                    }}

                    className="btn btn-circle btn-ghost btn-xs absolute right-3 top-1/2 -translate-y-1/2"
                  >

                    ✕

                  </button>

                )}


              </div>

            </div>


            {/* =====================
                CLEAR FILTER
            ===================== */}

            <div className="flex items-end">

              <button
                type="button"

                onClick={
                  clearFilters
                }

                disabled={
                  !fromDate &&
                  !toDate &&
                  !invoiceSearch
                }

                className="btn btn-outline w-full"
              >

                Clear Filter

              </button>

            </div>


          </div>


          {/* =========================
              FILTER STATUS
          ========================= */}

          <div className="mt-3">


            {invoiceSearch ? (

              <div className="flex items-center gap-1 text-xs text-slate-500">

                <span>
                  Searching Invoice:
                </span>


                <span className="font-semibold text-sky-700">

                  #{invoiceSearch}

                </span>

              </div>


            ) : isTodayActive ? (

              <div className="flex items-center gap-1 text-xs text-slate-500">

                <span>
                  Showing:
                </span>


                <span className="font-semibold text-sky-700">

                  Today's Invoices

                </span>


                <span>
                  ({today})
                </span>

              </div>


            ) : fromDate ||
              toDate ? (

              <div className="flex items-center gap-1 text-xs text-slate-500">

                <span>
                  Date:
                </span>


                <span className="font-semibold text-sky-700">

                  {fromDate ||
                    "Beginning"}

                  {" → "}

                  {toDate ||
                    "Latest"}

                </span>

              </div>


            ) : (

              <div className="text-xs text-slate-500">

                Showing latest invoices

              </div>

            )}


          </div>


        </div>


        {/* =========================
            RESULT INFO
        ========================= */}

        {!error && (

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">


            <p className="text-xs text-slate-500">

              Total Found:

              <span className="ml-1 font-semibold text-slate-700">

                {totalInvoices}

              </span>

            </p>


            <p className="text-xs text-slate-400">

              Maximum 50 invoices per page

            </p>


          </div>

        )}


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="py-12 text-center">

            <span className="loading loading-spinner loading-md text-sky-600" />


            <p className="mt-2 text-sm text-slate-400">

              Loading invoices...

            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading &&
          error && (

          <div className="py-10 text-center">

            <p className="text-sm text-red-500">

              {error}

            </p>


            <button
              type="button"

              onClick={() =>
                getInvoices({
                  page:
                    currentPage,
                })
              }

              className="btn btn-sm mt-3"
            >

              Try Again

            </button>

          </div>

        )}


        {/* =========================
            TABLE
        ========================= */}

        {!loading &&
          !error && (

          <div className="overflow-hidden rounded-xl ring-1 ring-slate-100">


            <div className="overflow-x-auto">


              <table className="w-full table-fixed text-sm">


                {/* =================
                    HEAD
                ================= */}

                <thead className="bg-sky-50 text-slate-700">

                  <tr>


                    {/* DATE */}

                    <Th className="hidden md:table-cell">

                      Invoice Date

                    </Th>


                    {/* INVOICE NO */}

                    <Th>

                      Inv No

                    </Th>


                    {/* PAID */}

                    <Th>

                      Paid Amt

                    </Th>


                    {/* MEDICINES */}

                    <Th className="hidden md:table-cell">

                      Medicine

                    </Th>


                    {/* ACTION */}

                    <Th>

                      Action

                    </Th>


                  </tr>

                </thead>


                {/* =================
                    BODY
                ================= */}

                <tbody>


                  {!invoices.length ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="py-14 text-center"
                      >


                        <div className="text-slate-400">


                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="mx-auto mb-2 size-10"
                          >

                            <path d="M3 5h18v16H3z" />

                            <path d="M8 3v4" />

                            <path d="M16 3v4" />

                            <path d="M3 11h18" />

                          </svg>


                          <p className="text-sm font-medium">

                            No invoice found

                          </p>


                          {isTodayActive && (

                            <p className="mt-1 text-xs">

                              No invoice found for today.

                            </p>

                          )}


                        </div>


                      </td>

                    </tr>


                  ) : (


                    invoices.map(
                      (
                        invoice
                      ) => (

                        <tr
                          key={
                            invoice._id
                          }

                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >


                          {/* =================
                              DATE
                          ================= */}

                          <Td className="hidden md:table-cell">

                            {formatDate(
                              invoice.date
                            )}

                          </Td>


                          {/* =================
                              INVOICE NO
                          ================= */}

                          <Td className="font-semibold text-sky-700">

                            {invoice.invoiceNo}

                          </Td>


                          {/* =================
                              PAYABLE
                          ================= */}

                          <Td className="font-medium">

                            {money(
                              invoice.payableAmount
                            )}

                          </Td>


                          {/* =================
                              MEDICINE COUNT
                          ================= */}

                          <Td className="hidden md:table-cell">

                            {invoice
                              .medicines
                              ?.length ||
                              0}

                          </Td>


                          {/* =================
                              ACTION
                          ================= */}

                          <Td>

                            <ActionButtons
                              invoice={
                                invoice
                              }

                              onView={
                                handleView
                              }

                              onUpdate={
                                handleUpdate
                              }

                              onDelete={
                                handleDelete
                              }

                              onPrint={
                                handlePrint
                              }
                            />

                          </Td>


                        </tr>

                      )
                    )

                  )}


                </tbody>


              </table>


            </div>


            {/* =========================
                PAGINATION
            ========================= */}

            {totalInvoices >
              0 && (

              <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">


                {/* =====================
                    SHOWING INFO
                ===================== */}

                <p className="text-xs text-slate-500">


                  Showing{" "}


                  <span className="font-semibold text-slate-700">

                    {showingFrom}

                  </span>


                  {" - "}


                  <span className="font-semibold text-slate-700">

                    {showingTo}

                  </span>


                  {" of "}


                  <span className="font-semibold text-slate-700">

                    {totalInvoices}

                  </span>


                  {" invoices"}


                </p>


                {/* =====================
                    PAGE BUTTONS
                ===================== */}

                <div className="join">


                  {/* PREVIOUS */}

                  <button
                    type="button"

                    onClick={() => {

                      setCurrentPage(
                        (
                          page
                        ) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      );

                    }}

                    disabled={
                      currentPage ===
                      1
                    }

                    className="join-item btn btn-sm"
                  >

                    Previous

                  </button>


                  {/* PAGE NUMBER */}

                  <button
                    type="button"

                    className="join-item btn btn-sm pointer-events-none"
                  >

                    Page{" "}

                    {currentPage}

                    {" of "}

                    {totalPages}

                  </button>


                  {/* NEXT */}

                  <button
                    type="button"

                    onClick={() => {

                      setCurrentPage(
                        (
                          page
                        ) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      );

                    }}

                    disabled={
                      currentPage >=
                      totalPages
                    }

                    className="join-item btn btn-sm"
                  >

                    Next

                  </button>


                </div>


              </div>

            )}


          </div>

        )}


      </div>


      {/* =========================
          MEDICINE VIEW POPUP
      ========================= */}

      {selected && (

        <MedicineModal
          invoice={
            selected
          }

          onClose={() =>
            setSelected(
              null
            )
          }
        />

      )}


    </>

  );

}