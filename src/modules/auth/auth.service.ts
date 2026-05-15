import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { createToken } from "./auth.utils";
import { IJwtPayload } from "./auth.interface";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

const registerUser = async (payload: any) => {
    const isUserExists = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (isUserExists) {
        // If user exists but has no password (signed up via Google), allow them to set a password now
        if (!(isUserExists as any).password) {
            const hashedPassword = await bcrypt.hash(payload.password, 12);
            const result = await prisma.user.update({
                where: { email: payload.email },
                data: {
                    ...payload,
                    password: hashedPassword,
                },
            });
            const { password, ...userWithoutPassword } = result as any;
            return userWithoutPassword;
        }
        throw new AppError(400, "User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
        },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = result as any;
    return userWithoutPassword;
};

const loginUser = async (payload: any) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.status === "BLOCKED") {
        throw new AppError(403, "Your account is blocked");
    }

    if (!(user as any).password) {
        throw new AppError(400, "Please login with Google");
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, (user as any).password);

    if (!isPasswordMatched) {
        throw new AppError(403, "Invalid password");
    }

    const jwtPayload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role as any,
    };

    const accessToken = createToken(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        process.env.JWT_ACCESS_EXPIRES_IN as string
    );

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        },
    };
};

const googleLogin = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new AppError(400, "Invalid Google token");
    }

    const { email, name, picture, sub } = payload;

    let user = await prisma.user.findUnique({
        where: { email: email as string },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: email as string,
                name: name as string,
                image: picture || null,
                emailVerified: true,
            } as any,
        });
    }

    const jwtPayload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role as any,
    };

    const accessToken = createToken(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        process.env.JWT_ACCESS_EXPIRES_IN as string
    );

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        },
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            providerProfile: true
        }
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
};

export const AuthService = {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
};
