import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProviderOrderController } from "./providerOrder.controller";

const router = express.Router();

// No strict role — service validates provider ownership via Provider_Profile
router.get(
    "/",
    auth(),
    ProviderOrderController.getMyOrders
);

router.patch(
    "/:orderId/status",
    auth(),
    ProviderOrderController.updateOrderStatus
);

export const ProviderOrderRoutes = router;
