import { Request, Response } from "express";
import { AdminUserService } from "./adminUser.service";

const getAllUsers = async (_req: Request, res: Response) => {
    const users = await AdminUserService.getAllUsers();
    res.json({
        success: true,
        data: users,
    });
};

const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await AdminUserService.updateUserRole(id as string, role);

    res.json({
        success: true,
        message: "User role updated",
        data: user,
    });
};

const updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const user = await AdminUserService.updateUserStatus(id as string, status);

    res.json({
        success: true,
        message: "User status updated",
        data: user,
    });
};

export const AdminUserController = {
    getAllUsers,
    updateUserRole,
    updateUserStatus,
};
