import { Request, Response } from "express";
import { OrdersService } from "./order.services";


const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await OrdersService.createOrder(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await OrdersService.getMyOrders(userId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllOrders = async (_req: Request, res: Response) => {
    try {
        const result = await OrdersService.getAllOrders();

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const OrdersController = {
    createOrder,
    getMyOrders,
    getAllOrders,
};
