import express, { Router } from "express"
import auth from "../../middlewares/auth"
import { MealsController } from "./meals.controller"
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router()

router.post(
    "/",
    auth(UserRole.PROVIDER),
    MealsController.createMeal
);

router.get(
    "/mymeals",
    auth(UserRole.PROVIDER),
    MealsController.getMyMeals
)

router.get(
    "/",
    MealsController.getAllPublicMeals
)

router.get(
    "/:id",
    MealsController.getSingleMeal
)
export const MealsRoutes: Router = router;