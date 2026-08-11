"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/software/Loading/Loading";

export default function SoftwareLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#123B6D]">
        Welcome to Sakin Pharmacy Software
      </h1>

      {children}
    </div>
  );
}