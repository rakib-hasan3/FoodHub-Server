import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
};

const updateUserRole = async (userId: string, role: UserRole) => {
    return prisma.user.update({
        where: { id: userId },
        data: { role },
    });
};

const updateUserStatus = async (userId: string, status: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { status },
    });
};

export const AdminUserService = {
    getAllUsers,
    updateUserRole,
    updateUserStatus,
};
