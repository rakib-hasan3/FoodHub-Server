import { auth as betterAuth } from "../lib/auth";
import { success } from "better-auth";
import express, { NextFunction, Request, Response, Router } from "express";
import { UserRole } from "../../generated/prisma/enums";





declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean

            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            //  get user sesssion
            const session = await betterAuth.api.getSession({
                headers: req.headers as any

            })

            // console.log("SESSION 👉", session);
            // console.log("SESSION USER 👉", session?.user);

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorised"
                })
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification requiered ,plz verify your email "
                })

            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            }
            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "forbidden ! You don't have a permission to access this resourcess !"
                })
            }
            next()
        } catch (err) {
            next(err);
        }
    }
}

export default auth;