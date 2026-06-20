import { Router } from "express";
import prisma from "../lib/prisma.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, async (req, res) => {
  try {
    const findProjects = await prisma.project.findMany({
      where: {
        memberships: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            memberships: true,
            boards: true,
          },
        },
        memberships: {
          where: {
            userId: req.user.id,
          },
          select: { role: true },
        },
      },
    });

    return res.status(200).json(findProjects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProject = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: name,
          description: description,
        },
      });

      const member = await tx.projectMember.create({
        data: {
          userId: req.user.id,
          projectId: project.id,
          role: "OWNER",
        },
      });

      const boards = await tx.board.createMany({
        data: [
          { projectId: project.id, name: "To do", order: 0 },
          { projectId: project.id, name: "In progress", order: 1 },
          { projectId: project.id, name: "Done", order: 2 },
        ],
      });

      return project;
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  const id = req.params.id;
  try {
    const checkMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: id,
        },
      },
    });

    if (!checkMember) {
      return res.status(403).json({ message: `Access denied` });
    }

    const findProject = await prisma.project.findUnique({
      where: {
        id: id,
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        boards: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              include: {
                assignedTo: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                _count: {
                  select: {
                    comments: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!findProject) {
      return res.status(404).json({ message: `Project not found` });
    }
    return res.status(200).json({ findProject });
  } catch (error) {
    res.status(500).json({ message: `something went wrong` });
  }
});

router.post("/:id/members", protect, async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  try {
    const findEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!findEmail) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: findEmail.id,
          projectId: id,
        },
      },
    });
    if (checkMember) {
      return res
        .status(400)
        .json({ message: "User is already in the project" });
    }
    const addMember = await prisma.projectMember.create({
      data: {
        userId: findEmail.id,
        projectId: id,
      },
    });
    const sendNotification = await prisma.notification.create({
      data: {
        userId: findEmail.id,
        message: "You have been added to a project",
      },
    });

    return res.status(201).json({ message: addMember });
  } catch (error) {
    res.status(500).json({ message: `Things go wrong here` });
  }
});

router.delete("/:id", protect, async (req, res) => {
  const id = req.params.id;
  try {
    const checkMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: id,
        },
      },
    });

    if (!checkMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (checkMember.role !== "OWNER") {
      return res
        .status(403)
        .json({ message: "Only owner's can delete a project" });
    }

    const delProject = await prisma.project.delete({
      where: { id: id },
    });

    return res.status(200).json({ message: "Project deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: `Things go wrong here` });
  }
});

export default router;
