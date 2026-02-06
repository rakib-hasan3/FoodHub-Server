import { prisma } from "../../lib/prisma";

const createOrder = async (userId: string, payload: any) => {
    const { items, delivery_address } = payload;
    /**
     items = [
       { meal_id: string, quantity: number }
     ]
    */

    if (!items || items.length === 0) {
        throw new Error("Order items required");
    }

    let totalPrice = 0;

    // meal price 
    const orderItemsData = [];

    for (const item of items) {
        const meal = await prisma.meals.findUnique({
            where: { id: item.meal_id },
        });

        if (!meal) {
            throw new Error("Meal not found");
        }

        totalPrice += Number(meal.price) * item.quantity;

        orderItemsData.push({
            meal_id: meal.id,
            customer_id: userId,
            quantity: item.quantity,
            price_at_order: meal.price,
        });
    }

    // order create
    const order = await prisma.orders.create({
        data: {
            customer_id: userId,
            delivery_address,
            total_price: totalPrice,
            orderItems: {
                create: orderItemsData,
            },
        },
        include: {
            orderItems: true,
        },
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
