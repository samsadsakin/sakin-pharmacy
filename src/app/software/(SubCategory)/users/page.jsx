"use client";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";


export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

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
            cache:
              "no-store",
          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        setError(
          data.message ||
          "Failed to load users"
        );

        return;

      }


      setUsers(
        data.users || []
      );


    } catch (error) {

      console.error(
        "Get Users Error:",
        error
      );


      setError(
        "Failed to load users"
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getUsers();

  }, []);


  // =========================
  // SELECT ROLE
  // =========================

  const handleRoleChange = (
    userId,
    role
  ) => {

    setUsers(
      (current) =>
        current.map(
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

      const newRole =
        user.selectedRole ||
        user.role;


      if (
        newRole ===
        user.role
      ) {

        await Swal.fire({
          title: "No Change",
          text:
            "Select another role first.",
          icon: "info",
        });

        return;

      }


      // =========================
      // CONFIRM
      // =========================

      const result =
        await Swal.fire({

          title:
            "Change Role?",

          text:
            `${user.name}: ${user.role} → ${newRole}`,

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, Update",

          cancelButtonText:
            "Cancel",

        });


      if (
        !result.isConfirmed
      ) {
        return;
      }


      try {

        setUpdatingId(
          user.id
        );


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
        // ERROR
        // =========================

        if (!res.ok) {

          await Swal.fire({

            title:
              "Failed",

            text:
              data.message ||
              "Failed to update role",

            icon:
              "error",

          });


          return;

        }


        // =========================
        // UPDATE TABLE
        // =========================

        setUsers(
          (current) =>
            current.map(
              (currentUser) =>
                currentUser.id ===
                user.id
                  ? {
                      ...currentUser,

                      role:
                        data.user.role,

                      staffVerified:
                        data.user.staffVerified,

                      selectedRole:
                        undefined,
                    }
                  : currentUser
            )
        );


        // =========================
        // NEW PASSWORD GENERATED
        // =========================

        if (
          data.passwordGenerated
        ) {

          // SMS successful
          if (
            data.passwordSent
          ) {

            await Swal.fire({

              title:
                "Updated!",

              text:
                `Role changed to ${data.user.role}. A new 4-digit password was sent to ${data.user.mobile}.`,

              icon:
                "success",

            });


            return;

          }


          // =========================
          // SMS FAILED
          // Show Admin password
          // =========================

          await Swal.fire({

            title:
              "Role Updated",

            html: `
              <div style="text-align:center">
                <p>
                  Role changed to
                  <b>${data.user.role}</b>.
                </p>

                <p style="margin-top:10px">
                  SMS could not be sent.
                </p>

                <p style="margin-top:12px">
                  Temporary Password:
                </p>

                <div style="
                  font-size:28px;
                  font-weight:700;
                  margin-top:5px;
                ">
                  ${data.temporaryPassword}
                </div>
              </div>
            `,

            icon:
              "warning",

          });


          return;

        }


        // =========================
        // NORMAL ROLE CHANGE
        // =========================

        await Swal.fire({

          title:
            "Updated!",

          text:
            "User role updated successfully.",

          icon:
            "success",

          timer:
            1400,

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
            "Something went wrong.",

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

      <div className="flex min-h-60 items-center justify-center">

        <span className="loading loading-spinner loading-lg text-blue-600" />

      </div>

    );

  }


  // =========================
  // UI
  // =========================

  return (

    <div className="mx-auto max-w-6xl">


      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-5">

        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">

          View Users

        </h1>


        <p className="mt-1 text-sm text-slate-500">

          Manage customer and staff roles.

        </p>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          role="alert"
          className="alert alert-error mb-4"
        >

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =========================
          CARD
      ========================= */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">


        {/* TOP */}

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">

          <div>

            <h2 className="font-semibold text-slate-700">

              Users

            </h2>


            <p className="text-xs text-slate-400">

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


            <thead className="bg-blue-50 text-slate-600">

              <tr>

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


            <tbody>


              {!users.length ? (

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-slate-400"
                  >

                    No users found

                  </td>

                </tr>

              ) : (

                users.map(
                  (user) => (

                    <tr
                      key={
                        user.id
                      }
                      className="hover:bg-slate-50"
                    >


                      {/* =================
                          NAME
                      ================= */}

                      <td>

                        <div className="flex items-center gap-3">


                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">

                            {getInitial(
                              user.name
                            )}

                          </div>


                          <div>

                            <p className="font-semibold text-slate-700">

                              {user.name}

                            </p>


                            {!user.isActive && (

                              <p className="text-xs text-red-500">

                                Disabled

                              </p>

                            )}

                          </div>


                        </div>

                      </td>


                      {/* =================
                          MOBILE
                      ================= */}

                      <td className="font-medium text-slate-600">

                        {user.mobile}

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


                        {user.role ===
                        "admin" ? (

                          <div className="text-center">

                            <span className="badge badge-error badge-soft">

                              Protected Admin

                            </span>

                          </div>

                        ) : (

                          <div className="flex items-center justify-center gap-2">


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

                              className="btn btn-sm btn-info text-white"
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

      </div>

    </div>

  );
}


/* =========================
   ROLE BADGE
========================= */

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


/* =========================
   INITIAL
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
