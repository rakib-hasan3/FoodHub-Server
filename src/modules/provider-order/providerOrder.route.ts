import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { ProviderOrderController } from "./providerOrder.controller";

const router = express.Router();

router.get(
    "/orders",
    auth(UserRole.PROVIDER),
    ProviderOrderController.getMyOrders
);

router.patch(
    "/orders/:orderId/status",
    auth(UserRole.PROVIDER),
    ProviderOrderController.updateOrderStatus
);

export const ProviderOrderRoutes = router;
