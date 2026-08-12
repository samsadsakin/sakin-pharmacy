"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useState } from "react";

import {
  FaCartPlus,
  FaFileInvoice,
  FaChartLine,
  FaPrint,
} from "react-icons/fa";


export default function InvoiceNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [printLoading, setPrintLoading] =
    useState(false);


  // =========================
  // NORMAL NAV ITEMS
  // =========================

  const items = [
    {
      name: "Create",
      href: "/software/Invoice/createInvoice",
      icon: FaCartPlus,
    },

    {
      name: "Invoices",
      href: "/software/Invoice/viewInvoice",
      icon: FaFileInvoice,
    },

    {
      name: "Sales",
      href: "/software/invoiceSales",
      icon: FaChartLine,
    },
  ];


  // =========================
  // LATEST INVOICE PRINT
  // =========================

  const handleLatestPrint = async () => {
    try {
      setPrintLoading(true);

      const res = await fetch(
        "/api/software/invoices",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Failed to load invoice"
        );
        return;
      }


      // GET API latest-first হলে
      // প্রথম invoice-টাই latest
      const latestInvoice =
        data.invoices?.[0];


      if (!latestInvoice?._id) {
        alert("No invoice found");
        return;
      }


      // Client-side navigation
      router.push(
        `/software/Invoice/PrintInvoice/${latestInvoice._id}`
      );

    } catch (error) {
      console.error(
        "Latest Invoice Error:",
        error
      );

      alert(
        "Failed to load latest invoice"
      );

    } finally {
      setPrintLoading(false);
    }
  };


  // =========================
  // PRINT ACTIVE
  // =========================

  const printActive =
    pathname.startsWith(
      "/software/Invoice/PrintInvoice/"
    );


  return (
    <div className="mt-5 flex justify-center">

      <div className="flex gap-1 rounded-xl bg-white p-1.5 shadow-sm">


        {/* Normal Navigation */}
        {items.map(
          ({
            name,
            href,
            icon: Icon,
          }) => {

            const active =
              pathname === href;


            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                  active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon className="text-xs" />

                {name}
              </Link>
            );
          }
        )}


        {/* =========================
            PRINT - ALWAYS VISIBLE
        ========================= */}

        <button
          type="button"
          onClick={handleLatestPrint}
          disabled={printLoading}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
            printActive
              ? "bg-blue-50 font-medium text-blue-700"
              : "text-slate-500 hover:bg-slate-50"
          } disabled:cursor-wait disabled:opacity-60`}
        >
          <FaPrint className="text-xs" />

          {printLoading
            ? "Loading..."
            : "Print"}
        </button>

      </div>

    </div>
  );
}