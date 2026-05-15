// d:\Assignment Type Script project\foodhub-server\src\modules\meals\meals.services.ts

import { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError";
import { IMeal, IMealQuery } from "./meals.interface";

/**
 * Calculate discounted price helper
 */
const calculateDiscountPrice = (price: number, discountPercent: number): number => {
    return price - (price * (discountPercent / 100));
}

/**
 * Check if the meal belongs to the provider
 */
const checkMealOwnership = async (mealId: string, userId: string, role: string) => {
    if (role === UserRole.ADMIN) return true;

    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId }
    });

    if (!provider) {
        throw new AppError(403, "Provider profile not found.");
    }

    const meal = await prisma.meals.findUnique({
        where: { id: mealId },
        select: { provider_id: true }
    });

    if (!meal) {
        throw new AppError(404, "Meal not found.");
    }

    if (meal.provider_id !== provider.id) {
        throw new AppError(403, "You do not have permission to manage this meal.");
    }

    return true;
}

/**
 * Create new meal
 */
const createMeal = async (userId: string, data: IMeal) => {
    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId },
    });

    if (!provider) {
        throw new AppError(404, "Provider profile not found.");
    }

    const category = await prisma.categories.findUnique({
        where: { id: data.category_id }
    });

    if (!category) {
        throw new AppError(404, "Category not found.");
    }

    // Extract IDs to prevent them from being sent as direct fields alongside relations
    const { category_id, provider_id, ...restData } = data;

    // Calculate discount price if discountPercent is provided
    let discountPrice = null;
    let isDiscounted = data.isDiscounted || false;
    if (data.discountPercent && data.discountPercent > 0) {
        discountPrice = calculateDiscountPrice(Number(data.price), data.discountPercent);
        isDiscounted = true;
    }

    return await prisma.meals.create({
        data: {
            ...restData,
            price: new Prisma.Decimal(data.price),
            discountPrice: discountPrice ? new Prisma.Decimal(discountPrice) : null,
            isDiscounted,
            provider: { connect: { id: provider.id } },
            category: { connect: { id: category_id } }
        } as any 
    });
}

/**
 * Update meal (supports partial updates)
 */
const updateMeal = async (mealId: string, userId: string, role: string, data: Partial<IMeal>) => {
    await checkMealOwnership(mealId, userId, role);

    const isMealExist = await prisma.meals.findUnique({
        where: { id: mealId }
    });

    if (!isMealExist) {
        throw new AppError(404, "Meal not found.");
    }

    // Extract IDs to prevent them from being sent as direct fields alongside relations
    const { category_id, provider_id, ...restData } = data;

    // Recalculate discount if price or discountPercent changed
    let discountPrice = isMealExist.discountPrice;
    let isDiscounted = isMealExist.isDiscounted;
    const currentPrice = data.price || Number(isMealExist.price);
    const currentDiscountPercent = data.discountPercent !== undefined ? data.discountPercent : isMealExist.discountPercent;

    if (data.price !== undefined || data.discountPercent !== undefined) {
        if (currentDiscountPercent > 0) {
            discountPrice = new Prisma.Decimal(calculateDiscountPrice(currentPrice, currentDiscountPercent));
            isDiscounted = true;
        } else {
            discountPrice = null;
            isDiscounted = false;
        }
    }

    return await prisma.meals.update({
        where: { id: mealId },
        data: {
            ...restData,
            price: data.price ? new Prisma.Decimal(data.price) : undefined,
            discountPrice: discountPrice,
            isDiscounted,
            category: category_id ? { connect: { id: category_id } } : undefined
        } as any
    });
}

/**
 * Update discount for a meal
 */
const updateDiscount = async (mealId: string, userId: string, role: string, data: Partial<IMeal>) => {
    await checkMealOwnership(mealId, userId, role);

    const meal = await prisma.meals.findUnique({
        where: { id: mealId }
    });

    if (!meal) {
        throw new AppError(404, "Meal not found.");
    }

    const discountPercent = data.discountPercent !== undefined ? data.discountPercent : meal.discountPercent;
    const isDiscounted = data.isDiscounted !== undefined ? data.isDiscounted : (discountPercent > 0);
    
    let discountPrice = null;
    if (isDiscounted && discountPercent > 0) {
        discountPrice = new Prisma.Decimal(calculateDiscountPrice(Number(meal.price), discountPercent));
    } else {
        // If not discounted or percent is 0, clear discount fields
        discountPrice = null;
    }

    return await prisma.meals.update({
        where: { id: mealId },
        data: {
            discountPercent,
            discountPrice,
            isDiscounted: discountPrice !== null,
            offerText: data.offerText !== undefined ? data.offerText : meal.offerText,
            offerExpiresAt: data.offerExpiresAt !== undefined ? (data.offerExpiresAt ? new Date(data.offerExpiresAt) : null) : meal.offerExpiresAt,
        }
    });
}

/**
 * Remove discount from a meal
 */
const removeDiscount = async (mealId: string, userId: string, role: string) => {
    await checkMealOwnership(mealId, userId, role);

    const meal = await prisma.meals.findUnique({
        where: { id: mealId }
    });

    if (!meal) {
        throw new AppError(404, "Meal not found.");
    }

    return await prisma.meals.update({
        where: { id: mealId },
        data: {
            discountPercent: 0,
            discountPrice: null,
            isDiscounted: false,
            offerText: null,
            offerExpiresAt: null,
        }
    });
}

/**
 * Get all active offers (discounted meals)
 */
const getDiscountedMeals = async () => {
    const currentDate = new Date();
    
    return await prisma.meals.findMany({
        where: {
            isDiscounted: true,
            status: "AVAILABLE",
            OR: [
                { offerExpiresAt: { gt: currentDate } },
                { offerExpiresAt: null }
            ]
        },
        include: {
            provider: {
                select: {
                    restaurant_name: true,
                    image: true
                }
            },
            category: { select: { name: true } }
        },
        orderBy: {
            discountPercent: 'desc'
        }
    });
}

/**
 * Get provider's own meals
 */
const getMyMeals = async (userId: string) => {
    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId }
    });

    if (!provider) {
        throw new AppError(404, "Provider profile not found.");
    }

    return await prisma.meals.findMany({
        where: { provider_id: provider.id },
        include: { category: true }
    });
};

/**
 * Get all public available meals (with filtering and sorting)
 */
const getAllPublicMeals = async (query: IMealQuery = {}) => {
    const {
        featured,
        trending,
        isAvailable,
        isDiscounted,
        spiceLevel,
        sortBy,
        sortOrder = 'desc',
        searchTerm
    } = query;

    const where: any = {
        status: "AVAILABLE",
    };

    if (featured !== undefined) where.featured = featured === 'true';
    if (trending !== undefined) where.trending = trending === 'true';
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    
    if (isDiscounted === 'true') {
        where.isDiscounted = true;
        where.OR = [
            { offerExpiresAt: { gt: new Date() } },
            { offerExpiresAt: null }
        ];
    }

    if (spiceLevel) where.spiceLevel = spiceLevel;

    if (searchTerm) {
        where.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    const orderBy: any = {};
    if (sortBy) {
        orderBy[sortBy] = sortOrder;
    } else {
        orderBy.createdAt = 'desc';
    }

    return await prisma.meals.findMany({
        where,
        orderBy,
        include: {
            provider: {
                select: {
                    restaurant_name: true,
                    address: true
                }
            },
            category: { select: { name: true } }
        },
    });
};

/**
 * Get single meal details
 */
const getSingleMeal = async (id: string) => {
    const meal = await prisma.meals.findUnique({
        where: { id },
        include: {
            provider: {
                select: {
                    restaurant_name: true,
                    address: true
                }
            },
            category: { select: { name: true } }
        }
    });

    if (!meal) {
        throw new AppError(404, "Meal not found.");
    }
    return meal;
}

export const MealsService = {
    createMeal,
    updateMeal,
    updateDiscount,
    removeDiscount,
    getDiscountedMeals,
    getMyMeals,
    getAllPublicMeals,
    getSingleMeal
}
