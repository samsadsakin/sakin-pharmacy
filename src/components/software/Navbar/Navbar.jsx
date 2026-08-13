"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  FaCartPlus,
  FaChartBar,
  FaCog,
  FaCapsules,
  FaUsers,
} from "react-icons/fa";

import CountDate from "@/components/webpage/Date/Date";


const menuItems = [
  {
    name: "Dashboard",
    href: "/software/dashboard",
    icon: FaChartBar,
  },

  {
    name: "Create Invoice",
    href: "/software/Invoice",
    icon: FaCartPlus,
  },

  {
    name: "View Users",
    href: "/software/users",
    icon: FaUsers,
  },
];


const Sidebar = ({ children }) => {

  // =========================
  // PROFILE
  // =========================

  const [user, setUser] =
    useState(null);

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(true);


  // =========================
  // GET CURRENT USER
  // =========================

  useEffect(() => {

    const getProfile =
      async () => {

        try {

          const res =
            await fetch(
              "/api/auth/me",
              {
                cache:
                  "no-store",
              }
            );


          const data =
            await res.json();


          if (
            res.ok &&
            data.loggedIn
          ) {

            setUser(
              data.user
            );

          } else {

            setUser(
              null
            );

          }


        } catch (error) {

          console.error(
            "Sidebar Profile Error:",
            error
          );

          setUser(
            null
          );


        } finally {

          setProfileLoading(
            false
          );

        }

      };


    getProfile();

  }, []);


  return (

    <div className="drawer lg:drawer-open">


      {/* =========================
          DRAWER TOGGLE
      ========================= */}

      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
      />


      {/* =========================
          MAIN
      ========================= */}

      <div className="drawer-content min-h-screen bg-slate-50">


        {/* =========================
            TOP NAVBAR
        ========================= */}

        <nav className="navbar sticky top-0 z-30 h-15 border-b border-slate-100 bg-white px-4 lg:px-6">


          {/* Open / Close */}

          <label
            htmlFor="my-drawer-4"
            aria-label="toggle sidebar"
            className="btn btn-square btn-ghost text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5"
            >

              <path d="M4 4h16v16H4z" />

              <path d="M9 4v16" />

              <path d="m14 10 2 2-2 2" />

            </svg>

          </label>


          {/* =========================
              BRAND
          ========================= */}

          <Link
            href="/"
            className="ml-2 flex items-center gap-3"
          >

            <img
              src="/images/Logo2.jpg"
              alt="Sakin Pharmacy"
              className="size-9 object-contain"
            />


            <div className="hidden sm:block">

              <h1 className="text-lg font-bold text-blue-700">

                Sakin

                <span className="ml-1 text-emerald-600">
                  Pharmacy
                </span>

              </h1>


              <p className="text-xs text-slate-400">
                Pharmacy Management
              </p>

            </div>

          </Link>


          {/* =========================
              DATE
          ========================= */}

          <div className="ml-auto rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-600">

            <CountDate />

          </div>

        </nav>


        {/* =========================
            PAGE CONTENT
        ========================= */}

        <main className="min-h-screen p-4 sm:p-5 lg:p-6">

          {children}

        </main>

      </div>


      {/* =========================
          SIDEBAR
      ========================= */}

      <div className="drawer-side is-drawer-close:overflow-visible">


        {/* Overlay */}

        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        />


        <aside
          className="
            flex min-h-full flex-col
            bg-blue-600 text-white
            shadow-sm
            is-drawer-close:w-16
            is-drawer-open:w-64
          "
        >


          {/* =========================
              SIDEBAR LOGO
          ========================= */}

          <div className="flex h-20 items-center px-3">

            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">

              <FaCapsules className="text-lg" />

            </div>


            <div className="ml-3 is-drawer-close:hidden">

              <h2 className="whitespace-nowrap font-bold">

                Sakin

                <span className="ml-1 text-emerald-200">
                  Pharmacy
                </span>

              </h2>


              <p className="text-xs text-blue-100">
                Management System
              </p>

            </div>

          </div>


          {/* =========================
              MENU
          ========================= */}

          <div className="flex flex-1 flex-col px-2 py-4">


            <p className="mb-2 px-3 text-xs text-blue-200 is-drawer-close:hidden">
              Main Menu
            </p>


            <ul className="menu w-full gap-1 p-0">


              {menuItems.map(
                (item) => (

                  <MenuItem
                    key={item.name}
                    {...item}
                  />

                )
              )}


              {/* =========================
                  SETTINGS
              ========================= */}

              <li className="mt-3">

                <button
                  type="button"
                  data-tip="Settings"
                  className="
                    group h-11 w-full rounded-lg
                    text-blue-100
                    hover:bg-white/10
                    hover:text-white
                    is-drawer-close:tooltip
                    is-drawer-close:tooltip-right
                  "
                >

                  <span className="flex size-8 items-center justify-center rounded-md bg-white/10 group-hover:bg-emerald-500">

                    <FaCog />

                  </span>


                  <span className="is-drawer-close:hidden">
                    Settings
                  </span>

                </button>

              </li>


            </ul>

          </div>


          {/* =========================
              PROFILE FOOTER
          ========================= */}

          <div className="border-t border-white/10 p-3">


            {profileLoading ? (

              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2">

                <div className="size-9 shrink-0 animate-pulse rounded-full bg-white/20" />

                <div className="flex-1 space-y-1.5 is-drawer-close:hidden">

                  <div className="h-3 w-24 animate-pulse rounded bg-white/20" />

                  <div className="h-2 w-16 animate-pulse rounded bg-white/10" />

                </div>

              </div>


            ) : user ? (

              <div
                data-tip={user.name}
                className="
                  flex items-center gap-3 rounded-lg
                  bg-white/10 p-2
                  transition
                  hover:bg-white/15
                  is-drawer-close:tooltip
                  is-drawer-close:tooltip-right
                "
              >


                {/* Avatar */}

                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">

                  {getInitial(
                    user.name
                  )}

                </div>


                {/* Details */}

                <div className="min-w-0 flex-1 is-drawer-close:hidden">


                  <p className="truncate text-sm font-semibold text-white">

                    {user.name}

                  </p>


                  <p className="truncate text-xs text-blue-100">

                    {user.mobile}

                  </p>


                  <p className="mt-0.5 text-xs font-medium capitalize text-emerald-200">

                    {user.role}

                  </p>


                </div>

              </div>


            ) : (

              <div
                data-tip="No Profile"
                className="
                  flex items-center gap-3 rounded-lg
                  bg-white/10 p-2
                  is-drawer-close:tooltip
                  is-drawer-close:tooltip-right
                "
              >

                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-400 text-sm font-bold text-white">

                  ?

                </div>


                <div className="is-drawer-close:hidden">

                  <p className="text-sm font-medium">
                    No Profile
                  </p>

                  <p className="text-xs text-blue-100">
                    Not logged in
                  </p>

                </div>

              </div>

            )}


          </div>

        </aside>

      </div>

    </div>
  );
};


export default Sidebar;


/* =========================
   MENU ITEM
========================= */

function MenuItem({
  name,
  href,
  icon: Icon,
}) {

  return (

    <li>

      <Link
        href={href}
        data-tip={name}
        className="
          group h-11 rounded-lg
          text-blue-100
          hover:bg-white/10
          hover:text-white
          is-drawer-close:tooltip
          is-drawer-close:tooltip-right
        "
      >

        <span className="flex size-8 items-center justify-center rounded-md bg-white/10 group-hover:bg-emerald-500">

          <Icon />

        </span>


        <span className="font-medium is-drawer-close:hidden">

          {name}

        </span>

      </Link>

    </li>

  );
}


/* =========================
   USER INITIAL
========================= */

function getInitial(name) {

  return (
    name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U"
  );

}