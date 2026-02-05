import express, { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router();

router.get(
    "/",
    ProviderController.getProviderProfile
)

router.post(
    "/",
    auth(UserRole.USER),
    ProviderController.createProvider
)

export const postRouter: Router = router;
