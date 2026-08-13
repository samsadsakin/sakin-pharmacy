"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);


  // =========================
  // GET CURRENT USER
  // =========================

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (
          res.ok &&
          data.loggedIn
        ) {
          setUser(data.user);
        } else {
          setUser(null);
        }

      } catch (error) {
        console.error(
          "Navbar User Error:",
          error
        );

        setUser(null);

      } finally {
        setLoadingUser(false);
      }
    };


    getCurrentUser();
  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      const data = await res.json();


      if (!res.ok) {
        console.error(
          data.message
        );
        return;
      }


      setUser(null);
      setProfileOpen(false);
      setIsOpen(false);

      router.push("/");
      router.refresh();

    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    }
  };


  // =========================
  // NAV ITEMS
  // =========================

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Software",
      href: "/software",
    },
    {
      name: "About Us",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];


  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">


        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#002D6D]">

            <img
              src="/images/Logo2.jpg"
              alt="Sakin Pharmacy"
              className="h-full w-full object-cover"
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


        {/* =========================
            DESKTOP NAV
        ========================= */}

        <div className="hidden items-center gap-8 md:flex">

          {navItems.map(
            ({ name, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-600 transition hover:text-[#08781F]"
              >
                {name}
              </Link>
            )
          )}

        </div>


        {/* =========================
            DESKTOP PROFILE
        ========================= */}

        <div className="hidden md:block">

          {loadingUser ? (

            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />

          ) : user ? (

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 transition hover:bg-gray-50"
              >

                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002D6D] text-sm font-bold text-white">
                  {getInitial(
                    user.name
                  )}
                </div>


                {/* Name */}
                <div className="text-left">

                  <p className="max-w-32 truncate text-sm font-semibold text-[#002D6D]">
                    {user.name}
                  </p>

                  <p className="text-[10px] capitalize text-gray-400">
                    {user.role}
                  </p>

                </div>


                <svg
                  className={`h-4 w-4 text-gray-400 transition ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 9-7 7-7-7"
                  />
                </svg>

              </button>


              {/* DROPDOWN */}

              {profileOpen && (

                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">

                  <div className="border-b border-gray-100 p-4">

                    <p className="font-semibold text-[#002D6D]">
                      {user.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {user.mobile}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium capitalize text-[#08781F]">
                      {user.role}
                    </span>

                  </div>


                  <div className="p-2">

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      Logout
                    </button>

                  </div>

                </div>

              )}

            </div>

          ) : (

            <Link
              href="/beACustomer"
              className="rounded-lg bg-[#002D6D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#001F4D]"
            >
              Be a Customer
            </Link>

          )}

        </div>


        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(
              !isOpen
            )
          }
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


      {/* =========================
          MOBILE MENU
      ========================= */}

      {isOpen && (

        <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-3 md:hidden">


          {/* USER PROFILE */}

          {user && (

            <div className="mb-3 rounded-xl bg-slate-50 p-3">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002D6D] font-bold text-white">
                  {getInitial(
                    user.name
                  )}
                </div>


                <div>

                  <p className="font-semibold text-[#002D6D]">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.mobile}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* NAV LINKS */}

          <div className="flex flex-col gap-1">

            {navItems.map(
              ({ name, href }) => (

                <Link
                  key={href}
                  href={href}
                  onClick={() =>
                    setIsOpen(
                      false
                    )
                  }
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#08781F]"
                >
                  {name}
                </Link>

              )
            )}


            {/* NOT LOGGED IN */}

            {!user && !loadingUser && (

              <Link
                href="/beACustomer"
                onClick={() =>
                  setIsOpen(
                    false
                  )
                }
                className="mt-2 rounded-lg bg-[#002D6D] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Be a Customer
              </Link>

            )}


            {/* LOGOUT */}

            {user && (

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-500"
              >
                Logout
              </button>

            )}

          </div>

        </div>

      )}

    </header>
  );
}


// =========================
// GET FIRST LETTER
// =========================

function getInitial(name) {
  return (
    name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U"
  );
}