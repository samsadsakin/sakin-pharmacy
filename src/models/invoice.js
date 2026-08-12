import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
  {
    sl: Number,
    medicine: String,
    qty: Number,
    rate: Number,
    percentageDiscount: Number,
    amount: Number,
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    moreInfo: String,
    phone: String,
  },
  { _id: false }
);

const OptionsSchema = new mongoose.Schema(
  {
    sms: Boolean,
    smsType: String,
    print: Boolean,
    paid: Boolean,
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNo: String,
    date: Date,

    customer: CustomerSchema,

    medicines: [MedicineSchema],

    total: Number,
    discount: Number,
    payableAmount: Number,

    options: OptionsSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);