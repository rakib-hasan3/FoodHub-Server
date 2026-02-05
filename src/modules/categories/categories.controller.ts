import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await CategoriesService.createCategory(req.body.name);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: "Category creation failed" });
    }
};

const getCategories = async (_req: Request, res: Response) => {
    const result = await CategoriesService.getAllCategories();
    res.json({ success: true, data: result });
};

export const CategoriesController = {
    createCategory,
    getCategories
};
