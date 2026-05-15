import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { IJwtPayload } from "../modules/auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get token from Authorization header or cookie
            let token = req.headers.authorization;
            
            if (token && token.startsWith("Bearer ")) {
                token = token.split(" ")[1];
            } else if (req.cookies && req.cookies.accessToken) {
                token = req.cookies.accessToken;
            }

            if (!token || token === "null" || token === "undefined") {
                throw new AppError(401, "You are not authorized");
            }

            // Verify token
            let decoded: IJwtPayload;
            try {
                decoded = jwt.verify(
                    token,
                    process.env.JWT_ACCESS_SECRET as string
                ) as IJwtPayload;
            } catch (err) {
                throw new AppError(401, "Invalid or malformed token");
            }

            if (!decoded) {
                throw new AppError(401, "Invalid token");
            }

            // Role based authorization
            if (roles.length && !roles.includes(decoded.role)) {
                throw new AppError(403, "You don't have permission to access this resource");
            }

            // Add user to request
            req.user = decoded;
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;