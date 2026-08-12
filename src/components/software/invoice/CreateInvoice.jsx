"use client";

import { useState } from "react";

import {
  emptyCustomer,
  emptyMedicine,
  defaultOptions,
  money,
  getAmount,
  Field,
  Input,
  Th,
  Td,
  LockedField,
  CheckBox,
  OptionButton,
} from "./InvoiceUtils";

let nextId = 1;

export default function Invoice() {

  // ================= INVOICE =================

  const invoiceInfo = {
    number: "9967",
    date: "2026-08-11",
  };



  // ================= CUSTOMER =================

  const [customer, setCustomer] =
    useState(emptyCustomer);


  // ================= MEDICINE =================

  const [item, setItem] =
    useState(emptyMedicine);

  const [rows, setRows] =
    useState([]);


  // ================= PAYABLE =================

  const [payable, setPayable] =
    useState("");


  // ================= OPTIONS =================

  const [options, setOptions] =
    useState(defaultOptions);


  // ================= CALCULATION =================

  // Row percentage discount already applied here
  const total = rows.reduce(
    (sum, row) =>
      sum + getAmount(row),
    0
  );

  // If payable is empty, payable = total
  const payableAmount =
    payable === ""
      ? total
      : Number(payable || 0);

  // Final manual discount
  const discount = Math.max(
    total - payableAmount,
    0
  );



  // ================= MEDICINE INPUT =================

  const updateItem = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };


  // ================= ADD MEDICINE =================

  const addMedicine = () => {
    if (
      !item.medicine ||
      !item.qty ||
      !item.rate
    ) {
      return;
    }

    setRows([
      ...rows,
      {
        id: nextId++,
        ...item,
      },
    ]);

    setItem(emptyMedicine);
  };


  // ================= DELETE =================

  const deleteMedicine = (id) => {
    setRows(
      rows.filter(
        (row) => row.id !== id
      )
    );
  };


  // ================= SAVE =================

  const saveInvoice = async () => {
    const data = {
      invoiceNo: invoiceInfo.number,
      date: invoiceInfo.date,

      customer,

      medicines: rows.map((row, index) => ({
        sl: index + 1,
        medicine: row.medicine,
        qty: Number(row.qty),
        rate: Number(row.rate),
        percentageDiscount: Number(row.dis || 0),
        amount: getAmount(row),
      })),

      total,
      discount,
      payableAmount,

      options: {
        sms: options.sms,

        ...(options.sms && {
          smsType: options.smsType,
        }),

        print: options.print,
        paid: options.paid,
      },
    };

    console.log("Invoice Data:", data);

    try {
      const res = await fetch("/api/software/invoices", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log("MongoDB Response:", result);

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Invoice saved successfully!");

      // ================= RESET =================
      setCustomer(emptyCustomer);
      setItem(emptyMedicine);
      setRows([]);
      setPayable("");
      setOptions(defaultOptions);

      nextId = 1;

    } catch (error) {
      console.error("Save Invoice Error:", error);

      alert("Failed to save invoice");
    }
  };


  // ================= UI =================

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-700 md:p-6">

      <div className="mx-auto max-w-6xl rounded-xl bg-white p-5 shadow-sm md:p-6">

        {/* Title */}
        <h1 className="mb-5 text-center text-xl font-semibold text-sky-700">
          Create Invoice
        </h1>


        {/* =================
            INVOICE NO / DATE
        ================= */}

        <div className="mb-6 flex items-center justify-between text-sm">

          <p>
            <span className="text-slate-500">
              Invoice No:
            </span>{" "}

            <span className="font-semibold text-sky-800">
              {invoiceInfo.number}
            </span>
          </p>


          <p>
            <span className="text-slate-500">
              Date:
            </span>{" "}

            <span className="font-medium text-slate-700">
              {invoiceInfo.date}
            </span>
          </p>

        </div>


        {/* =================
            CUSTOMER
        ================= */}

        <div className="mb-6 space-y-3">

          <div className="grid gap-3 md:grid-cols-2">

            <Field
              label="Name"
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  name: e.target.value,
                })
              }
            />


            <Field
              label="More Info"
              placeholder="More Information"
              value={customer.moreInfo}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  moreInfo:
                    e.target.value,
                })
              }
            />

          </div>


          <Field
            label="Phone Number"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
          />

        </div>


        {/* =================
            MEDICINE TABLE
        ================= */}

        <div className="overflow-x-auto rounded-xl shadow-sm ring-1 ring-slate-100">

          <table className="w-full text-sm">


            <thead className="bg-sky-50 text-slate-600">

              <tr>

                <Th className="text-center">
                  SL
                </Th>

                <Th>
                  Medicine
                </Th>

                <Th className="text-right">
                  Qty
                </Th>

                <Th className="text-right">
                  Rate
                </Th>

                <Th className="text-right">
                  Dis %
                </Th>

                <Th className="text-right">
                  Amount
                </Th>

                <Th className="text-center">
                  Action
                </Th>

              </tr>

            </thead>


            <tbody>

              {!rows.length ? (

                <tr>

                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    No medicine added
                  </td>

                </tr>

              ) : (

                rows.map(
                  (row, index) => (

                    <tr
                      key={row.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >

                      <Td className="text-center text-slate-400">
                        {index + 1}
                      </Td>


                      <Td className="font-medium">
                        {row.medicine}
                      </Td>


                      <Td className="text-right">
                        {row.qty}
                      </Td>


                      <Td className="text-right">
                        {money(
                          row.rate
                        )}
                      </Td>


                      <Td className="text-right">
                        {row.dis || 0}%
                      </Td>


                      <Td className="text-right font-semibold text-sky-800">
                        {money(
                          getAmount(row)
                        )}
                      </Td>


                      <Td className="text-center">

                        <button
                          type="button"
                          onClick={() =>
                            deleteMedicine(
                              row.id
                            )
                          }
                          className="rounded px-2 py-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          ✕
                        </button>

                      </Td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================
            BOTTOM
        ================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* =================
              ADD MEDICINE
          ================= */}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Add Medicine
            </h3>

            <div className="rounded-xl bg-sky-50 p-4">

              <div className="space-y-3">

                {/* Medicine */}
                <Input
                  name="medicine"
                  placeholder="Medicine"
                  value={item.medicine}
                  onChange={updateItem}
                />

                {/* Qty + Rate + Dis */}
                <div className="grid grid-cols-3 gap-3">

                  <Input
                    type="number"
                    name="qty"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={updateItem}
                  />

                  <Input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={updateItem}
                  />

                  <Input
                    type="number"
                    name="dis"
                    placeholder="Dis %"
                    value={item.dis}
                    onChange={updateItem}
                  />

                </div>

              </div>

              <button
                type="button"
                onClick={addMedicine}
                className="mt-3 w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                + Add Medicine
              </button>

            </div>
          </section>


          {/* =================
              RIGHT SIDE
          ================= */}

          <section>


            {/* =================
                CALCULATION
            ================= */}

            <div className="rounded-xl bg-slate-50 p-4">

              <h3 className="mb-4 text-sm font-semibold text-sky-800">
                Calculation
              </h3>


              <div className="space-y-3">


                {/* Total - Locked */}

                <LockedField
                  label="Total"
                  value={money(total)}
                />


                {/* Discount - Auto + Locked */}

                <LockedField
                  label="Discount"
                  value={money(discount)}
                />


                {/* Payable Amount - Editable */}

                <div className="flex items-center justify-between gap-4">

                  <span className="text-sm font-semibold text-slate-700">
                    Payable Amount
                  </span>


                  <input
                    type="number"
                    min="0"
                    max={total}
                    value={payable}
                    placeholder={money(total)}
                    onChange={(e) =>
                      setPayable(
                        e.target.value
                      )
                    }
                    className="w-32 rounded-lg bg-white px-3 py-2 text-right text-sm font-semibold text-sky-800 outline-none ring-1 ring-sky-200 focus:ring-sky-400"
                  />

                </div>

              </div>

            </div>


            {/* =================
                OPTIONS
            ================= */}

            <div className="mt-3 rounded-xl bg-sky-50 p-4">

              <h3 className="mb-3 text-sm font-semibold text-sky-800">
                Invoice Options
              </h3>


              <div className="flex flex-wrap items-center gap-5">

                {/* sms */}
                <CheckBox
                  label="SMS"
                  checked={options.sms}
                  onChange={(checked) =>
                    setOptions({
                      ...options,
                      sms: checked,
                    })
                  }
                />

                {options.sms && (
                  <div className="flex rounded-lg bg-white p-1">
                    <OptionButton
                      active={options.smsType === "short"}
                      onClick={() =>
                        setOptions({
                          ...options,
                          smsType: "short",
                        })
                      }
                    >
                      Short
                    </OptionButton>

                    <OptionButton
                      active={options.smsType === "long"}
                      onClick={() =>
                        setOptions({
                          ...options,
                          smsType: "long",
                        })
                      }
                    >
                      Long
                    </OptionButton>
                  </div>
                )}
                {/* Print */}

                <CheckBox
                  label="Print"
                  checked={options.print}
                  onChange={(checked) =>
                    setOptions({
                      ...options,
                      print: checked,
                    })
                  }
                />


                {/* Paid */}

                <CheckBox
                  label="Paid"
                  checked={options.paid}
                  onChange={(checked) =>
                    setOptions({
                      ...options,
                      paid: checked,
                    })
                  }
                />

              </div>

            </div>


            {/* =================
                SAVE
            ================= */}

            <button
              type="button"
              onClick={saveInvoice}
              disabled={!rows.length}
              className="mt-3 w-full rounded-lg bg-sky-700 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Invoice
            </button>

          </section>

        </div>

      </div>

    </main>
  );
}
