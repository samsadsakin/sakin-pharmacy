
"use client";

import { useState, useEffect } from "react";

function CountDate() {
  const [dhakaDate, setDhakaDate] = useState("");

  useEffect(() => {
    const getDhakaTime = () => {
      return new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    // Set immediately
    setDhakaDate(getDhakaTime());

    // Update every second
    const interval = setInterval(() => {
      setDhakaDate(getDhakaTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p>{dhakaDate}</p>;
}

export default CountDate;

