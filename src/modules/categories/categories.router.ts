import express, { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.ADMIN),
    CategoriesController.createCategory
);

router.get(
    "/",
    CategoriesController.getCategories
);

export const categoriesRouter: Router = router;
