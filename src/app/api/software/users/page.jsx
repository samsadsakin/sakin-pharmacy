"use client";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";


// =========================
// USERS PAGE
// =========================

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
  // GET USERS
  // =========================

  const getUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const res =
        await fetch(
          "/api/admin/users",
          {
            cache: "no-store",
          }
        );


      const data =
        await res.json();


      // =========================
      // ERROR
      // =========================

      if (!res.ok) {

        setUsers([]);

        setCurrentUserRole("");

        setError(
          data.message ||
          "Failed to load users"
        );

        return;
      }


      // =========================
      // SUCCESS
      // =========================

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
  // SELECT NEW ROLE
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
                  selectedRole: role,
                }
              : user
        )
    );

  };


  // =========================
  // UPDATE USER ROLE
  // =========================

  const handleUpdateRole =
    async (user) => {

      // =========================
      // ADMIN ONLY
      // =========================

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


      // =========================
      // SAME ROLE
      // =========================

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
                <b>${escapeHtml(user.name)}</b>
              </p>

              <p>
                ${escapeHtml(user.role)}
                &nbsp; → &nbsp;
                <b>${escapeHtml(newRole)}</b>
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
        // ROLE UPDATE API
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


        // =========================
        // FAILED
        // =========================

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
        // UPDATE TABLE LOCALLY
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

          // =========================
          // SMS SENT
          // =========================

          if (
            data.passwordSent
          ) {

            await Swal.fire({

              title:
                "Role Updated!",

              html: `
                <div style="text-align:center">

                  <p>
                    <b>${escapeHtml(data.user.name)}</b>
                    is now
                    <b>${escapeHtml(data.user.role)}</b>.
                  </p>

                  <p style="margin-top:10px">
                    A new 4-digit password has been sent to:
                  </p>

                  <p style="
                    margin-top:5px;
                    font-weight:700;
                  ">
                    ${escapeHtml(data.user.mobile)}
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
          // SHOW PASSWORD TO ADMIN
          // =========================

          await Swal.fire({

            title:
              "Role Updated",

            html: `
              <div style="text-align:center">

                <p>
                  User role changed to
                  <b>${escapeHtml(data.user.role)}</b>.
                </p>

                <p style="
                  margin-top:10px;
                  color:#dc2626;
                ">
                  Password SMS could not be sent.
                </p>

                ${
                  data.temporaryPassword
                    ? `
                      <p style="margin-top:12px">
                        Temporary Password:
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
        // NORMAL ROLE CHANGE
        // SALESMAN ↔ MANAGER
        // STAFF → CUSTOMER
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
  // PAGE
  // =========================

  return (

    <div className="mx-auto max-w-7xl">


      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">

            View Users

          </h1>


          <p className="mt-1 text-sm text-slate-500">

            View and manage Sakin Pharmacy users.

          </p>

        </div>


        {/* CURRENT ROLE */}

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

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">


            <div>

              <h2 className="font-semibold text-slate-700">

                All Users

              </h2>


              <p className="mt-0.5 text-xs text-slate-400">

                {users.length} total users

              </p>

            </div>


            <button
              type="button"

              onClick={
                getUsers
              }

              className="btn btn-sm btn-ghost text-blue-600"
            >

              Refresh

            </button>


          </div>


          {/* =========================
              TABLE
          ========================= */}

          <div className="overflow-x-auto">


            <table className="table">


              {/* =====================
                  HEAD
              ===================== */}

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


              {/* =====================
                  BODY
              ===================== */}

              <tbody>


                {/* NO USERS */}

                {!users.length ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-16 text-center"
                    >

                      <div className="text-slate-400">

                        <p className="font-medium">
                          No users found
                        </p>

                      </div>

                    </td>

                  </tr>


                ) : (


                  users.map(
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

                          {index + 1}

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


                            {/* USER */}

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


                          {/* =========================
                              MANAGER
                              VIEW ONLY
                          ========================= */}

                          {currentUserRole !==
                          "admin" ? (

                            <div className="text-center">

                              <span className="badge badge-ghost">

                                View Only

                              </span>

                            </div>


                          ) : user.role ===
                            "admin" ? (


                            /* =========================
                               ADMIN USER PROTECTED
                            ========================= */

                            <div className="text-center">

                              <span className="badge badge-error badge-soft">

                                Protected Admin

                              </span>

                            </div>


                          ) : (


                            /* =========================
                               ADMIN ACTION
                            ========================= */

                            <div className="flex min-w-60 items-center justify-center gap-2">


                              {/* =====================
                                  ROLE SELECT
                              ===================== */}

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


                              {/* =====================
                                  UPDATE
                              ===================== */}

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

                                className="btn btn-sm btn-info min-w-20 text-white"
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

  // ADMIN

  if (
    role === "admin"
  ) {

    return (

      <span className="badge badge-error badge-soft">

        Admin

      </span>

    );

  }


  // MANAGER

  if (
    role === "manager"
  ) {

    return (

      <span className="badge badge-warning badge-soft">

        Manager

      </span>

    );

  }


  // SALESMAN

  if (
    role === "salesman"
  ) {

    return (

      <span className="badge badge-info badge-soft">

        Salesman

      </span>

    );

  }


  // CUSTOMER

  return (

    <span className="badge badge-success badge-soft">

      Customer

    </span>

  );

}


// =========================
// USER INITIAL
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
// BASIC HTML ESCAPE
// SweetAlert HTML safety
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