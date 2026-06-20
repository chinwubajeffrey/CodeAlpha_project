import { Router } from "express";
import { protect } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";

const router = Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const getNotification = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(getNotification);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
});

router.patch("/read-all", async (req, res) => {
  try {
    const readAll = await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: {
        read: true,
      },
    });

    return res.status(200).json(readAll);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
});

router.patch("/:id/read", async (req, res) => {
  const id = req.params.id;
  try {
    const markRead = await prisma.notification.update({
      where: { id: id },
      data: {
        read: true,
      },
    });
    return res.status(200).json(markRead);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
});

export default router;
