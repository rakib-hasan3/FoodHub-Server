import { prisma } from "../../lib/prisma";

const createReview = async (userId: string, mealId: string, data: any) => {
    // Check if user already reviewed this meal
    const existing = await prisma.reviews.findFirst({
        where: {
            customer_id: userId,
            meal_id: mealId,
        },
    });

    if (existing) {
        throw new Error("You have already reviewed this meal");
    }

    const review = await prisma.reviews.create({
        data: {
            customer_id: userId,
            meal_id: mealId,
            rating: data.rating,
            comment: data.comment,
        },
    });

    return review;
};

const getReviewsByMeal = async (mealId: string) => {
    const reviews = await prisma.reviews.findMany({
        where: { meal_id: mealId },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });

    return reviews;
};

const getReviewsProviderByMeal = async (mealId: string, providerId: string) => {
    // Check if this meal belongs to this provider
    const meal = await prisma.meals.findUnique({
        where: { id: mealId },
        select: { provider_id: true },
    });

    if (!meal) throw new Error("Meal not found");
    if (meal.provider_id !== providerId) throw new Error("Not authorized to view reviews");

    // Get reviews for this meal
    const reviews = await prisma.reviews.findMany({
        where: { meal_id: mealId },
        include: {
            customer: { select: { name: true, email: true } },
        },
        orderBy: { created_at: "desc" },
    });

    return reviews;
};

const getAllReviewsbyAdmin = async () => {
    const reviews = await prisma.reviews.findMany({
        include: {
            customer: { select: { name: true, email: true } },
            meal: { select: { name: true, provider_id: true } },
        },
        orderBy: { created_at: "desc" },
    });

    return reviews;
};

// Optional: delete review
const deleteReviewbyAdmin = async (reviewId: string) => {
    return await prisma.reviews.delete({
        where: { id: reviewId },
    });
};


export const ReviewsService = {
    createReview,
    getReviewsByMeal,
    getReviewsProviderByMeal,
    getAllReviewsbyAdmin,
    deleteReviewbyAdmin
};
