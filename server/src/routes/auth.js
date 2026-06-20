import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { Router } from "express";

const router = Router();

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (findUser) {
      return res.status(400).json({ message: `Email already exists` });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPass,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const accessToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ newUser, accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!findEmail) {
      return res.status(400).json({ message: `Invalid Credentials` });
    }

    const checkPass = await bcrypt.compare(password, findEmail.password);
    if (!checkPass) {
      return res.status(400).json({ message: `Invalid Credentials` });
    }

    const accessToken = jwt.sign(
      { id: findEmail.id, email: findEmail.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const { password: _, ...safeUser } = findEmail;
    res.status(200).json({ user: safeUser, accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
