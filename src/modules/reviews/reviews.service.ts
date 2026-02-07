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

export const ReviewsService = {
    createReview,
    getReviewsByMeal,
};
