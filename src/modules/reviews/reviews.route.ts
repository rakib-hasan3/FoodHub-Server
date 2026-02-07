import express from "express";
import { ReviewsController } from "./reviews.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

// Customer creates review (must be logged in)
router.post(
    "/:mealId",
    auth(UserRole.USER),
    ReviewsController.createReview
);

// Public: Get all reviews for a meal
router.get("/:mealId", ReviewsController.getReviews);

// Only provider can see reviews for their meals
router.get("/provider/reviews/:mealId", auth(UserRole.PROVIDER), ReviewsController.getReviewsProviderByMeal);



export const ReviewsRoutes = router;
