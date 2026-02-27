import { prisma } from "../../lib/prisma";

const createOrder = async (userId: string, payload: any) => {
    const { items, delivery_address } = payload;

    if (!items || items.length === 0) {
        throw new Error("Order items required");
    }

    if (!delivery_address) {
        throw new Error("Delivery address required");
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
        const meal = await prisma.meals.findUnique({
            where: { id: item.mealId },
        });

        if (!meal) throw new Error("Meal not found");

        totalPrice += Number(meal.price) * item.quantity;

        orderItemsData.push({
            meal_id: meal.id,
            customer_id: userId,
            quantity: item.quantity,
            price_at_order: meal.price,
        });
    }

    // ✅ create order with actual delivery_address
    const order = await prisma.orders.create({
        data: {
            customer_id: userId,
            delivery_address: delivery_address, // 👈 make sure this is a string
            total_price: totalPrice,
            orderItems: { create: orderItemsData },
        },
        include: { orderItems: true },
    });

    return order;
};
const getMyOrders = async (userId: string) => {
    return prisma.orders.findMany({
        where: {
            customer_id: userId,
        },
        include: {
            orderItems: {
                include: {
                    meal: {
                        select: {
                            name: true,
                            price: true,
                        },
                    },
                },
            },
        },
    });
};

const getAllOrders = async () => {
    return prisma.orders.findMany({
        include: {
            orderItems: true,
        },
    });
};

export const OrdersService = {
    createOrder,
    getMyOrders,
    getAllOrders,
};
