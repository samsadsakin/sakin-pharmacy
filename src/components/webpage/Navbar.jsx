"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002D6D]">
            <img
                  src="/images/Logo2.jpg"
                  alt="Pharmacist standing in a pharmacy"
                  className="h-auto w-full object-cover"
                />
          </div>

          <div className="leading-none">
            <span className="block text-xl font-extrabold tracking-wide text-[#002D6D]">
              SAKIN
            </span>
            <span className="text-[10px] font-bold tracking-[0.35em] text-[#08781F]">
              PHARMACY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-[#002D6D] transition hover:text-[#08781F]"
          >
            Home
          </Link>

          <Link
            href="/software"
            className="text-sm font-medium text-gray-600 transition hover:text-[#08781F]"
          >
           Software
          </Link>

          <Link
            href="/healthcare"
            className="text-sm font-medium text-gray-600 transition hover:text-[#08781F]"
          >
            Healthcare
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 transition hover:text-[#08781F]"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 transition hover:text-[#08781F]"
          >
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Search */}
          <button
            aria-label="Search"
            className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#002D6D]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              />
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#002D6D]"
            aria-label="Shopping cart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2 4h14M9 21a1 1 0 1 1-2 0m10 0a1 1 0 1 1-2 0"
              />
            </svg>

            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#08781F] text-[10px] font-bold text-white">
              0
            </span>
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="rounded-lg bg-[#002D6D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#001F4D]"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#002D6D] md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              ["Home", "/"],
              ["Medicines", "/medicines"],
              ["Healthcare", "/healthcare"],
              ["About Us", "/about"],
              ["Contact", "/contact"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#08781F]"
              >
                {name}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-[#002D6D] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}