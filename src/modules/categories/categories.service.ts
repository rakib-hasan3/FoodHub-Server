import { prisma } from "../../lib/prisma";

const createCategory = async (name: string) => {
    const result = await prisma.categories.create({
        data: { name }
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
