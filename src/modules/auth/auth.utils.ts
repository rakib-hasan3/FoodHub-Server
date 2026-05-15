import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "./auth.interface";

export const createToken = (
    jwtPayload: IJwtPayload,
    secret: string,
    expiresIn: string
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn: expiresIn as any,
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as IJwtPayload;
};
