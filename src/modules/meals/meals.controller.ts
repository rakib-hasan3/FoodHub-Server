import { Request, Response } from "express"
import { MealsValidation } from "./meals.validation"
import { MealsService } from "./meals.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


const createMeal = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const validatedData = MealsValidation.createMealSchema.parse(req.body);
    const result = await MealsService.createMeal(userId, validatedData as any);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Meal created successfully",
        data: result
    });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;
    const validatedData = MealsValidation.updateMealSchema.parse(req.body);
    const result = await MealsService.updateMeal(id as string, userId, role, validatedData as any);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal updated successfully",
        data: result
    });
});

const getMyMeals = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.params.providerId;
    const result = await MealsService.getMyMeals(providerId as string);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meals retrieved successfully",
        data: result
    });
});

const getAllPublicMeals = catchAsync(async (req: Request, res: Response) => {
    const result = await MealsService.getAllPublicMeals(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meals retrieved successfully",
        data: result
    });
});

const updateDiscount = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;
    const validatedData = MealsValidation.updateDiscountSchema.parse(req.body);
    const result = await MealsService.updateDiscount(id as string, userId, role, validatedData as any);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Discount updated successfully",
        data: result
    });
});

const removeDiscount = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;
    const result = await MealsService.removeDiscount(id as string, userId, role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Discount removed successfully",
        data: result
    });
});

const getDiscountedMeals = catchAsync(async (req: Request, res: Response) => {
    const result = await MealsService.getDiscountedMeals();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Discounted meals retrieved successfully",
        data: result
    });
});

const getSingleMeal = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MealsService.getSingleMeal(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        data: result
    });
});


export const MealsController = {
    createMeal,
    updateMeal,
    updateDiscount,
    removeDiscount,
    getDiscountedMeals,
    getMyMeals,
    getAllPublicMeals,
    getSingleMeal
}