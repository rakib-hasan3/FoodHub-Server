import { Request, Response } from "express";
import { ProviderOrderService } from "./providerOrder.service";

const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await ProviderOrderService.getProviderOrders(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const providerId = req.user!.id;

        const result = await ProviderOrderService.updateOrderStatus(
            providerId,
            orderId as string,
            status
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const ProviderOrderController = {
    getMyOrders,
    updateOrderStatus,
};
