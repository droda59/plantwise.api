import express from 'express';

import plantRoutes from './routes/plantRoutes';
import genusRoutes from './routes/genusRoutes';
import speciesRoutes from './routes/speciesRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Global error handler (should be after routes)
app.use(errorHandler);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    next();
});

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/genus', genusRoutes);
app.use('/api/species', speciesRoutes);

export default app;
