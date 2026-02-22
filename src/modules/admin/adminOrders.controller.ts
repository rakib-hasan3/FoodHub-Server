import { Request, Response } from "express";
import { AdminOrdersService } from "./adminOrders.service";
import { AdminUserService } from "../user-management/adminUser.service";

const getAllOrders = async (req: Request, res: Response) => {
    const result = await AdminOrdersService.getAllOrders();
    res.status(200).json({
        success: true,
        data: result,
    });
};

const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await AdminOrdersService.updateOrderStatus(id as string, status);

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
};


const getDashboardStats = async (req: Request, res: Response) => {
    const stats = await AdminOrdersService.getDashboardStats();

    res.status(200).json({
        success: true,
        data: stats
    });
};





export const AdminOrdersController = {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
};
