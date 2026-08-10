import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 8000;

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
