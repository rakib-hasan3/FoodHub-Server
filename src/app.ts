import express, { Application } from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
import { postRouter } from "./modules/provider/provider.router";
import { MealsRoutes } from "./modules/meals/meals.route";
import { categoriesRouter } from "./modules/categories/categories.router";
import { OrdersRoutes } from "./modules/orders/order.route";
import { ProviderOrderRoutes } from "./modules/provider-order/providerOrder.route";
import { AdminOrdersRoutes } from "./modules/admin/adminOrders.route";
import { adminUserRouter } from "./modules/user-management/adminUser.router";
import { ReviewsRoutes } from "./modules/reviews/reviews.route";
import { AIRoutes } from "./modules/ai/ai.route";
import { AuthRoutes } from "./modules/auth/auth.route";
import { MealsController } from "./modules/meals/meals.controller";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();
app.set('trust proxy', true);

const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.PROD_APP_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isAllowed =
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1");

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/provider/orders", ProviderOrderRoutes);
app.use("/api/provider", postRouter);
app.use("/api/meals", MealsRoutes);
app.get("/api/offers", MealsController.getDiscountedMeals);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", OrdersRoutes);
app.use("/api/admin/order-management", AdminOrdersRoutes);
app.use("/api/reviews", ReviewsRoutes);
app.use("/api/admin/user-management", adminUserRouter);
app.use("/api/ai", AIRoutes);

app.get("/", (req, res) => {
    console.log("Root route hit!");
    res.send("Hello world !");
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API Not Found !!",
        errorSources: [
            {
                path: req.originalUrl,
                message: "API Not Found !!",
            },
        ],
    });
});

export default app;