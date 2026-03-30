import express from "express";

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import DbConnection from "./config/database.js";
import routes from "./Routers/authRoutes.js";
import rateLimit from "express-rate-limit";
import blogRoutes from "./Routers/blogRoutes.js";
//database connection
DbConnection();
const app = express();
const PORT = process.env.PORT || 8000;
//middleware
app.use(express.json());
app.use(helmet());



app.use(cors({
  origin: "https://blogwebapp-omega.vercel.app",
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("API is running ");
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10000, //it can accessed 10000 times in 15 minutes
});
app.use(limiter);
//import routes
app.use("/api/auth", routes);
app.use("/api/blog",blogRoutes)

app.listen(PORT, () => console.log("Server is running"));
