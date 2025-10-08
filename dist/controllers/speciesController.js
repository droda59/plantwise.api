"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlantsBySpecies = exports.getAllSpecies = void 0;
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const getAllSpecies = async (req, res, next) => {
    try {
        const speciesList = await dbConnection_1.default.plants.findMany({
            select: {
                id: false,
                code: false,
                latin: false,
                name: false,
                type: false,
                zone: false,
                native: false,
                droughtTolerant: false,
                floodTolerant: false,
                height: false,
                spread: false,
                saltTolerance: false,
                family: false,
                genus: true,
                species: true,
                functionalGroup: false,
            },
            where: { genus: req.params.id },
            distinct: ['species'],
            orderBy: {
                species: 'asc'
            }
        });
        res.json(speciesList);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSpecies = getAllSpecies;
const getPlantsBySpecies = async (req, res, next) => {
    try {
        const plantsList = await dbConnection_1.default.plants.findMany({
            where: { species: req.query.species },
            orderBy: {
                latin: 'asc'
            }
        });
        res.json(plantsList);
    }
    catch (error) {
        next(error);
    }
};
exports.getPlantsBySpecies = getPlantsBySpecies;
