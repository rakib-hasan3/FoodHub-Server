import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 5000;

// Only listen when running locally, Vercel handles the export
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// For Vercel CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    (module as any).exports = app;
}
export default app;