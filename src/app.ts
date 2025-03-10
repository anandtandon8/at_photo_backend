import express, { Request, Response, NextFunction } from "express";
import { Pool } from 'pg';
import fs from 'fs';
import { config } from "./config/misc";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import { configureMiddleware } from "./middleware/middleware";


import admin from 'firebase-admin';

export const addImagesApiKey = process.env.ADD_IMGS_API_KEY;
const app = express();

const ssl = {
    "type": "service_account",
    "project_id": "atphotobackend",
    "private_key_id": "b9d66802c10531930fa464840fd38664b8d1ebef",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkP+F/f1UfeN6I\n9m9iaGs/jnwxpn8eXTVeKuFrQUgy1mnnVer8y9Bhzdl1mGtyaqgr4YDOfpqxWUHO\n/eNCdwLjjEva4WPe8npTaCpl8pkyWGpZZl4diErmNrl+Zan4AcXvA6gkXnQOZbwy\nzeiYn4TGJGMMkjBzNm7h4aATzSb+PoxKaBipK2V3jM3jaLLhgzp6UTsaNqCJIjBN\na1yTwT3c3f/ugKHsrAPcKWn2D7otKAPeDYUk+erTmhYf9wcyFMCuQDJz1lfgSgEh\nPaeWS6S43Q/P8wOxFQvgSGSp9ouBVvn3uvYBGqitYFje3qW7kAyL1RCRXwP1gs+s\npk8kPX+9AgMBAAECggEAN4Uka12WX4oS5wcuRXx4bEZ0sq/OHmxxYsBp7EBn8E9M\nAxem1AbtDHJxxG9eOpHVAOg8CxD+p149gYOOs2PZRSOibH1treoW8WSvmEB2Cm+a\nm1egDqmIb+MltpUU7DFlP9Ljnk+TOV6oTCAQNK8PSY75MEGmQPuwZYhH/QmG2b+u\nC3WbyNqDT24DgnND3S8GupHA/IykZ7Qt9QSE2/ghcbgEZ/zrjTpO8sKnzUZJXX5Z\nJOIsBZGVZz9qh8jk9rV2Kv8B0dD47Onb7Z3XuAQMrkJ6JwRtS+UltxN4ppDgB45k\nhFZwK5iDrSbDRQNo0+S6Rg8Nyz9Yow8iUIialuN2/QKBgQDXv7/0vaind0Z5ju/a\nPa3jiRY0FrTbWIk/IIUVhTzqEf86tNRx/VxfMcbhK3ilombR8lWO4Ne/hWZgV67z\nXJVOXWqNaVYL7WTSzx48SKVByAYTsn//ZWdSVfFzyXmexTHWN691ubc7M19EXcbF\nbLs/GZsne1wab91KMP9Ue3yxJwKBgQDC5H9DkQYY6areBp81YhqnS7tH7ol9fg/k\nUqXAE7ebqTPGXohPqnZLxqrAuSO7gW6qkA2DGiHJw2S4vQVm++S8fQjCTYdBoXCD\nb9APbFho/he6crnRFlex40LHY/RZXi2qyP1iph3Vk60zqW1qYB/JlsYn4Lanz1p1\n/YIIf2HOewKBgQCueUP74RCt9VhJ35z6adzg4DDTiPVTWUMMiPj3EVvUkx9LU4dm\nc5Uq6q9B0wzrLe1mpUoplI0FNhU3nlE+P0YDLKqJl4DdfmqFzLdP2xPBocfAUB8Q\n4+ltfVEY6Prwudn2ueusEbcrKf1F5Wxkpey7N7Lwd+NhAcv8PqmNoZuSCwKBgEUp\nQ0Rd/bTvjzRVU0BlfSHrTR28t8vx5X/YGHvuQ1UZGYeG2oay7mH7sXLNALI0v2oF\nztW8e0sXbPHmGjmuoECHeolBbANNYBk0n7gpccJokVEYD3r0m9BD3tnVTcw9EKWv\nx8OvQZ0eV/OiZ3K9g+pM+CsEoq0wd2CxwuhzE+lrAoGAGweLSCMrjkLKLzMbEJJO\nPL8oTkfNJfJ/vlkG9ETH4s2Wmb2FCIdFBzMZ4vAxI2hPSkQnFiaGE0/uGFxxkLKn\nc08rjjON7GtwUstXYMLDpfEEBWIzVFdBF1C8RyTwJThZd3aqAYm7fdArDdRHdjlW\nwIW6GKcnl8qb0hWW5WfkbKQ=\n-----END PRIVATE KEY-----\n",
    "client_email": "firestorereadwriteaccessatphot@atphotobackend.iam.gserviceaccount.com",
    "client_id": "108035606497821178609",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firestorereadwriteaccessatphot%40atphotobackend.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

export const postgresDB = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: ssl.toString(),
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
