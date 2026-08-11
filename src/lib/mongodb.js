import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const MONGODB_URI =
  "mongodb+srv://samsadsakin:samsadsakin1A@sakin-pharmacy-db.ofoi5qb.mongodb.net/sakin_pharmacy?appName=Sakin-Pharmacy-DB";

export default async function connectDB() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB Connected");

  return mongoose;
}