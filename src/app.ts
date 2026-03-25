import express, { Application } from "express"
import { postRouter } from "./modules/provider/provider.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
import { MealsRoutes } from "./modules/meals/meals.route";
import { categoriesRouter } from "./modules/categories/categories.router";
import { OrdersRoutes } from "./modules/orders/order.route";
import { ProviderOrderRoutes } from "./modules/provider-order/providerOrder.route";
import { AdminOrdersRoutes } from "./modules/admin/adminOrders.route";
import { adminUserRouter } from "./modules/user-management/adminUser.router";
import { ReviewsRoutes } from "./modules/reviews/reviews.route";

const app: Application = express();
app.set('trust proxy', true);
const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {

            if (!origin) return callback(null, true);

            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/foodhub-client.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin);

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },

        credentials: true,

        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],

        exposedHeaders: ["Set-Cookie"],
    })
);
app.use(express.json());
app.all(/\/api\/auth\/.*/, toNodeHandler(auth));




app.use("/api/provider", postRouter);
app.use("/api/meals", MealsRoutes);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", OrdersRoutes);
app.use("/api/provider/orders", ProviderOrderRoutes);
app.use("/api/admin/order-management", AdminOrdersRoutes);
app.use("/api/reviews", ReviewsRoutes);
app.use("/api/admin/user-management", adminUserRouter);

app.get("/", (req, res) => {
    res.send("Hello world !");
});




export default app;