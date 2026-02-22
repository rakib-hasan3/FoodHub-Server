import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getProviderOrders = async (userId: string) => {
    //   provider profile
    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: userId }
    });

    if (!provider) {
        throw new Error("Provider profile not found");
    }

    //   provider meals → order items → orders
    const orderItems = await prisma.order_items.findMany({
        where: {
            meal: {
                provider_id: provider.id
            }
        },
        include: {
            orders: true,
            meal: {
                select: {
                    name: true,
                    price: true
                }
            },
            customer: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    return orderItems;
};

const allowedStatusFlow: Record<string, OrderStatus[]> = {
    PLACED: [OrderStatus.PREPARING],
    PREPARING: [OrderStatus.READY],
};


const updateOrderStatus = async (
    providerUserId: string,
    orderId: string,
    newStatus: OrderStatus
) => {
    //  provider profile
    const provider = await prisma.provider_Profile.findUnique({
        where: { user_id: providerUserId },
    });

    if (!provider) {
        throw new Error("Provider profile not found");
    }

    //  order + items + meals
    const order = await prisma.orders.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    meal: true,
                },
            },
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    //   check order belongs to this provider
    const isProviderOrder = order.orderItems.some(
        (item) => item.meal.provider_id === provider.id
    );

    if (order.status === OrderStatus.READY) {
        throw new Error("Order already completed");
    }
    if (!isProviderOrder) {
        throw new Error("You are not allowed to update this order");
    }

    //   validate status flow
    const allowedNext = allowedStatusFlow[order.status];

    if (!allowedNext || !allowedNext.includes(newStatus)) {
        throw new Error(
            `Invalid status transition from ${order.status} to ${newStatus}`
        );
    }

    //   update
    const updatedOrder = await prisma.orders.update({
        where: { id: orderId },
        data: { status: newStatus },
    });

    return updatedOrder;
};


export const ProviderOrderService = {
    getProviderOrders,
    updateOrderStatus
};
