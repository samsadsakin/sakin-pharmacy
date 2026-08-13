import fs from "node:fs";
import path from "node:path";
import dns from "node:dns";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";


// =========================
// DNS FIX
// Same fix used by your app
// =========================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);


const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );


// =========================
// LOAD .env.local
// =========================

function loadEnvLocal() {

  const envPath =
    path.join(
      process.cwd(),
      ".env.local"
    );


  if (
    !fs.existsSync(
      envPath
    )
  ) {

    throw new Error(
      ".env.local not found in project root"
    );

  }


  const content =
    fs.readFileSync(
      envPath,
      "utf8"
    );


  for (
    const line
    of content.split(/\r?\n/)
  ) {

    const trimmed =
      line.trim();


    if (
      !trimmed ||
      trimmed.startsWith("#")
    ) {
      continue;
    }


    const equalIndex =
      trimmed.indexOf("=");


    if (
      equalIndex === -1
    ) {
      continue;
    }


    const key =
      trimmed
        .slice(
          0,
          equalIndex
        )
        .trim();


    let value =
      trimmed
        .slice(
          equalIndex + 1
        )
        .trim();


    if (
      (
        value.startsWith('"') &&
        value.endsWith('"')
      ) ||
      (
        value.startsWith("'") &&
        value.endsWith("'")
      )
    ) {

      value =
        value.slice(
          1,
          -1
        );

    }


    if (
      key &&
      process.env[key] ===
        undefined
    ) {

      process.env[key] =
        value;

    }

  }

}


// =========================
// CONVERT JSON DATE STRING
// TO REAL DATE
// =========================

function prepareInvoice(
  invoice
) {

  const invoiceDate =
    new Date(
      `${invoice.date}T00:00:00.000Z`
    );


  return {

    ...invoice,

    date:
      invoiceDate,

    createdAt:
      invoiceDate,

    updatedAt:
      invoiceDate,

  };

}


// =========================
// MAIN
// =========================

async function main() {

  try {

    loadEnvLocal();


    const MONGODB_URI =
      process.env.MONGODB_URI;


    if (!MONGODB_URI) {

      throw new Error(
        "MONGODB_URI is missing in .env.local"
      );

    }


    const dataPath =
      path.join(
        __dirname,
        "invoices-import-ready.json"
      );


    if (
      !fs.existsSync(
        dataPath
      )
    ) {

      throw new Error(
        "invoices-import-ready.json not found beside this script"
      );

    }


    const rawInvoices =
      JSON.parse(
        fs.readFileSync(
          dataPath,
          "utf8"
        )
      );


    console.log(
      `Prepared invoices: ${rawInvoices.length}`
    );


    await mongoose.connect(
      MONGODB_URI
    );


    console.log(
      "MongoDB Connected ✅"
    );


    const invoices =
      mongoose.connection.collection(
        "invoices"
      );


    // =========================
    // INDEX INFO
    // =========================

    const indexes =
      await invoices.indexes();


    const uniqueInvoiceIndex =
      indexes.find(
        (index) =>
          index.unique === true &&
          index.key &&
          index.key.invoiceNo === 1
      );


    if (
      uniqueInvoiceIndex
    ) {

      console.log(
        `invoiceNo unique index found: ${uniqueInvoiceIndex.name}`
      );

      console.log(
        "This safe import file contains one record per invoiceNo, so it can be imported."
      );

    }


    // =========================
    // BATCH IMPORT
    //
    // invoiceNo is used only
    // for the SAFE file.
    //
    // Existing invoice numbers
    // are never overwritten.
    // =========================

    const BATCH_SIZE = 500;

    let imported = 0;
    let alreadyExists = 0;


    for (
      let start = 0;
      start < rawInvoices.length;
      start += BATCH_SIZE
    ) {

      const batch =
        rawInvoices
          .slice(
            start,
            start +
              BATCH_SIZE
          )
          .map(
            prepareInvoice
          );


      const operations =
        batch.map(
          (invoice) => ({

            updateOne: {

              filter: {
                invoiceNo:
                  invoice.invoiceNo,
              },

              update: {
                $setOnInsert:
                  invoice,
              },

              upsert:
                true,

            },

          })
        );


      const result =
        await invoices.bulkWrite(
          operations,
          {
            ordered:
              false,
          }
        );


      const batchImported =
        result.upsertedCount ||
        0;


      imported +=
        batchImported;


      alreadyExists +=
        batch.length -
        batchImported;


      console.log(
        `Processed ${Math.min(
          start + BATCH_SIZE,
          rawInvoices.length
        )} / ${rawInvoices.length}`
      );

    }


    console.log("");
    console.log(
      "=============================="
    );
    console.log(
      "INVOICE IMPORT COMPLETE"
    );
    console.log(
      "=============================="
    );
    console.log(
      `Prepared invoices: ${rawInvoices.length}`
    );
    console.log(
      `New invoices imported: ${imported}`
    );
    console.log(
      `Already existed / unchanged: ${alreadyExists}`
    );
    console.log(
      "=============================="
    );


  } catch (error) {

    console.error(
      "Import Error:",
      error
    );

    process.exitCode = 1;


  } finally {

    await mongoose.disconnect();

  }

}


main();
