import { prisma } from "../../lib/prisma";

const createCategory = async (data: { name: string; image?: string }) => {
    const result = await prisma.categories.create({
        data
    });
    return result;
};

const getAllCategories = async () => {
    return prisma.categories.findMany({
        orderBy: { name: "asc" }
    });
};

export const CategoriesService = {
    createCategory,
    getAllCategories
};
