"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterCollection = exports.contactCollection = exports.db = exports.postgresDB = exports.addImagesApiKey = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const misc_1 = require("./config/misc");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const middleware_1 = require("./middleware/middleware");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.addImagesApiKey = fs_1.default.readFileSync('./add_imgs_api_key.txt').toString().trim();
const app = (0, express_1.default)();
exports.postgresDB = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: fs_1.default.readFileSync('./postgres_pass.txt').toString().trim(),
    ssl: {
        rejectUnauthorized: true,
        ca: fs_1.default.readFileSync('./us-east-2-bundle.pem').toString(),
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Test database connection on startup
exports.postgresDB.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
    else {
        console.log('Successfully connected to the database');
        release();
    }
});
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
app.use("/api", adminRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "AT Photo API" });
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
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
