import express from "express";
import morgan from "morgan";
// Routes
import userRoutes from "./routes/v1/user.routes";
import eventRoutes from "./routes/v1/event.routes";

const app = express();
const cors = require('cors');

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);

export default app;
