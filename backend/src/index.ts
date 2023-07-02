import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import coffeeController from '~/controllers/coffeeController';
import logger from '~/utils/logger';
import ControllerError from '~/errors/ControllerError';

dotenv.config({
    path: '../.env'
});

const app: Express = express();
const port = process.env.BACKEND_PORT || 3000;

// Default headers
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', ['*']);
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Logging
app.use((req, res, next) => {
    res.on('finish', () => {
        const e = res.locals.error;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
        const message = level === 'info' ? '' : `| ${e?.message || 'No message'}`;
        logger.log(level, `${res.statusCode} - ${req.method} - ${req.url} from ${req.ip} ${message}`, level === 'error' ? e : null);
    });
    next();
});

// Routes
app.get('/coffee/:index', coffeeController.getCoffee.bind(coffeeController));

app.get('*', (req, res) => {
    res.sendStatus(404);
});

// Listen
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Error handler
app.use((e: any, req: Request, res: Response) => {
    const status = e?.statusCode || e?.status || 500;
    res.locals.error = e;

    // ControllerErrors should have safe messages that can be shown to api clients
    if (e instanceof ControllerError && e?.message) {
        res.status(status).send(e.message);
    } else {
        res.sendStatus(status);
    }
});