import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { ProviderOrderController } from "./providerOrder.controller";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.PROVIDER),
    ProviderOrderController.getMyOrders
);

router.patch(
    "/:orderId/status",
    auth(UserRole.PROVIDER),
    ProviderOrderController.updateOrderStatus
);

export const ProviderOrderRoutes = router;
