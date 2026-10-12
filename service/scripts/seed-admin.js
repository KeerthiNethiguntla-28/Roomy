import "dotenv/config";
import mongoose from "mongoose";
import { register } from "../app/services/admin-user-service.js";
import AdminUser from "../app/models/admin-user.js";
const required = ["MONGO_CONNECTION_STRING", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
for (const key of required)
  if (!process.env[key]) throw new Error(`Missing ${key}`);
if (process.env.ADMIN_PASSWORD.length < 12)
  throw new Error("Use an admin password of at least 12 characters");
await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
try {
  if (await AdminUser.findOne({ email: process.env.ADMIN_EMAIL }))
    throw new Error("Admin already exists; no changes made");
  await register({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    firstName: process.env.ADMIN_FIRST_NAME || "Roomy",
    lastName: process.env.ADMIN_LAST_NAME || "Admin",
  });
  console.log("Admin created");
} finally {
  await mongoose.disconnect();
}
