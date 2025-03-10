import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

export const configureMiddleware = (app: express.Application) => {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "https://api.atphoto.net", "http://localhost:5000"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    app.use(cors({
        origin: process.env.NODE_ENV === 'production' 
            ? 'https://atphoto.net'
            : ['http://localhost:3000', 'http://localhost:5000'],
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50 // limit each IP to 10 requests per windowMs
    });
    app.use('/api/', limiter);

    // request parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // error handling
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ 
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });
};
