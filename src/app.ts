import express, { Request, Response, NextFunction } from "express";
import { Pool } from 'pg';
import fs from 'fs';
import { config } from "./config/misc";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import { configureMiddleware } from "./middleware/middleware";


import admin from 'firebase-admin';

export const addImagesApiKey = fs.readFileSync('/var/www/html/add_imgs_api_key.txt').toString().trim();

const app = express();

export const postgresDB = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: fs.readFileSync('/var/www/html/postgres_pass.txt').toString().trim(),
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./us-east-2-bundle.pem').toString(),
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection on startup
postgresDB.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

configureMiddleware(app);

const serviceAccount = require("../atphotobackend-b9d66802c105.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const contactCollection = db.collection("contactForm");
const newsletterCollection = db.collection("newsletterSignup");

app.use("/api", userRoutes);
app.use("/api", adminRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "AT Photo API" });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
