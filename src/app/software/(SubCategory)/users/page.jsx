"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";


const USERS_PER_PAGE = 50;


export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [
    currentUserRole,
    setCurrentUserRole,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  // =========================
  // LIVE SEARCH
  // =========================

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");


  // =========================
  // PAGINATION
  // =========================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  // =========================
  // GET USERS
  // =========================

  const getUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const res = await fetch(
        "/api/admin/users",
        {
          cache: "no-store",
        }
      );


      const data =
        await res.json();


      if (!res.ok) {

        setUsers([]);

        setCurrentUserRole("");

        setError(
          data.message ||
          "Failed to load users"
        );

        return;
      }


      setUsers(
        data.users || []
      );


      setCurrentUserRole(
        data.currentUserRole || ""
      );


    } catch (error) {

      console.error(
        "Get Users Error:",
        error
      );


      setUsers([]);

      setCurrentUserRole("");

      setError(
        "Failed to load users"
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    getUsers();

  }, []);


  // =========================
  // FILTER USERS
  // LIVE
  // =========================

  const filteredUsers =
    useMemo(() => {

      const keyword =
        searchTerm
          .trim()
          .toLowerCase();


      if (!keyword) {
        return users;
      }


      const numberKeyword =
        keyword.replace(
          /\D/g,
          ""
        );


      return users.filter(
        (user) => {

          const userName =
            String(
              user.name || ""
            )
              .toLowerCase()
              .trim();


          const userMobile =
            String(
              user.mobile || ""
            ).replace(
              /\D/g,
              ""
            );


          // NAME MATCH

          const nameMatch =
            userName.includes(
              keyword
            );


          // MOBILE MATCH

          const mobileMatch =
            numberKeyword.length > 0 &&
            userMobile.includes(
              numberKeyword
            );


          return (
            nameMatch ||
            mobileMatch
          );

        }
      );

    }, [
      users,
      searchTerm,
    ]);


  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredUsers.length /
        USERS_PER_PAGE
      )
    );


  // =========================
  // CURRENT PAGE USERS
  // =========================

  const currentUsers =
    useMemo(() => {

      const start =
        (currentPage - 1) *
        USERS_PER_PAGE;


      return filteredUsers.slice(
        start,
        start +
          USERS_PER_PAGE
      );

    }, [
      filteredUsers,
      currentPage,
    ]);


  // =========================
  // PAGE SAFETY
  // =========================

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);


  // =========================
  // LIVE SEARCH CHANGE
  // =========================

  const handleSearchChange = (
    e
  ) => {

    setSearchTerm(
      e.target.value
    );


    // Every new search
    // starts from page 1

    setCurrentPage(1);

  };


  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {

    setSearchTerm("");

    setCurrentPage(1);

  };


  // =========================
  // SELECT ROLE
  // =========================

  const handleRoleChange = (
    userId,
    role
  ) => {

    setUsers(
      (currentUsers) =>
        currentUsers.map(
          (user) =>
            user.id === userId
              ? {
                  ...user,

                  selectedRole:
                    role,
                }
              : user
        )
    );

  };


  // =========================
  // UPDATE ROLE
  // =========================

  const handleUpdateRole =
    async (user) => {

      // ADMIN ONLY

      if (
        currentUserRole !==
        "admin"
      ) {

        await Swal.fire({

          title:
            "Permission Denied",

          text:
            "Only admin can change user roles.",

          icon:
            "error",

        });


        return;
      }


      const newRole =
        user.selectedRole ||
        user.role;


      // SAME ROLE

      if (
        newRole ===
        user.role
      ) {

        await Swal.fire({

          title:
            "No Change",

          text:
            "Please select a different role.",

          icon:
            "info",

        });


        return;
      }


      // =========================
      // CONFIRM
      // =========================

      const confirm =
        await Swal.fire({

          title:
            "Change User Role?",

          html: `
            <div style="text-align:center">

              <p style="margin-bottom:8px">
                <b>
                  ${escapeHtml(
                    user.name
                  )}
                </b>
              </p>

              <p>
                ${escapeHtml(
                  user.role
                )}

                &nbsp; → &nbsp;

                <b>
                  ${escapeHtml(
                    newRole
                  )}
                </b>
              </p>

            </div>
          `,

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, Update",

          cancelButtonText:
            "No",

          reverseButtons:
            true,

        });


      if (
        !confirm.isConfirmed
      ) {
        return;
      }


      try {

        setUpdatingId(
          user.id
        );


        // =========================
        // UPDATE API
        // =========================

        const res =
          await fetch(
            `/api/admin/users/${user.id}/role`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  role:
                    newRole,
                }),
            }
          );


        const data =
          await res.json();


        if (!res.ok) {

          await Swal.fire({

            title:
              "Failed",

            text:
              data.message ||
              "Failed to update user role.",

            icon:
              "error",

          });


          return;
        }


        // =========================
        // UPDATE LOCAL DATA
        // =========================

        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (currentUser) =>
                currentUser.id ===
                user.id
                  ? {
                      ...currentUser,

                      role:
                        data.user.role,

                      staffVerified:
                        data.user
                          .staffVerified,

                      isActive:
                        data.user
                          .isActive,

                      selectedRole:
                        undefined,
                    }
                  : currentUser
            )
        );


        // =========================
        // PASSWORD GENERATED
        // =========================

        if (
          data.passwordGenerated
        ) {

          // SMS SENT

          if (
            data.passwordSent
          ) {

            await Swal.fire({

              title:
                "Role Updated!",

              html: `
                <div style="text-align:center">

                  <p>
                    <b>
                      ${escapeHtml(
                        data.user.name
                      )}
                    </b>

                    is now

                    <b>
                      ${escapeHtml(
                        data.user.role
                      )}
                    </b>.
                  </p>

                  <p style="margin-top:10px">
                    A new 4-digit password
                    has been sent to
                  </p>

                  <p style="
                    margin-top:5px;
                    font-weight:700;
                  ">
                    ${escapeHtml(
                      data.user.mobile
                    )}
                  </p>

                </div>
              `,

              icon:
                "success",

              confirmButtonText:
                "OK",

            });


            return;
          }


          // =========================
          // SMS FAILED
          // =========================

          await Swal.fire({

            title:
              "Role Updated",

            html: `
              <div style="text-align:center">

                <p>
                  User role changed to

                  <b>
                    ${escapeHtml(
                      data.user.role
                    )}
                  </b>.
                </p>

                <p style="
                  margin-top:10px;
                  color:#dc2626;
                ">
                  Password SMS could
                  not be sent.
                </p>

                ${
                  data.temporaryPassword
                    ? `
                      <p style="margin-top:12px">
                        Temporary Password
                      </p>

                      <div style="
                        margin-top:5px;
                        font-size:30px;
                        font-weight:700;
                        letter-spacing:5px;
                      ">
                        ${escapeHtml(
                          data.temporaryPassword
                        )}
                      </div>
                    `
                    : ""
                }

              </div>
            `,

            icon:
              "warning",

            confirmButtonText:
              "OK",

          });


          return;
        }


        // =========================
        // NORMAL ROLE UPDATE
        // =========================

        await Swal.fire({

          title:
            "Updated!",

          text:
            `${data.user.name} is now ${data.user.role}.`,

          icon:
            "success",

          timer:
            1600,

          showConfirmButton:
            false,

        });


      } catch (error) {

        console.error(
          "Update Role Error:",
          error
        );


        await Swal.fire({

          title:
            "Error",

          text:
            "Something went wrong. Please try again.",

          icon:
            "error",

        });


      } finally {

        setUpdatingId(
          null
        );

      }

    };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="flex min-h-72 items-center justify-center">

        <div className="text-center">

          <span className="loading loading-spinner loading-lg text-blue-600" />


          <p className="mt-3 text-sm text-slate-500">

            Loading users...

          </p>

        </div>

      </div>

    );

  }


  // =========================
  // UI
  // =========================

  return (

    <div className="mx-auto max-w-7xl">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">

            View Users

          </h1>


          <p className="mt-1 text-sm text-slate-500">

            View and manage
            Sakin Pharmacy users.

          </p>

        </div>


        {/* CURRENT USER ROLE */}

        {currentUserRole && (

          <div className="flex items-center gap-2">

            <span className="text-xs text-slate-400">

              Your Access:

            </span>


            <RoleBadge
              role={
                currentUserRole
              }
            />

          </div>

        )}


      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          role="alert"
          className="alert alert-error mb-5"
        >

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =========================
          TABLE CARD
      ========================= */}

      {!error && (

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">


          {/* =========================
              TABLE TOP
          ========================= */}

          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">


            {/* COUNT */}

            <div>

              <h2 className="font-semibold text-slate-700">

                All Users

              </h2>


              <p className="mt-0.5 text-xs text-slate-400">

                {searchTerm.trim()
                  ? `${filteredUsers.length} users found`
                  : `${users.length} total users`}

              </p>

            </div>


            {/* =========================
                LIVE SEARCH
            ========================= */}

            <div className="relative w-full sm:w-80">


              {/* SEARCH ICON */}

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


              {/* INPUT */}

              <input
                type="text"

                value={
                  searchTerm
                }

                onChange={
                  handleSearchChange
                }

                placeholder="Search name or mobile"

                className="input input-bordered w-full pl-9 pr-10"
              />


              {/* CLEAR */}

              {searchTerm && (

                <button
                  type="button"

                  onClick={
                    clearSearch
                  }

                  className="btn btn-circle btn-ghost btn-xs absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >

                  ✕

                </button>

              )}


            </div>


          </div>


          {/* =========================
              SEARCH INFO
          ========================= */}

          {searchTerm.trim() && (

            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 sm:px-5">

              <p className="text-xs text-slate-500">

                Showing results for

                <span className="ml-1 font-semibold text-blue-700">

                  "{searchTerm}"

                </span>

              </p>

            </div>

          )}


          {/* =========================
              TABLE
          ========================= */}

          <div className="overflow-x-auto">

            <table className="table">


              {/* HEAD */}

              <thead className="bg-blue-50 text-slate-600">

                <tr>

                  <th className="w-16 text-center">

                    SL

                  </th>


                  <th>
                    Name
                  </th>


                  <th>
                    Mobile Number
                  </th>


                  <th className="text-center">

                    Role

                  </th>


                  <th className="text-center">

                    Action

                  </th>

                </tr>

              </thead>


              {/* BODY */}

              <tbody>


                {!currentUsers.length ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-16 text-center"
                    >

                      <div className="text-slate-400">


                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="mx-auto mb-3 size-10"
                        >

                          <circle
                            cx="11"
                            cy="11"
                            r="8"
                          />

                          <path d="m21 21-4.3-4.3" />

                        </svg>


                        <p className="font-medium">

                          {searchTerm.trim()
                            ? "No matching user found"
                            : "No users found"}

                        </p>


                      </div>

                    </td>

                  </tr>


                ) : (


                  currentUsers.map(
                    (
                      user,
                      index
                    ) => (

                      <tr
                        key={
                          user.id
                        }

                        className="hover:bg-slate-50"
                      >


                        {/* =================
                            SL
                        ================= */}

                        <td className="text-center text-slate-400">

                          {
                            (
                              currentPage -
                              1
                            ) *
                              USERS_PER_PAGE +
                            index +
                            1
                          }

                        </td>


                        {/* =================
                            NAME
                        ================= */}

                        <td>

                          <div className="flex min-w-40 items-center gap-3">


                            {/* AVATAR */}

                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">

                              {getInitial(
                                user.name
                              )}

                            </div>


                            {/* USER INFO */}

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-slate-700">

                                {user.name}

                              </p>


                              {!user.isActive && (

                                <span className="text-xs font-medium text-red-500">

                                  Disabled

                                </span>

                              )}


                            </div>


                          </div>

                        </td>


                        {/* =================
                            MOBILE
                        ================= */}

                        <td>

                          <span className="whitespace-nowrap font-medium text-slate-600">

                            {user.mobile}

                          </span>

                        </td>


                        {/* =================
                            ROLE
                        ================= */}

                        <td className="text-center">

                          <RoleBadge
                            role={
                              user.role
                            }
                          />

                        </td>


                        {/* =================
                            ACTION
                        ================= */}

                        <td>


                          {/* =================
                              MANAGER
                          ================= */}

                          {currentUserRole !==
                          "admin" ? (

                            <div className="text-center">

                              <span className="badge badge-ghost">

                                View Only

                              </span>

                            </div>


                          ) : user.role ===
                            "admin" ? (


                            /* =================
                               ADMIN PROTECTED
                            ================= */

                            <div className="text-center">

                              <span className="badge badge-error badge-soft">

                                Protected Admin

                              </span>

                            </div>


                          ) : (


                            /* =================
                               ADMIN ACTION
                            ================= */

                            <div className="flex min-w-60 items-center justify-center gap-2">


                              {/* ROLE */}

                              <select
                                value={
                                  user.selectedRole ||
                                  user.role
                                }

                                onChange={(e) =>
                                  handleRoleChange(
                                    user.id,
                                    e.target.value
                                  )
                                }

                                disabled={
                                  updatingId ===
                                  user.id
                                }

                                className="select select-sm select-bordered w-32"
                              >

                                <option value="customer">

                                  Customer

                                </option>

                                <option value="salesman">

                                  Salesman

                                </option>

                                <option value="manager">

                                  Manager

                                </option>

                              </select>


                              {/* UPDATE */}

                              <button
                                type="button"

                                onClick={() =>
                                  handleUpdateRole(
                                    user
                                  )
                                }

                                disabled={
                                  updatingId ===
                                    user.id ||
                                  (
                                    user.selectedRole ||
                                    user.role
                                  ) ===
                                    user.role
                                }

                                className="btn btn-info btn-sm min-w-20 text-white"
                              >

                                {updatingId ===
                                user.id ? (

                                  <span className="loading loading-spinner loading-xs" />

                                ) : (

                                  "Update"

                                )}

                              </button>


                            </div>

                          )}


                        </td>


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

          {filteredUsers.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">


              {/* INFO */}

              <p className="text-sm text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">

                  {
                    (
                      currentPage -
                      1
                    ) *
                      USERS_PER_PAGE +
                    1
                  }

                </span>


                {" - "}


                <span className="font-semibold text-slate-700">

                  {Math.min(
                    currentPage *
                      USERS_PER_PAGE,

                    filteredUsers.length
                  )}

                </span>


                {" of "}


                <span className="font-semibold text-slate-700">

                  {filteredUsers.length}

                </span>


                {" users"}

              </p>


              {/* PAGE BUTTONS */}

              <div className="join">


                {/* PREVIOUS */}

                <button
                  type="button"

                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }

                  disabled={
                    currentPage === 1
                  }

                  className="join-item btn btn-sm"
                >

                  Previous

                </button>


                {/* CURRENT */}

                <button
                  type="button"
                  className="join-item btn btn-sm pointer-events-none"
                >

                  Page {currentPage} of {totalPages}

                </button>


                {/* NEXT */}

                <button
                  type="button"

                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }

                  disabled={
                    currentPage ===
                    totalPages
                  }

                  className="join-item btn btn-sm"
                >

                  Next

                </button>


              </div>


            </div>

          )}


          {/* =========================
              MANAGER NOTICE
          ========================= */}

          {currentUserRole ===
            "manager" && (

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">

              Manager access is view only.
              Only Admin can change user roles.

            </div>

          )}


        </div>

      )}


    </div>

  );
}


// =========================
// ROLE BADGE
// =========================

function RoleBadge({
  role,
}) {

  if (
    role === "admin"
  ) {

    return (

      <span className="badge badge-error badge-soft">

        Admin

      </span>

    );

  }


  if (
    role === "manager"
  ) {

    return (

      <span className="badge badge-warning badge-soft">

        Manager

      </span>

    );

  }


  if (
    role === "salesman"
  ) {

    return (

      <span className="badge badge-info badge-soft">

        Salesman

      </span>

    );

  }


  return (

    <span className="badge badge-success badge-soft">

      Customer

    </span>

  );

}


// =========================
// INITIAL
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


// =========================
// ESCAPE HTML
// =========================

function escapeHtml(value) {

  return String(
    value || ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}