import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { error } from "node:console";

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

export const ProviderController = {
    createProvider,
    getProviderProfile
}