import express from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 8000;

/*
 * Better Auth handler
 */
app.all("/api/auth/{*any}", toNodeHandler(auth));

/*
 * Mount express json middleware after Better Auth handler
 * or only apply it to routes that don't interact with Better Auth
 */

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: "Server is healthy",
  });
});

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
