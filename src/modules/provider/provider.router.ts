import express, { Router } from "express";
import { ProviderController } from "./provider.controller";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";


const router = express.Router();

router.get(
    "/dashboard-stats",
    // auth(UserRole.ADMIN || UserRole.PROVIDER),
    ProviderController.getProviderStatsForAdmin
);

router.get(
    "/getprofile",

    ProviderController.getProviderProfile
)
router.get(
    "/allproviders",
    ProviderController.getAllProviders
)

router.post(
    "/create",
    auth(UserRole.PROVIDER),
    ProviderController.createProvider
)
router.get("/getmy/dashboard-stats", ProviderController.getMyDashboardStats);

router.patch(
    "/update-status/:id",
    auth(UserRole.ADMIN), // যদি অ্যাডমিন প্রটেকশন থাকে
    ProviderController.updateProviderStatus
);
export const postRouter: Router = router;
