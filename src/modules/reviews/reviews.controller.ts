import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; // customer must be logged in
        const mealId = req.params.mealId;
        const { rating, comment } = req.body;

        const review = await ReviewsService.createReview(userId, mealId as string, {
            rating,
            comment,
        });

        res.json({ success: true, review });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getReviews = async (req: Request, res: Response) => {
    try {
        const mealId = req.params.mealId;
        const reviews = await ReviewsService.getReviewsByMeal(mealId as string);
        res.json({ success: true, reviews });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};


const getReviewsProviderByMeal = async (req: Request, res: Response) => {
    try {
        const mealId = req.params.mealId;
        const providerId = req.user!.id; // auth middleware থেকে provider id

        const reviews = await ReviewsService.getReviewsProviderByMeal(mealId as string, providerId);

        res.json({ success: true, reviews });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all reviews (Admin)
const getAllReviewsbyAdmin = async (req: Request, res: Response) => {
    try {
        const reviews = await ReviewsService.getAllReviewsbyAdmin();
        res.json({ success: true, reviews });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete review (Admin)
const deleteReviewbyAdmin = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId;
        await ReviewsService.deleteReviewbyAdmin(reviewId as string);
        res.json({ success: true, message: "Review deleted" });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};


export const ReviewsController = {
    createReview,
    getReviews,
    getReviewsProviderByMeal,
    deleteReviewbyAdmin,
    getAllReviewsbyAdmin
};
