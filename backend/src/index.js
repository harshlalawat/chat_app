import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})

app.use("/api/auth", authRoutes);

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server is running on port: ${PORT}`);
})