import express, { NextFunction } from 'express';
import cors from 'cors';

import plantRoutes from './routes/plantRoutes';
import groupRoutes from './routes/groupRoutes';
import genusRoutes from './routes/genusRoutes';
import speciesRoutes from './routes/speciesRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

const customCors = (req: any, res: any, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Proceed to next middleware or route
    next();
};
app.use(cors());
app.use(customCors);
app.use(express.json());

// Global error handler (should be after routes)
app.use(errorHandler);

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/genus', genusRoutes);
app.use('/api/species', speciesRoutes);

export default app;
