// =========================
// SEND SMS
// =========================

export async function sendSMS({
  mobile,
  message,
}) {
  const token =
    process.env.BULK_SMS_TOKEN;


  if (!token) {
    throw new Error(
      "BULK_SMS_TOKEN is missing"
    );
  }


  const body =
    new URLSearchParams();


  body.append(
    "token",
    token
  );


  body.append(
    "to",
    formatMobile(mobile)
  );


  body.append(
    "message",
    message
  );


  const res = await fetch(
    "https://api.bdbulksms.net/api.php",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body,
    }
  );


  const result =
    await res.text();


  if (!res.ok) {
    throw new Error(
      `SMS failed: ${result}`
    );
  }


  console.log(
    "SMS Response:",
    result
  );


  return result;
}


// =========================
// FORMAT BD MOBILE
// =========================

function formatMobile(mobile) {
  const clean =
    String(mobile || "")
      .replace(/\D/g, "");


  // 01712345678
  if (
    clean.length === 11 &&
    clean.startsWith("01")
  ) {
    return `+88${clean}`;
  }


  // 8801712345678
  if (
    clean.length === 13 &&
    clean.startsWith("8801")
  ) {
    return `+${clean}`;
  }


  throw new Error(
    "Invalid mobile number"
  );
}