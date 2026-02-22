import { includes } from "better-auth";
import { prisma } from "../../lib/prisma"


const createMeal = async (userId: string, data: any) => {

    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId }
    });
    if (!provider) {
        throw new Error("Provider profile not found")
    }

    const category = await prisma.categories.findUnique({
        where: { id: data.category_id }
    })
    const result = await prisma.meals.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            image_url: data.image_url,


            provider: {
                connect: { id: provider.id }
            },
            category: {
                connect: { id: data.category_id }
            }
        }
    })
    return result;
}

const getMyMeals = async (providerId: string) => {
    const meals = await prisma.meals.findMany({
        where: { provider_id: providerId },
        include: { category: true }
    });

    return meals;
};

const getAllPublicMeals = async () => {
    const meals = await prisma.meals.findMany({
        where: {
            status: "AVAILABLE"
        },
        include: {
            provider: {
                select: {
                    restaurant_name: true,
                    address: true
                }
            },
            category: { select: { name: true } as any }
        },


    })
    return meals;
};

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
            category: {
                select: { name: true }
            }

        }
    })
    if (!meal) {
        throw new Error("Meal not found");
    }
    return meal
}

export const MealsService = {
    createMeal,
    getMyMeals,
    getAllPublicMeals,
    getSingleMeal
}