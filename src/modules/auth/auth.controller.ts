import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    const { accessToken, user } = result;

    res.cookie("accessToken", accessToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            user,
        },
    });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const result = await AuthService.googleLogin(idToken);
    const { accessToken, user } = result;

    res.cookie("accessToken", accessToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in with Google successfully",
        data: {
            accessToken,
            user,
        },
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await AuthService.getMe(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

export const AuthController = {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    getMe,
};
