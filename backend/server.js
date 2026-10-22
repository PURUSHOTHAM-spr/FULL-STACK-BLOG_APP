import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserApi.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminApi.js";
import { authorRoute } from "./APIs/AuthorApi.js";
import { commonRouter } from "./APIs/CommonApi.js";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import { validateRuntimeConfig } from "./config/runtime.js";

config(); //process.env

//Create express application
const app = exp();

const configuredOrigins = [
  "https://full-stack-blog-app-iota.vercel.app",
  "http://localhost:5173",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];
const allowedOrigins = new Set(configuredOrigins);
let server;

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser clients such as curl and server-to-server requests do not send Origin.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
    credentials: true,
  })
);

//add body parser middleware
app.use(exp.json());
//add cookie parser middleware
app.use(cookieParser());

app.use((req, res, next) => {
  const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
  const origin = req.get("Origin");

  if (
    unsafeMethods.has(req.method) &&
    req.cookies?.token &&
    origin &&
    !allowedOrigins.has(origin)
  ) {
    return res.status(403).json({ message: "Origin not allowed" });
  }

  next();
});

//connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

//connect to db
export const connectDB = async () => {
  try {
    validateRuntimeConfig();
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    //start http server
    const PORT = process.env.PORT || 4000;

    server = app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (err) {
    console.error("Unable to start server:", err.message);
    process.exitCode = 1;
  }
};

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.disconnect();
};

if (process.env.NODE_ENV !== "test") {
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

app.use((err, req, res, next) => {

  console.error("Request error:", err.message);

  // multer error (file too large, wrong type, etc.)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message
    });
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      error: err.message
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid value",
      error: err.message
    });
  }

  // duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: "Duplicate value",
      error: `${field} "${value}" already exists`
    });
  }

  // strict mode error
  if (err.name === "StrictModeError") {
    return res.status(400).json({
      message: "Invalid field",
      error: err.path
    });
  }

  // default error
  const status = err.status || 500;
  res.status(status).json({
    message: status < 500 ? err.message : "Server error",
  });

});

export { app };