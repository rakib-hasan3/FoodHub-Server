import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { OrdersController } from "./order.controller";

const router = express.Router();

// USER → place order
router.post(
    "/",
    auth(UserRole.USER),
    OrdersController.createOrder
);

// USER → get my orders
router.get(
    "/my-orders",
    auth(UserRole.USER),
    OrdersController.getMyOrders
);

// ADMIN → get all orders (later use)
router.get(
    "/",
    auth(UserRole.ADMIN),
    OrdersController.getAllOrders
);

export const OrdersRoutes = router;
