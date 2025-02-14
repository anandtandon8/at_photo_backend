import express, { Request, Response, NextFunction } from "express";

import { config } from "./config/misc";
import userRoutes from "./routes/userRoutes";
import { configureMiddleware } from "./middleware/middleware";

import admin from 'firebase-admin';

const app = express();

configureMiddleware(app);

const serviceAccount = require("../atphotobackend-b9d66802c105.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const contactCollection = db.collection("contactForm");
const newsletterCollection = db.collection("newsletterSignup");

app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "AT Photo API" });
});

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

app.use(notFound);
app.use(errorHandler);

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

export {
    db,
    contactCollection,
    newsletterCollection
};