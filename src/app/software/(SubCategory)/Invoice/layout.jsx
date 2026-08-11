import InvoiceNav from "@/components/software/invoice/InvoiceNav";

export default function InvoiceLayout({ children }) {
  return (
    <>
      {/* Common Invoice Navigation */}
      <InvoiceNav />
      {/* Changeable Page */}
      {children}


    </>
  );
}