import { profile } from "node:console";
import { OrderStatus, Provider_Profile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProviderProfile = async (data: Provider_Profile, userId: string) => {
    const result = await prisma.provider_Profile.create({
        data: {
            ...data,
            user_id: userId
        }
    })
    return result;
}

const getProviderProfile = async () => {
    const Profile = await prisma.provider_Profile.findFirst();
    return Profile;
}
const getAllSystemStatsForAdmin = async () => {
    const providers = await prisma.provider_Profile.findMany({
        include: {
            _count: {
                select: { meals: true }
            },
            meals: {
                include: {
                    orderItems: {
                        include: {
                            orders: true
                        }
                    },
                    category: true // ক্যাটাগরি নাম দেখানোর জন্য
                }
            }
        }
    });

    return providers.map(p => {
        let totalRevenue = 0;
        let activeOrdersCount = 0;
        let totalOrdersCount = 0;

        p.meals.forEach(meal => {
            meal.orderItems.forEach(item => {
                if (item.orders) {
                    totalOrdersCount++;
                    // Active Orders (PLACED, PREPARING, READY)
                    if (['PLACED', 'PREPARING', 'READY'].includes(item.orders.status)) {
                        activeOrdersCount++;
                    }
                    // Total Revenue from Delivered orders
                    if (item.orders.status === 'DELIVERED') {
                        totalRevenue += Number(item.price_at_order) * item.quantity;
                    }
                }
            });
        });

        return {
            id: p.id,
            restaurantName: p.restaurant_name,
            address: p.address,
            totalMeals: p._count.meals,
            totalOrders: totalOrdersCount,
            activeOrders: activeOrdersCount,
            totalRevenue: totalRevenue,
            // প্রতিটি খাবারের ডিটেইলস এবং স্ট্যাটাস এখানে আসবে
            meals: p.meals.map(m => ({
                id: m.id,
                name: m.name,
                price: Number(m.price),
                status: m.status, // AVAILABLE or UNAVAILABLE
                category: m.category.name,
                image: m.image_url
            }))
        };
    });
};
const updateProviderStatus = async (id: string, is_active: boolean) => {
    return await prisma.provider_Profile.update({
        where: { id },
        data: { is_active }
    });
};

const getAllProviders = async () => {
    try {
        const providers = await prisma.provider_Profile.findMany({
            include: {
                _count: { select: { meals: true } },
                meals: {
                    include: {
                        orderItems: {
                            include: { orders: true },
                        },
                    },
                },
            },
        });

        return providers.map((p) => {
            let totalRevenue = 0;
            let activeOrdersCount = 0;
            let totalOrdersCount = 0;

            p.meals.forEach((meal) => {
                meal.orderItems.forEach((item) => {
                    if (item.orders) {
                        totalOrdersCount++;
                        if (["PLACED", "PREPARING", "READY"].includes(item.orders.status)) {
                            activeOrdersCount++;
                        }
                        if (item.orders.status === "DELIVERED") {
                            totalRevenue += Number(item.price_at_order) * item.quantity;
                        }
                    }
                });
            });

            return {
                id: p.id,
                restaurantName: p.restaurant_name,
                address: p.address,
                contactNumber: p.contact_number,
                image: p.image || "/default-restaurant.png", // default image
                totalMeals: p._count.meals,
                totalOrders: totalOrdersCount,
                activeOrders: activeOrdersCount,
                totalRevenue,
            };
        });
    } catch (error) {
        throw new Error("Error fetching providers");
    }
};
const getSingleProviderStats = async (providerId: string) => {
    // ১. প্রোভাইডারের প্রোফাইল নেওয়া
    console.log("searching for provider  id :", providerId)
    const profile = await prisma.provider_Profile.findUnique({
        where: { id: providerId }
    });

    // ২. ওই প্রোভাইডারের সব খাবার (Meals) নেওয়া এবং সাথে ক্যাটাগরি ইনক্লুড করা
    const meals = await prisma.meals.findMany({
        where: { provider_id: providerId },
        include: {
            category: true // যাতে খাবারের ক্যাটাগরির নাম দেখা যায়
        }
    });

    return {
        ...profile,
        meals: meals.map(meal => ({
            ...meal,
            category: meal.category.name // ক্যাটাগরি অবজেক্ট থেকে শুধু নামটা নিয়ে আসা
        }))
    };
};

export const providerService = {
    createProviderProfile,
    getProviderProfile,
    getAllSystemStatsForAdmin,
    updateProviderStatus,
    getSingleProviderStats,
    getAllProviders
}