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

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));


app.use("/api/provider", postRouter);
app.use("/api/meals", MealsRoutes)
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", OrdersRoutes);
app.use("/api/provider", ProviderOrderRoutes);
app.use("/api/admin", AdminOrdersRoutes);
app.use("/api/reviews", ReviewsRoutes);
// app.use("/api/admin", adminUserRouter);

app.get("/", (req, res) => {
    res.send("Hello world !");
});




export default app;