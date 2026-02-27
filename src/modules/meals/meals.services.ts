import { includes } from "better-auth";
import { prisma } from "../../lib/prisma"


const createMeal = async (userId: string, data: any) => {

    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId },

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

const getMyMeals = async (userId: string) => {
    // ১. প্রথমে এই ইউজার আইডির বিপরীতে প্রোভাইডার প্রোফাইলটি খুঁজুন
    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId } // আপনার স্কিমা অনুযায়ী user_id বা id
    });

    if (!provider) {
        throw new Error("প্রোভাইডার প্রোফাইল পাওয়া যায়নি!");
    }

    // ২. এবার প্রোভাইডার আইডি দিয়ে খাবারগুলো খুঁজুন
    const meals = await prisma.meals.findMany({
        where: {
            provider_id: provider.id // আসল প্রোভাইডার আইডি ব্যবহার হচ্ছে
        },
        include: {
            category: true
        }
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