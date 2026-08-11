"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaCartPlus,
  FaFileInvoice,
  FaChartLine,
} from "react-icons/fa";

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

export default function InvoiceNav() {
  const pathname = usePathname();

  return (
    <div className="mt-5 flex justify-center">
      <div className="flex gap-1 rounded-xl bg-white p-1.5 shadow-sm">

        {items.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

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
        })}

      </div>
    </div>
  );
}