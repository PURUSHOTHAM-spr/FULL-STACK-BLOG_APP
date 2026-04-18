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

config(); //process.env

//Create express application
const app = exp();
//use cors middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//add body parser middleware
app.use(exp.json());
//add cookie parser middleware
app.use(cookieParser());

//connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

//connect to db
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    //start http server
    app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));
  } catch (err) {
    console.log("Err in DB connection", err);
  }
};

connectDB();

app.use((err, req, res, next) => {

  console.log("Error:", err);

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
  res.status(err.status || 500).json({
    message: err.message || "Server error",
    error: err.message
  });

});