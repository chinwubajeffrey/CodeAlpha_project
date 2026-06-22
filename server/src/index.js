import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import ProjectRouter from "./routes/projects.js";
import TaskRouter from "./routes/tasks.js";
import CommentsRouter from "./routes/comments.js";
import notificationsRouter from "./routes/notifications.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-project", (projectId) => {
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined project room: ${projectId}`);
  });

  socket.on("leave-project", (projectId) => {
    socket.leave(projectId);
    console.log(`Socket ${socket.id} left project room: ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/boards", TaskRouter);
app.use("/api/tasks", TaskRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/tasks", CommentsRouter);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
