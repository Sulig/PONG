import helmet from 'helmet';
import { Express } from 'express';

/**
 * Express security headers configuration using Helmet.
 * Equivalent to Helmet with custom configuration.
 */
export function configureSecurityHeaders(app: Express): void {
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "wss:", "https:"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
            frameguard: {
                action: 'sameorigin',
            },
            noSniff: true,
            xssFilter: true,
            referrerPolicy: {
                policy: 'strict-origin-when-cross-origin',
            },
            // Hide server information
            hidePoweredBy: true,
        })
    );
}

/**
 * Secure error-handling middleware.
 * Avoids leaking stack traces and sensitive information.
 */
export function errorHandler(err: any, req: any, res: any, next: any): void {
    // Log full error server-side (do not expose to client)
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // Generic response to client
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}



