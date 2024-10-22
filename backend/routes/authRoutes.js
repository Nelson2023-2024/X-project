import { Router } from "express";

const router = Router();

router.post("/signup", async (req, res) => {});
router.post("/login", async (req, res) => {});
router.post("/logout", async (req, res) => {});

export { router as authRoutes };
