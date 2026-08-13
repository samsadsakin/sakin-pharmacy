import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const MONGODB_URI =
  process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing"
  );
}

export default async function connectDB() {
  if (
    mongoose.connection.readyState === 1
  ) {
    return mongoose;
  }

  await mongoose.connect(
    MONGODB_URI
  );

  console.log(
    "MongoDB Connected"
  );

  return mongoose;
}