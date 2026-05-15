import express, { Router } from "express";
import { AIController } from "./ai.controller";

const router = express.Router();

router.post("/chat", AIController.chat);

export const AIRoutes: Router = router;
