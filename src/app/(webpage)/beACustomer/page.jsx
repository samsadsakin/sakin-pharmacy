"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  FaPhone,
  FaUser,
} from "react-icons/fa";


export default function BeCustomerPage() {

  const router =
    useRouter();


  // =========================
  // STATE
  // =========================

  const [mobile, setMobile] =
    useState("");

  const [name, setName] =
    useState("");

  const [userInfo, setUserInfo] =
    useState(null);

  const [checking, setChecking] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================
  // CLEAN MOBILE
  // =========================

  const cleanMobile =
    mobile.replace(
      /\D/g,
      ""
    );


  // =========================
  // FIND USER BY MOBILE
  // =========================

  useEffect(() => {

    if (
      cleanMobile.length !== 11
    ) {

      setUserInfo(null);

      setName("");

      setMessage("");

      setSuccess("");

      return;
    }


    const timer =
      setTimeout(
        async () => {

          try {

            setChecking(true);

            setMessage("");

            setSuccess("");


            const res =
              await fetch(
                `/api/auth/user-by-mobile?mobile=${encodeURIComponent(
                  cleanMobile
                )}`,
                {
                  cache:
                    "no-store",
                }
              );


            const data =
              await res.json();


            // =========================
            // ERROR
            // =========================

            if (!res.ok) {

              setUserInfo(null);

              setMessage(
                data.message ||
                  "Unable to check mobile number"
              );

              return;
            }


            // =========================
            // NEW USER
            // =========================

            if (!data.found) {

              setUserInfo({
                found: false,
                role: "customer",
              });

              setName("");

              return;
            }


            // =========================
            // EXISTING USER
            // =========================

            setUserInfo({
              found: true,
              ...data.user,
            });


            // Auto fill name
            setName(
              data.user.name || ""
            );


          } catch (error) {

            console.error(
              "User Search Error:",
              error
            );


            setMessage(
              "Unable to check mobile number"
            );


          } finally {

            setChecking(false);

          }

        },
        400
      );


    return () =>
      clearTimeout(timer);


  }, [cleanMobile]);


  // =========================
  // CUSTOMER STATUS
  // =========================

  const existingCustomer =
    userInfo?.found &&
    userInfo?.role ===
      "customer";


  const nonCustomer =
    userInfo?.found &&
    userInfo?.role !==
      "customer";


  // =========================
  // BE A CUSTOMER
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setMessage("");

      setSuccess("");


      // =========================
      // MOBILE VALIDATION
      // =========================

      if (
        cleanMobile.length !== 11 ||
        !cleanMobile.startsWith(
          "01"
        )
      ) {

        setMessage(
          "Enter a valid mobile number"
        );

        return;
      }


      // =========================
      // NAME VALIDATION
      // =========================

      if (!name.trim()) {

        setMessage(
          "Enter customer name"
        );

        return;
      }


      // =========================
      // NOT CUSTOMER
      // =========================

      if (nonCustomer) {

        setMessage(
          `This mobile belongs to a ${userInfo.role} account.`
        );

        return;
      }


      try {

        setSaving(true);


        // =========================
        // CREATE / UPDATE CUSTOMER
        // =========================

        const res =
          await fetch(
            "/api/auth/customer",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  name:
                    name.trim(),

                  mobile:
                    cleanMobile,
                }),
            }
          );


        const data =
          await res.json();


        // =========================
        // STAFF DETECTED
        // =========================

        if (
          data.action ===
            "PASSWORD_REQUIRED" ||
          data.action ===
            "OTP_REQUIRED"
        ) {

          setMessage(
            data.message
          );

          return;
        }


        // =========================
        // ERROR
        // =========================

        if (!res.ok) {

          setMessage(
            data.message ||
              "Unable to continue"
          );

          return;
        }


        // =========================
        // SUCCESS
        // =========================

        setUserInfo({
          found: true,

          name:
            data.user.name,

          mobile:
            data.user.mobile,

          role:
            data.user.role,

          staffVerified:
            false,
        });


        setName(
          data.user.name
        );


        if (data.created) {

          setSuccess(
            "Welcome! You are now a customer."
          );

        } else if (
          data.updated
        ) {

          setSuccess(
            "Customer name updated successfully."
          );

        } else {

          setSuccess(
            "Welcome back!"
          );

        }


        // =========================
        // REDIRECT TO HOME
        // =========================

        router.replace("/");

        router.refresh();

        return;


      } catch (error) {

        console.error(
          "Customer Error:",
          error
        );


        setMessage(
          "Something went wrong"
        );


      } finally {

        setSaving(false);

      }

    };


  // =========================
  // UI
  // =========================

  return (

    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">


      <div className="card w-full max-w-sm bg-base-100 shadow-lg">


        <div className="card-body p-6 sm:p-8">


          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-4 text-center">


            <h1 className="text-2xl font-bold text-sky-700">
              Be a Customer
            </h1>


            <p className="mt-1 text-sm text-slate-500">
              Enter your mobile number to continue
            </p>


          </div>


          {/* =========================
              FORM
          ========================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >


            {/* =========================
                MOBILE
            ========================= */}

            <fieldset className="fieldset">


              <legend className="fieldset-legend">
                Mobile Number
              </legend>


              <label className="input input-bordered flex w-full items-center gap-2">


                <FaPhone className="text-xs text-slate-400" />


                <input
                  type="tel"

                  value={
                    mobile
                  }

                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          11
                        );


                    setMobile(
                      value
                    );

                  }}

                  placeholder="01XXXXXXXXX"

                  inputMode="numeric"

                  autoComplete="tel"

                  className="grow"

                  required
                />


                {checking && (

                  <span className="loading loading-spinner loading-xs" />

                )}


              </label>


            </fieldset>


            {/* =========================
                NAME
            ========================= */}

            <fieldset className="fieldset">


              <legend className="fieldset-legend">
                Customer Name
              </legend>


              <label className="input input-bordered flex w-full items-center gap-2">


                <FaUser className="text-xs text-slate-400" />


                <input
                  type="text"

                  value={
                    name
                  }

                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }

                  placeholder={
                    cleanMobile.length === 11
                      ? "Enter your name"
                      : "Enter mobile number first"
                  }

                  autoComplete="name"

                  className="grow"

                  disabled={
                    cleanMobile.length !== 11 ||
                    checking ||
                    nonCustomer
                  }

                  required
                />


              </label>


              {/* Existing Customer */}

              {existingCustomer && (

                <p className="mt-1 text-xs text-emerald-600">
                  Existing customer found
                </p>

              )}


              {/* New Customer */}

              {userInfo?.found ===
                false && (

                <p className="mt-1 text-xs text-sky-600">
                  New customer
                </p>

              )}


            </fieldset>


            {/* =========================
                STAFF ACCOUNT
            ========================= */}

            {nonCustomer && (

              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">

                This mobile number belongs
                to a{" "}

                <span className="font-semibold capitalize">
                  {userInfo.role}
                </span>{" "}

                account.

                <p className="mt-1 text-xs">
                  Staff login will be
                  available from the next
                  authentication step.
                </p>

              </div>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {message && (

              <div className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">

                {message}

              </div>

            )}


            {/* =========================
                SUCCESS
            ========================= */}

            {success && (

              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">

                {success}

              </div>

            )}


            {/* =========================
                BUTTON
            ========================= */}

            <button
              type="submit"

              disabled={
                saving ||
                checking ||
                cleanMobile.length !==
                  11 ||
                !name.trim() ||
                nonCustomer
              }

              className="btn btn-info w-full text-white"
            >


              {saving ? (

                <>

                  <span className="loading loading-spinner loading-sm" />

                  Please wait...

                </>

              ) : (

                "Be a Customer"

              )}


            </button>


          </form>


        </div>


      </div>


    </main>

  );
}