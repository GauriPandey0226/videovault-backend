import dotenv from "dotenv";
dotenv.config(); // No path needed if .env is in project root

import connectDB from "./db/index.js";

connectDB();