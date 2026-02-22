import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { error } from "node:console";
import { prisma } from "../../lib/prisma";

const createProvider = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "unauthorized",

            })
        }

        // console.log(req.user);
        const result = await providerService.createProviderProfile(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e: any) {

        let errorMessage = "Post creation failed";
        if (e.code === 'P2002') {
            errorMessage = "Provider profile already exists for this user."
        }



        res.status(400).json({
            error: errorMessage,

        })
    }

}

const getProviderProfile = async (req: Request, res: Response) => {
    try {
        const result = await providerService.getProviderProfile()
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Get provider failed",
            details: e
        })

    }
}
export const updateProviderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const result = await providerService.updateProviderStatus(id as string, is_active);

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to update status"
        });
    }
};

export const getProviderStatsForAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ড্যাশবোর্ড থেকে পাঠানো প্রোভাইডার আইডি

        const stats = await providerService.getAllSystemStatsForAdmin();

        if (!stats) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            });
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
const getAllProviders = async (req: Request, res: Response) => {
    try {
        const providers = await prisma.provider_Profile.findMany({});
        if (!providers || providers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No providers found",
            });
        }

        res.status(200).json({
            success: true,
            data: providers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const ProviderController = {
    createProvider,
    getProviderProfile,
    getProviderStatsForAdmin,
    updateProviderStatus,
    getAllProviders

}