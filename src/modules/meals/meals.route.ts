import express, { Router } from "express"
import auth from "../../middlewares/auth"
import { MealsController } from "./meals.controller"
import { UserRole } from "@prisma/client";


const router = express.Router()

router.get(
    "/offers",
    MealsController.getDiscountedMeals
)

router.get(
    "/discounted",
    MealsController.getDiscountedMeals
)

router.post(
    "/create",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    MealsController.createMeal
);

router.patch(
    "/:id/update-discount",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    MealsController.updateDiscount
);

router.patch(
    "/:id/remove-discount",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    MealsController.removeDiscount
);

router.patch(
    "/:id",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    MealsController.updateMeal
)

router.get(
    "/my-meals/:providerId",
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