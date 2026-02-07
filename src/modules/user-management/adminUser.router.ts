import express from "express";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { AdminUserController } from "./adminUser.controller";

const router = express.Router();

router.get(
    "/users",
    auth(UserRole.ADMIN),
    AdminUserController.getAllUsers
);

router.patch(
    "/users/:id/role",
    auth(UserRole.ADMIN),
    AdminUserController.updateUserRole
);

router.patch(
    "/users/:id/status",
    auth(UserRole.ADMIN),
    AdminUserController.updateUserStatus
);

export const adminUserRouter = router;
