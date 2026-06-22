import { Router } from "express";
import { protect } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";

const router = Router();
router.use(protect);

router.get("/:taskId/comments", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const getComment = await prisma.comment.findMany({
      where: { taskId: taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json(getComment);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
});

router.post("/:taskId/comments", async (req, res) => {
  const taskId = req.params.taskId;
  const { content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        taskId: taskId,
        content: content,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const io = req.app.get("io");
    const getTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: true,
      },
    });

    io.to(getTask.board.projectId).emit("new-comment", {
      taskId,
      comment: newComment,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
});

export default router;
