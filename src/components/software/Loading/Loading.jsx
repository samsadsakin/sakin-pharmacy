"use client";

import { FaCapsules } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Spinner */}
        <div className="relative flex size-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-[#123B6D] border-r-[#20A44A]" />

          {/* Pharmacy Icon */}
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#123B6D] text-white shadow-md">
            <FaCapsules className="text-xl" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-5 text-xl font-bold text-[#123B6D]">
          Sakin
          <span className="ml-1 text-[#20A44A]">
            Pharmacy
          </span>
        </h1>

        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
          Loading...
        </p>

      </div>
    </div>
  );
}