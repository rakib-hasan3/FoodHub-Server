import express, { Router } from "express"
import auth from "../../middlewares/auth"
import { MealsController } from "./meals.controller"
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router()

router.post(
    "/create",
    auth(UserRole.PROVIDER),
    MealsController.createMeal
);

router.get(
    "/my-meals/:id",
    // auth(UserRole.PROVIDER || UserRole.USER),
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