"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterCollection = exports.contactCollection = exports.db = void 0;
const express_1 = __importDefault(require("express"));
const misc_1 = require("./config/misc");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const middleware_1 = require("./middleware/middleware");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app = (0, express_1.default)();
(0, middleware_1.configureMiddleware)(app);
const serviceAccount = require("../atphotobackend-b9d66802c105.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const db = firebase_admin_1.default.firestore();
exports.db = db;
const contactCollection = db.collection("contactForm");
exports.contactCollection = contactCollection;
const newsletterCollection = db.collection("newsletterSignup");
exports.newsletterCollection = newsletterCollection;
app.use("/api", userRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "AT Photo API" });
});
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
app.use(notFound);
app.use(errorHandler);
const PORT = misc_1.config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
