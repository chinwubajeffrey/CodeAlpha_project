import { Router } from "express";
import prisma from "../lib/prisma.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.post("/:boardId/tasks", async (req, res) => {
  const id = req.params.boardId;
  const { title, description, dueDate, priority, assignedToId } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title: title,
        description: description,
        dueDate: dueDate,
        createdById: req.user.id,
        boardId: id,
        assignedToId: assignedToId,
        priority: priority,
      },
    });

    if (newTask.assignedToId) {
      const newNotification = await prisma.notification.create({
        data: {
          userId: assignedToId,
          message: `You have been assigned a task: ${title}`,
        },
      });
    }

    const io = req.app.get("io");
    const board = await prisma.board.findUnique({
      where: { id: id },
    });
    io.to(board.projectId).emit("task-updated", { id, task: newTask });

    return res.status(201).json({ newTask });
  } catch (error) {
    res.status(500).json(`Something Went wrong`);
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, dueDate, priority, assignedToId, boardId } =
    req.body;

  try {
    const updateTask = await prisma.task.update({
      where: { id: id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(priority && { priority }),
        ...(assignedToId && { assignedToId }),
        ...(boardId && { boardId }),
      },
    });

    const io = req.app.get("io");
    const board = await prisma.board.findUnique({
      where: { id: id },
    });
    io.to(board.projectId).emit("task-updated", { id, task: newTask });

    return res.status(200).json(updateTask);
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong` });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const findTask = await prisma.task.findUnique({
      where: { id: id },
      include: {
        board: {
          include: {
            project: {
              include: {
                memberships: {
                  where: {
                    userId: req.user.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!findTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    const membership = findTask.board.project.memberships[0];
    if (
      findTask.createdById !== req.user.id &&
      (!membership || membership.role !== "OWNER")
    ) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    const del = await prisma.task.delete({
      where: { id: id },
    });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong` });
  }
});

export default router;
