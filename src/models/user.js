import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
  {
    // =========================
    // CUSTOMER NAME
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },


    // =========================
    // MOBILE NUMBER
    // One mobile = one user
    // =========================

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },


    // =========================
    // USER ROLE
    // =========================

    role: {
      type: String,

      enum: [
        "customer",
        "salesman",
        "manager",
        "admin",
      ],

      default: "customer",
    },


    // =========================
    // STAFF PASSWORD
    // Customer does not need it
    // =========================

    passwordHash: {
      type: String,
      default: null,
    },


    // =========================
    // STAFF OTP VERIFIED?
    // =========================

    staffVerified: {
      type: Boolean,
      default: false,
    },


    // =========================
    // ACCOUNT STATUS
    // =========================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );


export default User;