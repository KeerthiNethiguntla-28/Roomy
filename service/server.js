import express from "express";
import dotenv from "dotenv";
import init from "./app/app.js";

dotenv.config();

const required = ["MONGO_CONNECTION_STRING", "JWT_SECRET", "CORS_ORIGINS"];
for (const key of required) {
  if (!process.env[key])
    throw new Error(`Missing required environment variable: ${key}`);
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
await init(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
