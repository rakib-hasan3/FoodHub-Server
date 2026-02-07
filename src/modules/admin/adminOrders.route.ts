import express, { Router } from "express";
import { AdminOrdersController } from "./adminOrders.controller";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { AdminUserController } from "../user-management/adminUser.controller";


const router = express.Router();

//  Admin – get all orders
router.get(
    "/orders",
    auth(UserRole.ADMIN),
    AdminOrdersController.getAllOrders
);

//   Admin – update order status
router.patch(
    "/orders/:id/status",
    auth(UserRole.ADMIN),
    AdminOrdersController.updateOrderStatus
);

router.get(
    "/dashboard-stats",
    auth(UserRole.ADMIN),
    AdminOrdersController.getDashboardStats
);


export const AdminOrdersRoutes: Router = router;
