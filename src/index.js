import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  });
  app.on("error",(error)=>{
    console.log("Error in app:", error);
  })
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1); // Exit the process if the connection fails
});