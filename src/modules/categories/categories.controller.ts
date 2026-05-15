import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoriesService.createCategory(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});

const getCategories = catchAsync(async (_req: Request, res: Response) => {
    const result = await CategoriesService.getAllCategories();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});

export const CategoriesController = {
    createCategory,
    getCategories
};
