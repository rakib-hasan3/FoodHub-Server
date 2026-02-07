import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getAllOrders = async () => {
    return await prisma.orders.findMany({
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
        orderBy: {
            created_at: "desc",
        },
    });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return await prisma.orders.update({
        where: { id: orderId },
        data: { status },
    });
};

const getDashboardStats = async () => {
    const [
        totalUsers,
        totalProviders,
        totalMeals,
        totalOrders,
        revenue,
        orderStats
    ] = await Promise.all([
        prisma.user.count(),
        prisma.provider_Profile.count(),
        prisma.meals.count(),
        prisma.orders.count(),

        prisma.orders.aggregate({
            _sum: {
                total_price: true
            }
        }),

        prisma.orders.groupBy({
            by: ["status"],
            _count: {
                _all: true
            }
        })
    ]);

    return {
        totalUsers,
        totalProviders,
        totalMeals,
        totalOrders,
        totalRevenue: revenue._sum.total_price || 0,
        ordersByStatus: orderStats
    };
};


export const AdminOrdersService = {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats
};
