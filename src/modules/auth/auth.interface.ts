export type UserRole = "USER" | "ADMIN" | "PROVIDER";

export interface IJwtPayload {
    id: string;
    email: string;
    role: UserRole;
}
