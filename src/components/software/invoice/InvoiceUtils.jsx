// ================= DEFAULT DATA =================

export const emptyCustomer = {
  name: "",
  moreInfo: "",
  phone: "",
};

export const emptyMedicine = {
  medicine: "",
  qty: "",
  rate: "",
  dis: "",
};

export const defaultOptions = {
  sms: false,
  smsType: "short",
  print: true,
  paid: true,
};


// ================= CALCULATION =================

export const money = (value) =>
  Number(value || 0).toFixed(2);

export const getAmount = (row) => {
  const qty = Number(row.qty || 0);
  const rate = Number(row.rate || 0);
  const dis = Number(row.dis || 0);

  return qty * rate * (1 - dis / 100);
};


// ================= CUSTOMER FIELD =================

export function Field({ label, ...props }) {
  return (
    <label className="flex items-center gap-3">

      <span className="w-28 shrink-0 text-sm font-medium text-slate-600">
        {label}
      </span>

      <input
        {...props}
        className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-sky-300"
      />

    </label>
  );
}


// ================= MEDICINE INPUT =================

export function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg bg-white px-3 py-2.5 text-sm outline-none ring-1 ring-slate-200 focus:ring-sky-300"
    />
  );
}


// ================= TABLE =================

export function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left font-semibold ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 ${className}`}>
      {children}
    </td>
  );
}


// ================= LOCKED FIELD =================

export function LockedField({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-sm text-slate-600">
        {label}
      </span>

      <input
        type="text"
        value={value}
        readOnly
        className="w-32 cursor-not-allowed rounded-lg bg-slate-100 px-3 py-2 text-right text-sm text-slate-600 outline-none"
      />

    </div>
  );
}


// ================= CHECKBOX =================

export function CheckBox({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="h-4 w-4 accent-sky-700"
      />

      {label}

    </label>
  );
}


// ================= SMS BUTTON =================

export function OptionButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium ${
        active
          ? "bg-sky-700 text-white"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}