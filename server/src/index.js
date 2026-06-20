import express from "express";
import Server from "socket.io";
import cors from "cors";
import "dotenv/config";
import ProjectRouter from "./routes/projects.js";
import TaskRouter from "./routes/tasks.js";
import CommentsRouter from "./routes/comments.js";
import notificationsRouter from "./routes/notifications.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/boards", TaskRouter);
app.use("/api/tasks", TaskRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/tasks", CommentsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
