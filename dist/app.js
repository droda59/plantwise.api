"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const plantRoutes_1 = __importDefault(require("./routes/plantRoutes"));
const genusRoutes_1 = __importDefault(require("./routes/genusRoutes"));
const speciesRoutes_1 = __importDefault(require("./routes/speciesRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
const customCors = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    // Handle preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    // Proceed to next middleware or route
    next();
};
app.use((0, cors_1.default)());
app.use(customCors);
app.use(express_1.default.json());
// Global error handler (should be after routes)
app.use(errorHandler_1.errorHandler);
// Routes
app.use('/api/plants', plantRoutes_1.default);
app.use('/api/genus', genusRoutes_1.default);
app.use('/api/species', speciesRoutes_1.default);
exports.default = app;
