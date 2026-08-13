"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";
import Swal from "sweetalert2";

import {
  FaPhone,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
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

  const [password, setPassword] =
    useState("");

  const [userInfo, setUserInfo] =
    useState(null);

  const [checking, setChecking] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);
  const [
    forgotLoading,
    setForgotLoading,
  ] = useState(false);


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

      setPassword("");

      setMessage("");

      setChecking(false);

      return;
    }


    const timer =
      setTimeout(
        async () => {
          try {
            setChecking(true);

            setMessage("");

            setPassword("");


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
  // USER TYPE
  // =========================

  const existingCustomer =
    userInfo?.found &&
    userInfo?.role ===
    "customer";


  const staffUser =
    userInfo?.found &&
    userInfo?.role !==
    "customer";


  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async () => {

    if (cleanMobile.length !== 11) {

      await Swal.fire({
        title: "Invalid Mobile",
        text: "Enter a valid mobile number first.",
        icon: "warning",
      });

      return;
    }


    // =========================
    // CONFIRM FIRST
    // =========================

    const confirm = await Swal.fire({

      title: "Forgot Password?",

      text: `Send a new 4-digit password to ${cleanMobile}?`,

      icon: "question",

      showCancelButton: true,

      confirmButtonText: "Yes, Send Password",

      cancelButtonText: "No",

      reverseButtons: true,

    });


    // User clicked No
    if (!confirm.isConfirmed) {
      return;
    }


    try {

      setForgotLoading(true);

      setMessage("");


      // =========================
      // API CALL
      // =========================

      const res = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mobile: cleanMobile,
          }),
        }
      );


      const data = await res.json();


      // =========================
      // FAILED
      // =========================

      if (!res.ok) {

        await Swal.fire({
          title: "Failed",
          text:
            data.message ||
            "Failed to send password.",
          icon: "error",
        });

        return;
      }


      // Clear old entered password
      setPassword("");


      // =========================
      // SUCCESS
      // =========================

      await Swal.fire({

        title: "Password Sent!",

        text:
          "A new 4-digit password has been sent to your registered mobile number.",

        icon: "success",

        confirmButtonText: "OK",

      });


    } catch (error) {

      console.error(
        "Forgot Password Error:",
        error
      );


      await Swal.fire({

        title: "Error",

        text:
          "Something went wrong. Please try again.",

        icon: "error",

      });


    } finally {

      setForgotLoading(false);

    }

  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();


      setMessage("");


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
      // NAME
      // =========================

      if (!name.trim()) {
        setMessage(
          "Enter your name"
        );

        return;
      }


      // =========================
      // STAFF LOGIN
      // =========================

      if (staffUser) {
        if (!password) {
          setMessage(
            "Enter your password"
          );

          return;
        }


        await handleStaffLogin();

        return;
      }


      // =========================
      // CUSTOMER
      // =========================

      await handleCustomer();

    };


  // =========================
  // CUSTOMER CREATE / LOGIN
  // =========================

  const handleCustomer =
    async () => {
      try {
        setSaving(true);

        setMessage("");


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


        if (!res.ok) {
          setMessage(
            data.message ||
            "Unable to continue"
          );

          return;
        }


        // =========================
        // CUSTOMER LOGIN SUCCESS
        // HOME
        // =========================

        router.replace("/");

        router.refresh();


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
  // STAFF / ADMIN LOGIN
  // =========================

  const handleStaffLogin =
    async () => {
      try {
        setSaving(true);

        setMessage("");


        const res =
          await fetch(
            "/api/auth/staff-login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  mobile:
                    cleanMobile,

                  name:
                    name.trim(),

                  password,
                }),
            }
          );


        const data =
          await res.json();


        // =========================
        // PASSWORD NOT SET
        // =========================

        if (
          data.action ===
          "PASSWORD_NOT_SET"
        ) {
          setMessage(
            "Password is not set yet. Use Forgot Password to receive a new password."
          );

          return;
        }


        if (!res.ok) {
          setMessage(
            data.message ||
            "Login failed"
          );

          return;
        }


        // =========================
        // STAFF SUCCESS
        // =========================

        router.replace(
          "/software/dashboard"
        );

        router.refresh();


      } catch (error) {
        console.error(
          "Staff Login Error:",
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
              {staffUser
                ? "Welcome Back"
                : "Be a Customer"}
            </h1>


            <p className="mt-1 text-sm text-slate-500">

              {staffUser
                ? "Enter your password to continue"
                : "Enter your mobile number to continue"}

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

                {staffUser
                  ? "Name"
                  : "Customer Name"}

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
                    cleanMobile.length ===
                      11
                      ? "Enter your name"
                      : "Enter mobile number first"
                  }

                  className="grow"

                  disabled={
                    cleanMobile.length !==
                    11 ||
                    checking
                  }

                  required
                />


              </label>


              {/* New Customer */}

              {userInfo?.found ===
                false && (

                  <p className="mt-1 text-xs text-sky-600">
                    New customer
                  </p>

                )}


              {/* Existing Customer */}

              {existingCustomer && (

                <p className="mt-1 text-xs text-emerald-600">
                  Existing customer found
                </p>

              )}


            </fieldset>


            {/* =========================
                STAFF ROLE
            ========================= */}

            {staffUser && (

              <div className="rounded-lg bg-sky-50 px-3 py-2">

                <p className="text-xs text-slate-500">
                  Account Type
                </p>

                <p className="text-sm font-semibold capitalize text-sky-700">
                  {userInfo.role}
                </p>

              </div>

            )}


            {/* =========================
                PASSWORD
                ONLY STAFF / ADMIN
            ========================= */}

            {staffUser && (

              <fieldset className="fieldset">


                <legend className="fieldset-legend">
                  Password
                </legend>


                <label className="input input-bordered flex w-full items-center gap-2">


                  <FaLock className="text-xs text-slate-400" />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={
                      password
                    }

                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }

                    placeholder="Enter 4-digit password"

                    inputMode="numeric"

                    autoComplete="current-password"

                    maxLength={4}

                    className="grow"

                    required
                  />


                  <button
                    type="button"

                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }

                    className="text-slate-400 hover:text-slate-600"
                  >

                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}

                  </button>


                </label>


                {/* Forgot Password */}

                <div className="mt-1 text-right">

                  <button
                    type="button"
                    onClick={
                      handleForgotPassword
                    }
                    disabled={
                      forgotLoading
                    }
                    className="text-xs font-medium text-sky-700 hover:underline disabled:opacity-50"
                  >
                    {forgotLoading
                      ? "Sending..."
                      : "Forgot Password?"}
                  </button>

                </div>


              </fieldset>

            )}


            {/* =========================
                MESSAGE
            ========================= */}

            {message && (

              <div className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">

                {message}

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
                (
                  staffUser &&
                  !password
                )
              }

              className="btn btn-info w-full text-white"
            >


              {saving ? (

                <>
                  <span className="loading loading-spinner loading-sm" />

                  Please wait...
                </>

              ) : staffUser ? (

                "Login"

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