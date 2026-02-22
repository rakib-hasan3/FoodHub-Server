import express, { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router();

router.get(
    "/dashboard-stats",
    auth(UserRole.ADMIN),
    ProviderController.getProviderStatsForAdmin
);

router.get(
    "/",

    ProviderController.getProviderProfile
)
router.get(
    "/allproviders",
    ProviderController.getAllProviders
)

router.post(
    "/",
    auth(UserRole.PROVIDER),
    ProviderController.createProvider
)

router.patch(
    "/update-status/:id",
    // auth(UserRole.ADMIN), // যদি অ্যাডমিন প্রটেকশন থাকে
    ProviderController.updateProviderStatus
);
export const postRouter: Router = router;
