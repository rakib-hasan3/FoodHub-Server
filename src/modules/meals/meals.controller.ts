import { Request, Response } from "express"
import { MealsService } from "./meals.services"
import { success } from "better-auth";


const createMeal = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await MealsService.createMeal(userId, req.body);

        res.status(201).json({
            success: true,
            messege: "Meal created successfully ",
            data: result
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getMyMeals = async (req: Request, res: Response) => {
    try {
        const providerId = req.params.providerId;
        const result = await MealsService.getMyMeals(providerId as string);

        res.status(200).json({
            success: true,
            messege: "Meal created successfully",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllPublicMeals = async (req: Request, res: Response) => {
    try {
        const result = await MealsService.getAllPublicMeals();

        res.status(200).json({
            success: true,
            message: "Meals retieved successfully ",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getSingleMeal = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MealsService.getSingleMeal(id as string);

    res.status(200).json({
        success: true,
        data: result
    })
}


export const MealsController = {
    createMeal,
    getMyMeals,
    getAllPublicMeals,
    getSingleMeal
}