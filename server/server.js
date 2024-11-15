import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
// import path from "path";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173", // for dev and prod
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
