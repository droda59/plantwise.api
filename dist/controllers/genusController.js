"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpeciesForGenus = exports.getGenusList = void 0;
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const getGenusList = async (req, res, next) => {
    try {
        const genusList = await dbConnection_1.default.plants.findMany({
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
                species: false,
                functionalGroup: false,
            },
            distinct: ['genus'],
            orderBy: {
                genus: 'asc'
            }
        });
        res.json(genusList.map(g => g.genus));
    }
    catch (error) {
        next(error);
    }
};
exports.getGenusList = getGenusList;
const getSpeciesForGenus = async (req, res, next) => {
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
                genus: false,
                species: true,
                functionalGroup: false,
            },
            where: { genus: req.params.id },
            distinct: ['species'],
            orderBy: {
                species: 'asc'
            }
        });
        res.json(speciesList.map(s => s.species));
    }
    catch (error) {
        next(error);
    }
};
exports.getSpeciesForGenus = getSpeciesForGenus;
